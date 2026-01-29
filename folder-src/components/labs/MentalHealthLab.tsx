/**
 * Mental Health Lab Component
 * PHQ-9 (Depression), GAD-7 (Anxiety), Stress Assessment, Mood Tracking
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Heart, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { Questionnaire, Question } from '@/components/Questionnaire';
import { scorePHQ9, scoreGAD7, calculateMentalHealthScore } from '@/utils/mentalHealthScoring';
import { saveTestResult, generateTestResultId } from '@/services/healthDataService';
import { HealthTestResult } from '@/types/health';

const PHQ9_QUESTIONS: Question[] = [
  { id: 'phq9-1', text: 'Little interest or pleasure in doing things', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'phq9-2', text: 'Feeling down, depressed, or hopeless', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'phq9-3', text: 'Trouble falling or staying asleep, or sleeping too much', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'phq9-4', text: 'Feeling tired or having little energy', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'phq9-5', text: 'Poor appetite or overeating', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'phq9-6', text: 'Feeling bad about yourself or that you are a failure', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'phq9-7', text: 'Trouble concentrating on things', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'phq9-8', text: 'Moving or speaking so slowly that other people could have noticed', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'phq9-9', text: 'Thoughts that you would be better off dead', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
];

const GAD7_QUESTIONS: Question[] = [
  { id: 'gad7-1', text: 'Feeling nervous, anxious, or on edge', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'gad7-2', text: 'Not being able to stop or control worrying', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'gad7-3', text: 'Worrying too much about different things', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'gad7-4', text: 'Trouble relaxing', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'gad7-5', text: 'Being so restless that it is hard to sit still', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'gad7-6', text: 'Becoming easily annoyed or irritable', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
  { id: 'gad7-7', text: 'Feeling afraid, as if something awful might happen', options: [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ]},
];

export const MentalHealthLab: React.FC = () => {
  const [phq9Answers, setPhq9Answers] = useState<number[]>(new Array(9).fill(undefined));
  const [gad7Answers, setGad7Answers] = useState<number[]>(new Array(7).fill(undefined));
  const [activeTab, setActiveTab] = useState<'phq9' | 'gad7' | 'results'>('phq9');
  const [results, setResults] = useState<{
    phq9: ReturnType<typeof scorePHQ9>;
    gad7: ReturnType<typeof scoreGAD7>;
    overall: ReturnType<typeof calculateMentalHealthScore>;
    timestamp: string;
  } | null>(null);

  const handlePhq9Answer = (index: number, value: number) => {
    const newAnswers = [...phq9Answers];
    newAnswers[index] = value;
    setPhq9Answers(newAnswers);
  };

  const handleGad7Answer = (index: number, value: number) => {
    const newAnswers = [...gad7Answers];
    newAnswers[index] = value;
    setGad7Answers(newAnswers);
  };

  const calculateResults = () => {
    if (phq9Answers.some(a => a === undefined) || gad7Answers.some(a => a === undefined)) {
      alert('Please answer all questions before viewing results.');
      return;
    }

    const phq9Result = scorePHQ9(phq9Answers);
    const gad7Result = scoreGAD7(gad7Answers);
    const overallResult = calculateMentalHealthScore(phq9Result, gad7Result);

    const assessmentResults = {
      phq9: phq9Result,
      gad7: gad7Result,
      overall: overallResult,
      timestamp: new Date().toISOString()
    };

    setResults(assessmentResults);
    setActiveTab('results');

    // Save to unified health data storage
    try {
      const healthTestResult: HealthTestResult = {
        id: generateTestResultId('mental-health-assessment'),
        testType: 'mental-health-assessment',
        category: 'mental-health',
        testDate: assessmentResults.timestamp,
        timestamp: assessmentResults.timestamp,
        data: assessmentResults,
        score: overallResult.overallScore,
        maxScore: 100,
        scorePercentage: overallResult.overallScore,
        riskLevel: overallResult.riskLevel === 'low' ? 'low' : 
                   overallResult.riskLevel === 'medium' ? 'medium' : 
                   overallResult.riskLevel === 'high' ? 'high' : 'critical',
        interpretation: overallResult.interpretation,
        recommendations: overallResult.recommendations,
        status: 'final',
      };
      saveTestResult(healthTestResult);
      console.log('Mental health assessment saved to localStorage');
    } catch (error) {
      console.error('Error saving mental health assessment:', error);
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, string> = {
      'minimal': 'bg-green-600 text-white',
      'mild': 'bg-yellow-500 text-white',
      'moderate': 'bg-orange-500 text-white',
      'moderately-severe': 'bg-red-500 text-white',
      'severe': 'bg-red-700 text-white'
    };
    return variants[severity] || 'bg-gray-500 text-white';
  };

  const phq9Complete = !phq9Answers.some(a => a === undefined);
  const gad7Complete = !gad7Answers.some(a => a === undefined);

  return (
    <div className="space-y-8 pt-24 bg-gradient-to-b from-blue-50 via-white to-green-50 min-h-screen pb-12">
      {/* Header */}
      <div className="text-center space-y-4 bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600 max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Brain className="w-8 h-8 text-purple-600" />
          <h1 className="text-4xl font-bold text-gray-900">Mental Health Lab</h1>
        </div>
        <p className="text-lg text-gray-700">PHQ-9 (Depression) and GAD-7 (Anxiety) Screening</p>
        <Badge className="bg-purple-600 text-white mt-2">Self-Assessment</Badge>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="phq9" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              PHQ-9
            </TabsTrigger>
            <TabsTrigger value="gad7" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              GAD-7
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              disabled={!phq9Complete || !gad7Complete}
            >
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phq9" className="mt-6">
            <Questionnaire
              title="PHQ-9 Depression Screening"
              description="Over the last 2 weeks, how often have you been bothered by any of the following problems?"
              questions={PHQ9_QUESTIONS}
              answers={phq9Answers}
              onAnswerChange={handlePhq9Answer}
            />
            {phq9Complete && (
              <div className="mt-4 text-center">
                <Button onClick={() => setActiveTab('gad7')} className="bg-blue-600 hover:bg-blue-700">
                  Continue to GAD-7 →
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="gad7" className="mt-6">
            <Questionnaire
              title="GAD-7 Anxiety Screening"
              description="Over the last 2 weeks, how often have you been bothered by the following problems?"
              questions={GAD7_QUESTIONS}
              answers={gad7Answers}
              onAnswerChange={handleGad7Answer}
            />
            {gad7Complete && (
              <div className="mt-4 text-center">
                <Button onClick={calculateResults} className="bg-purple-600 hover:bg-purple-700">
                  View Results
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {results && (
              <Card className="bg-white shadow-lg border-l-4 border-blue-600">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                  <CardTitle className="text-gray-900">Mental Health Assessment Results</CardTitle>
                  <CardDescription className="text-gray-600">
                    Generated: {new Date(results.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 bg-white">
                  {/* Overall Score */}
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <div className="text-sm text-gray-600 mb-2">Overall Mental Health Score</div>
                    <div className="text-5xl font-bold text-purple-600 mb-2">{results.overall.overallScore}/100</div>
                    <Badge className={getSeverityBadge(results.overall.riskLevel)}>
                      {results.overall.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>

                  {/* PHQ-9 Results */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900">PHQ-9 (Depression) Results</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded border border-blue-200">
                        <div className="text-sm text-gray-600">Score</div>
                        <div className="text-2xl font-bold text-blue-600">{results.phq9.score}/27</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded border border-blue-200">
                        <div className="text-sm text-gray-600">Severity</div>
                        <Badge className={`mt-2 ${getSeverityBadge(results.phq9.severity)}`}>
                          {results.phq9.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-gray-700">{results.phq9.interpretation}</p>
                    </div>
                  </div>

                  {/* GAD-7 Results */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900">GAD-7 (Anxiety) Results</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded border border-green-200">
                        <div className="text-sm text-gray-600">Score</div>
                        <div className="text-2xl font-bold text-green-600">{results.gad7.score}/21</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded border border-green-200">
                        <div className="text-sm text-gray-600">Severity</div>
                        <Badge className={`mt-2 ${getSeverityBadge(results.gad7.severity)}`}>
                          {results.gad7.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-gray-700">{results.gad7.interpretation}</p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900">Recommendations</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                      {results.overall.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Disclaimer */}
                  <div className="text-xs text-gray-600 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 border border-yellow-200">
                    <strong className="text-gray-900">⚠️ Important Disclaimer:</strong> These screening tools are for self-assessment purposes only and are not diagnostic. 
                    They do not replace professional mental health evaluation. If you are experiencing severe symptoms or thoughts of self-harm, 
                    please seek immediate professional help or contact a crisis helpline.
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

export default MentalHealthLab;

