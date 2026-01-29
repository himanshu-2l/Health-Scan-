/**
 * Vision Test Utilities
 * Visual acuity, color blindness, and peripheral vision tests
 */

import {
  validateDataQuality,
  confidenceInterval
} from './statisticalAccuracy';

export interface VisionTestResult {
  visualAcuity: {
    score: number; // 0-100
    snellenEquivalent: string; // e.g., "20/20"
    interpretation: string;
  };
  colorBlindness: {
    score: number; // 0-100
    type: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'unknown';
    interpretation: string;
  };
  peripheralVision: {
    score: number; // 0-100
    blindSpots: number;
    interpretation: string;
  };
  overallScore: number;
  recommendations: string[];
}

/**
 * Calculate visual acuity score from test results
 */
export function calculateVisualAcuity(
  correctAnswers: number,
  totalQuestions: number,
  distance: number = 20 // feet
): VisionTestResult['visualAcuity'] {
  // Validate input data
  if (totalQuestions <= 0 || correctAnswers < 0 || correctAnswers > totalQuestions) {
    return {
      score: 0,
      snellenEquivalent: '20/60 or worse',
      interpretation: 'Invalid test data. Please retake the test.'
    };
  }
  
  const accuracy = (correctAnswers / totalQuestions) * 100;
  
  // Map accuracy to Snellen equivalent
  let snellenEquivalent: string;
  if (accuracy >= 95) {
    snellenEquivalent = '20/20';
  } else if (accuracy >= 85) {
    snellenEquivalent = '20/25';
  } else if (accuracy >= 75) {
    snellenEquivalent = '20/30';
  } else if (accuracy >= 65) {
    snellenEquivalent = '20/40';
  } else if (accuracy >= 50) {
    snellenEquivalent = '20/50';
  } else {
    snellenEquivalent = '20/60 or worse';
  }

  let interpretation: string;
  if (accuracy >= 90) {
    interpretation = 'Excellent visual acuity. Your vision appears to be within normal range.';
  } else if (accuracy >= 75) {
    interpretation = 'Good visual acuity with minor limitations. Consider regular eye exams.';
  } else if (accuracy >= 60) {
    interpretation = 'Moderate visual acuity reduction detected. Professional eye examination recommended.';
  } else {
    interpretation = 'Significant visual acuity reduction detected. Immediate professional eye examination strongly recommended.';
  }

  return {
    score: Math.round(accuracy),
    snellenEquivalent,
    interpretation
  };
}

/**
 * Analyze color blindness test results
 */
export function analyzeColorBlindness(
  correctAnswers: number,
  totalQuestions: number,
  errorPattern: { redGreen: number; blueYellow: number }
): VisionTestResult['colorBlindness'] {
  const accuracy = (correctAnswers / totalQuestions) * 100;
  
  let type: VisionTestResult['colorBlindness']['type'];
  let interpretation: string;

  if (accuracy >= 90) {
    type = 'normal';
    interpretation = 'Normal color vision detected. No color blindness identified.';
  } else if (errorPattern.redGreen > errorPattern.blueYellow * 1.5) {
    type = errorPattern.redGreen > 5 ? 'protanopia' : 'deuteranopia';
    interpretation = 'Red-green color vision deficiency detected. This is the most common form of color blindness.';
  } else if (errorPattern.blueYellow > errorPattern.redGreen * 1.5) {
    type = 'tritanopia';
    interpretation = 'Blue-yellow color vision deficiency detected. This is a less common form of color blindness.';
  } else {
    type = 'unknown';
    interpretation = 'Color vision abnormalities detected. Further professional evaluation recommended.';
  }

  return {
    score: Math.round(accuracy),
    type,
    interpretation
  };
}

/**
 * Analyze peripheral vision test results
 */
export function analyzePeripheralVision(
  detectedTargets: number,
  totalTargets: number,
  blindSpots: number
): VisionTestResult['peripheralVision'] {
  // Validate input data
  if (totalTargets <= 0 || detectedTargets < 0 || detectedTargets > totalTargets) {
    return {
      score: 0,
      blindSpots: blindSpots,
      interpretation: 'Invalid test data. Please retake the test.'
    };
  }
  
  const score = (detectedTargets / totalTargets) * 100;
  
  let interpretation: string;
  if (score >= 90 && blindSpots === 0) {
    interpretation = 'Normal peripheral vision. No significant blind spots detected.';
  } else if (score >= 75 && blindSpots <= 1) {
    interpretation = 'Good peripheral vision with minor limitations.';
  } else if (score >= 60) {
    interpretation = 'Moderate peripheral vision reduction. Professional eye examination recommended.';
  } else {
    interpretation = 'Significant peripheral vision reduction detected. Immediate professional eye examination strongly recommended.';
  }

  return {
    score: Math.round(score),
    blindSpots,
    interpretation
  };
}

/**
 * Calculate overall vision score
 */
export function calculateOverallVisionScore(
  visualAcuity: VisionTestResult['visualAcuity'],
  colorBlindness: VisionTestResult['colorBlindness'],
  peripheralVision: VisionTestResult['peripheralVision']
): {
  overallScore: number;
  recommendations: string[];
} {
  // Weighted average
  const overallScore = Math.round(
    (visualAcuity.score * 0.5) +
    (colorBlindness.score * 0.2) +
    (peripheralVision.score * 0.3)
  );

  const recommendations: string[] = [];

  if (visualAcuity.score < 80) {
    recommendations.push('Schedule a comprehensive eye examination');
    recommendations.push('Consider updating prescription if you wear glasses or contacts');
  }

  if (colorBlindness.type !== 'normal') {
    recommendations.push('Consult with an eye care professional for color vision assessment');
    recommendations.push('Be aware of color-dependent tasks in daily life');
  }

  if (peripheralVision.score < 75) {
    recommendations.push('Professional peripheral vision assessment recommended');
    recommendations.push('Be cautious when driving or operating machinery');
  }

  if (overallScore >= 80) {
    recommendations.push('Maintain regular eye health practices');
    recommendations.push('Schedule annual eye examinations');
  }

  return {
    overallScore,
    recommendations: [...new Set(recommendations)]
  };
}

