/**
 * Hearing Test Utilities
 * Frequency range detection and hearing assessment
 */

export interface HearingTestResult {
  frequencyRange: {
    lowFreq: number;      // Lowest detectable frequency (Hz)
    highFreq: number;     // Highest detectable frequency (Hz)
    score: number;        // 0-100
    interpretation: string;
  };
  sensitivity: {
    leftEar: number;      // 0-100
    rightEar: number;     // 0-100
    average: number;      // 0-100
    interpretation: string;
  };
  overallScore: number;
  recommendations: string[];
}

/**
 * Analyze hearing test results
 */
export function analyzeHearingTest(
  detectedFrequencies: number[], // Hz
  leftEarResponses: boolean[],
  rightEarResponses: boolean[]
): HearingTestResult {
  // Calculate frequency range
  const lowFreq = Math.min(...detectedFrequencies);
  const highFreq = Math.max(...detectedFrequencies);
  
  // Normal human hearing: 20 Hz to 20,000 Hz
  const normalRange = 20000 - 20;
  const detectedRange = highFreq - lowFreq;
  const frequencyScore = Math.min(100, (detectedRange / normalRange) * 100);

  let frequencyInterpretation: string;
  if (frequencyScore >= 90) {
    frequencyInterpretation = 'Excellent hearing range detected. Your ability to detect frequencies appears normal.';
  } else if (frequencyScore >= 75) {
    frequencyInterpretation = 'Good hearing range with minor limitations.';
  } else if (frequencyScore >= 60) {
    frequencyInterpretation = 'Moderate hearing range reduction detected. Professional hearing evaluation recommended.';
  } else {
    frequencyInterpretation = 'Significant hearing range reduction detected. Immediate professional hearing evaluation strongly recommended.';
  }

  // Calculate ear sensitivity
  const leftEarScore = (leftEarResponses.filter(r => r).length / leftEarResponses.length) * 100;
  const rightEarScore = (rightEarResponses.filter(r => r).length / rightEarResponses.length) * 100;
  const averageSensitivity = (leftEarScore + rightEarScore) / 2;

  let sensitivityInterpretation: string;
  if (averageSensitivity >= 90) {
    sensitivityInterpretation = 'Normal hearing sensitivity in both ears.';
  } else if (averageSensitivity >= 75) {
    sensitivityInterpretation = 'Mild hearing sensitivity reduction. Monitor and consider professional evaluation.';
  } else if (averageSensitivity >= 60) {
    sensitivityInterpretation = 'Moderate hearing sensitivity reduction. Professional hearing evaluation recommended.';
  } else {
    sensitivityInterpretation = 'Significant hearing sensitivity reduction. Immediate professional hearing evaluation strongly recommended.';
  }

  // Calculate overall score
  const overallScore = Math.round((frequencyScore * 0.4) + (averageSensitivity * 0.6));

  // Generate recommendations
  const recommendations: string[] = [];

  if (overallScore >= 80) {
    recommendations.push('Maintain hearing health practices');
    recommendations.push('Protect ears from loud noises');
    recommendations.push('Schedule regular hearing checkups');
  } else if (overallScore >= 60) {
    recommendations.push('Schedule professional hearing evaluation');
    recommendations.push('Use hearing protection in noisy environments');
    recommendations.push('Avoid prolonged exposure to loud sounds');
  } else {
    recommendations.push('Immediate professional hearing evaluation recommended');
    recommendations.push('Consult with an audiologist or ENT specialist');
    recommendations.push('Consider hearing aids if recommended by professional');
    recommendations.push('Use hearing protection consistently');
  }

  if (Math.abs(leftEarScore - rightEarScore) > 15) {
    recommendations.push('Significant difference between ears detected - professional evaluation important');
  }

  return {
    frequencyRange: {
      lowFreq: Math.round(lowFreq),
      highFreq: Math.round(highFreq),
      score: Math.round(frequencyScore),
      interpretation: frequencyInterpretation
    },
    sensitivity: {
      leftEar: Math.round(leftEarScore),
      rightEar: Math.round(rightEarScore),
      average: Math.round(averageSensitivity),
      interpretation: sensitivityInterpretation
    },
    overallScore,
    recommendations: [...new Set(recommendations)]
  };
}

