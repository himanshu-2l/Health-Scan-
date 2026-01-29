/**
 * Vision & Hearing Lab Component
 * Visual acuity, color blindness, hearing tests, and peripheral vision
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Ear, Target, TrendingUp } from 'lucide-react';
import { calculateVisualAcuity, analyzeColorBlindness, analyzePeripheralVision, calculateOverallVisionScore } from '@/utils/visionTests';
import { analyzeHearingTest } from '@/utils/hearingTests';
import { saveTestResult, generateTestResultId } from '@/services/healthDataService';
import { HealthTestResult } from '@/types/health';

export const VisionHearingLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vision' | 'hearing' | 'results'>('vision');
  
  // Vision test state
  const [visionTestAnswers, setVisionTestAnswers] = useState<boolean[]>([]);
  const [colorBlindAnswers, setColorBlindAnswers] = useState<boolean[]>([]);
  const [peripheralAnswers, setPeripheralAnswers] = useState<boolean[]>([]);
  
  // Hearing test state
  const [detectedFrequencies, setDetectedFrequencies] = useState<number[]>([]);
  const [leftEarResponses, setLeftEarResponses] = useState<boolean[]>([]);
  const [rightEarResponses, setRightEarResponses] = useState<boolean[]>([]);
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    return () => {
      stopHearingTest();
    };
  }, []);

  // Vision Acuity Test (Simplified Snellen chart)
  const visionTestLetters = ['E', 'F', 'P', 'T', 'O', 'Z', 'L', 'P', 'E', 'D'];
  const [currentVisionLetter, setCurrentVisionLetter] = useState(0);

  const handleVisionAnswer = (correct: boolean) => {
    const newAnswers = [...visionTestAnswers, correct];
    setVisionTestAnswers(newAnswers);
    
    if (currentVisionLetter < visionTestLetters.length - 1) {
      setCurrentVisionLetter(currentVisionLetter + 1);
    } else {
      // Move to color blindness test
      setActiveTab('vision');
    }
  };

  // Color Blindness Test (Simplified Ishihara)
  const colorBlindTests = [
    { correct: true, description: 'Can you see the number 12?', number: '12' },
    { correct: true, description: 'Can you see the number 8?', number: '8' },
    { correct: false, description: 'Can you see the number 5?', number: '5' },
    { correct: true, description: 'Can you see the number 29?', number: '29' },
    { correct: false, description: 'Can you see the number 74?', number: '74' },
  ];
  const [currentColorTest, setCurrentColorTest] = useState(0);

  const handleColorBlindAnswer = (answer: boolean) => {
    const newAnswers = [...colorBlindAnswers, answer === colorBlindTests[currentColorTest].correct];
    setColorBlindAnswers(newAnswers);
    
    if (currentColorTest < colorBlindTests.length - 1) {
      setCurrentColorTest(currentColorTest + 1);
    }
  };

  // Hearing Test
  const testFrequencies = [250, 500, 1000, 2000, 4000, 8000]; // Hz
  const [currentFreqIndex, setCurrentFreqIndex] = useState(0);
  const [hearingTestEar, setHearingTestEar] = useState<'left' | 'right'>('left');

  const playFrequency = (frequency: number) => {
    try {
      // Stop any existing oscillator first
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
          // Oscillator may already be stopped
        }
        oscillatorRef.current = null;
      }
      
      // Reuse existing audio context if available, otherwise create new one
      let audioContext = audioContextRef.current;
      if (!audioContext || audioContext.state === 'closed') {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
      }
      
      // Resume audio context if suspended (required for user interaction)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Create stereo panner to direct sound to specific ear
      const panner = audioContext.createStereoPanner();
      
      // Set pan value: -1 = left ear, 1 = right ear, 0 = center
      // This works with stereo speakers and Bluetooth headphones
      panner.pan.value = hearingTestEar === 'left' ? -1 : 1;
      
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.3; // Moderate volume
      
      // Connect: oscillator -> gain -> panner -> destination
      oscillator.connect(gainNode);
      gainNode.connect(panner);
      panner.connect(audioContext.destination);
      
      oscillatorRef.current = oscillator;
      setCurrentFrequency(frequency);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1); // Play for 1 second
      
      setTimeout(() => {
        setCurrentFrequency(null);
      }, 1000);
    } catch (error) {
      console.error('Error playing frequency:', error);
    }
  };

  const handleHearingResponse = (heard: boolean) => {
    if (hearingTestEar === 'left') {
      const newResponses = [...leftEarResponses, heard];
      setLeftEarResponses(newResponses);
      if (heard) {
        setDetectedFrequencies([...detectedFrequencies, testFrequencies[currentFreqIndex]]);
      }
      
      if (currentFreqIndex < testFrequencies.length - 1) {
        setCurrentFreqIndex(currentFreqIndex + 1);
      } else {
        // Switch to right ear
        setHearingTestEar('right');
        setCurrentFreqIndex(0);
      }
    } else {
      const newResponses = [...rightEarResponses, heard];
      setRightEarResponses(newResponses);
      if (heard) {
        setDetectedFrequencies([...detectedFrequencies, testFrequencies[currentFreqIndex]]);
      }
      
      if (currentFreqIndex < testFrequencies.length - 1) {
        setCurrentFreqIndex(currentFreqIndex + 1);
      } else {
        // Test complete
        calculateResults();
      }
    }
  };

  const stopHearingTest = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  const calculateResults = () => {
    // Validate that we have enough data before calculating
    if (visionTestAnswers.length === 0 || colorBlindAnswers.length === 0) {
      console.error('Cannot calculate results: insufficient vision test data');
      return;
    }
    
    // Vision results
    const visualAcuity = calculateVisualAcuity(
      visionTestAnswers.filter(a => a).length,
      visionTestAnswers.length
    );
    
    const colorBlindness = analyzeColorBlindness(
      colorBlindAnswers.filter(a => a).length,
      colorBlindAnswers.length,
      { redGreen: 2, blueYellow: 1 } // Simplified error pattern
    );
    
    // Peripheral vision test - only calculate if we have data
    // If no peripheral test data, use a default "normal" result
    const peripheralVision = peripheralAnswers.length > 0
      ? analyzePeripheralVision(
          peripheralAnswers.filter(a => a).length,
          peripheralAnswers.length,
          peripheralAnswers.filter(a => !a).length
        )
      : {
          score: 100, // Default to normal if test not taken
          blindSpots: 0,
          interpretation: 'Peripheral vision test not completed. This is a simplified screening tool.'
        };
    
    const visionOverall = calculateOverallVisionScore(visualAcuity, colorBlindness, peripheralVision);
    
    // Hearing results
    const hearingResult = analyzeHearingTest(
      detectedFrequencies.length > 0 ? detectedFrequencies : [250, 8000],
      leftEarResponses,
      rightEarResponses
    );
    
    const combinedResults = {
      timestamp: new Date().toISOString(),
      vision: {
        visualAcuity,
        colorBlindness,
        peripheralVision,
        overallScore: visionOverall.overallScore,
        recommendations: visionOverall.recommendations
      },
      hearing: hearingResult
    };
    
    setResults(combinedResults);
    setActiveTab('results');
    
    // Save vision test
    try {
      const visionTestResult: HealthTestResult = {
        id: generateTestResultId('vision-test'),
        testType: 'vision-test',
        category: 'vision-hearing',
        testDate: combinedResults.timestamp,
        timestamp: combinedResults.timestamp,
        data: combinedResults.vision,
        score: visionOverall.overallScore,
        maxScore: 100,
        scorePercentage: visionOverall.overallScore,
        riskLevel: visionOverall.overallScore >= 80 ? 'low' : visionOverall.overallScore >= 60 ? 'medium' : 'high',
        interpretation: `Visual Acuity: ${visualAcuity.snellenEquivalent} | Color Vision: ${colorBlindness.type} | Peripheral: ${peripheralVision.score}%`,
        recommendations: visionOverall.recommendations,
        status: 'final',
      };
      saveTestResult(visionTestResult);
    } catch (error) {
      console.error('Error saving vision test:', error);
    }
    
    // Save hearing test
    try {
      const hearingTestResult: HealthTestResult = {
        id: generateTestResultId('hearing-test'),
        testType: 'hearing-test',
        category: 'vision-hearing',
        testDate: combinedResults.timestamp,
        timestamp: combinedResults.timestamp,
        data: combinedResults.hearing,
        score: hearingResult.overallScore,
        maxScore: 100,
        scorePercentage: hearingResult.overallScore,
        riskLevel: hearingResult.overallScore >= 80 ? 'low' : hearingResult.overallScore >= 60 ? 'medium' : 'high',
        interpretation: `Frequency Range: ${hearingResult.frequencyRange.lowFreq}-${hearingResult.frequencyRange.highFreq}Hz | Sensitivity: ${hearingResult.sensitivity.average}%`,
        recommendations: hearingResult.recommendations,
        status: 'final',
      };
      saveTestResult(hearingTestResult);
    } catch (error) {
      console.error('Error saving hearing test:', error);
    }
  };

  // Vision test is complete when all letters are answered AND all color blindness tests are done
  const visionComplete = visionTestAnswers.length >= visionTestLetters.length && colorBlindAnswers.length >= colorBlindTests.length;
  const hearingComplete = leftEarResponses.length >= testFrequencies.length && rightEarResponses.length >= testFrequencies.length;

  return (
    <div className="space-y-8 pt-24 bg-gradient-to-b from-blue-50 via-white to-green-50 min-h-screen pb-12">
      {/* Header */}
      <div className="text-center space-y-4 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600 max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Eye className="w-8 h-8 text-indigo-600" />
          <Ear className="w-8 h-8 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-900">Vision & Hearing Lab</h1>
        </div>
        <p className="text-lg text-gray-700">Visual acuity, color blindness, and hearing assessment</p>
        <Badge className="bg-indigo-600 text-white mt-2">Interactive Tests</Badge>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="vision" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Vision Tests
            </TabsTrigger>
            <TabsTrigger value="hearing" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Hearing Test
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              disabled={!visionComplete || !hearingComplete}
            >
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vision" className="mt-6 space-y-6">
            {/* Visual Acuity Test */}
            <Card className="bg-white shadow-md border-l-4 border-blue-600">
              <CardHeader>
                <CardTitle className="text-gray-900">Visual Acuity Test</CardTitle>
                <CardDescription className="text-gray-600">
                  Identify the letters shown (Test {currentVisionLetter + 1} of {visionTestLetters.length})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentVisionLetter < visionTestLetters.length ? (
                  <div className="text-center space-y-6">
                    <div className="text-9xl font-bold text-gray-900 mb-8">
                      {visionTestLetters[currentVisionLetter]}
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={() => handleVisionAnswer(true)} className="bg-green-600 hover:bg-green-700">
                        Correct
                      </Button>
                      <Button onClick={() => handleVisionAnswer(false)} className="bg-red-600 hover:bg-red-700">
                        Incorrect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    Visual acuity test complete! Proceed to color blindness test.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Color Blindness Test */}
            {visionTestAnswers.length >= visionTestLetters.length && (
              <Card className="bg-white shadow-md border-l-4 border-green-600">
                <CardHeader>
                  <CardTitle className="text-gray-900">Color Blindness Test</CardTitle>
                  <CardDescription className="text-gray-600">
                    Test {currentColorTest + 1} of {colorBlindTests.length}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentColorTest < colorBlindTests.length ? (
                    <div className="text-center space-y-6">
                      <div className="text-lg text-gray-700 mb-4">
                        {colorBlindTests[currentColorTest].description}
                      </div>
                      <div className="w-64 h-64 mx-auto rounded-lg bg-gradient-to-br from-red-500 via-green-500 to-blue-500 flex items-center justify-center">
                        <div className="text-white text-6xl font-bold">{colorBlindTests[currentColorTest].number}</div>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button onClick={() => handleColorBlindAnswer(true)} className="bg-green-600 hover:bg-green-700">
                          Yes
                        </Button>
                        <Button onClick={() => handleColorBlindAnswer(false)} className="bg-red-600 hover:bg-red-700">
                          No
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-600">
                      Color blindness test complete!
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="hearing" className="mt-6">
            <Card className="bg-white shadow-md border-l-4 border-purple-600">
              <CardHeader>
                <CardTitle className="text-gray-900">Hearing Test</CardTitle>
                <CardDescription className="text-gray-600">
                  Testing {hearingTestEar} ear - Frequency {currentFreqIndex + 1} of {testFrequencies.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <div className="text-2xl text-gray-700">
                    Current Frequency: {testFrequencies[currentFreqIndex]} Hz
                  </div>
                  <Button 
                    onClick={() => playFrequency(testFrequencies[currentFreqIndex])}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={currentFrequency !== null}
                  >
                    Play Sound
                  </Button>
                  {currentFrequency && (
                    <div className="flex gap-4 justify-center mt-4">
                      <Button onClick={() => handleHearingResponse(true)} className="bg-green-600 hover:bg-green-700">
                        I Heard It
                      </Button>
                      <Button onClick={() => handleHearingResponse(false)} className="bg-red-600 hover:bg-red-700">
                        Didn't Hear
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {results && (
              <Card className="bg-white shadow-lg border-l-4 border-blue-600">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                  <CardTitle className="text-gray-900">Vision & Hearing Assessment Results</CardTitle>
                  <CardDescription className="text-gray-600">
                    Generated: {new Date(results.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 bg-white">
                  {/* Vision Results */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900">Vision Assessment</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded border border-blue-200">
                        <div className="text-sm text-gray-600">Visual Acuity</div>
                        <div className="text-xl font-bold text-blue-600">{results.vision.visualAcuity.snellenEquivalent}</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded border border-green-200">
                        <div className="text-sm text-gray-600">Color Vision</div>
                        <Badge className="mt-1">{results.vision.colorBlindness.type}</Badge>
                      </div>
                      <div className="bg-purple-50 p-4 rounded border border-purple-200">
                        <div className="text-sm text-gray-600">Peripheral</div>
                        <div className="text-xl font-bold text-purple-600">{results.vision.peripheralVision.score}%</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded border border-orange-200">
                        <div className="text-sm text-gray-600">Overall</div>
                        <div className="text-xl font-bold text-orange-600">{results.vision.overallScore}/100</div>
                      </div>
                    </div>
                  </div>

                  {/* Hearing Results */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900">Hearing Assessment</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded border border-blue-200">
                        <div className="text-sm text-gray-600">Frequency Range</div>
                        <div className="text-lg font-bold text-blue-600">
                          {results.hearing.frequencyRange.lowFreq}-{results.hearing.frequencyRange.highFreq}Hz
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded border border-green-200">
                        <div className="text-sm text-gray-600">Left Ear</div>
                        <div className="text-xl font-bold text-green-600">{results.hearing.sensitivity.leftEar}%</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded border border-green-200">
                        <div className="text-sm text-gray-600">Right Ear</div>
                        <div className="text-xl font-bold text-green-600">{results.hearing.sensitivity.rightEar}%</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded border border-orange-200">
                        <div className="text-sm text-gray-600">Overall</div>
                        <div className="text-xl font-bold text-orange-600">{results.hearing.overallScore}/100</div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900">Recommendations</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                      {results.vision.recommendations.map((rec: string, idx: number) => (
                        <li key={`vision-${idx}`}>{rec}</li>
                      ))}
                      {results.hearing.recommendations.map((rec: string, idx: number) => (
                        <li key={`hearing-${idx}`}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Disclaimer */}
                  <div className="text-xs text-gray-600 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 border border-yellow-200">
                    <strong className="text-gray-900">⚠️ Important Disclaimer:</strong> These tests are simplified screening tools. 
                    They do not replace professional eye or hearing examinations. Always consult qualified healthcare professionals for accurate vision and hearing assessments.
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VisionHearingLab;

