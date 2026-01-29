/**
 * Mental Health Scoring Utilities
 * PHQ-9 (Depression) and GAD-7 (Anxiety) scoring algorithms
 */

export interface PHQ9Result {
  score: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';
  interpretation: string;
  recommendations: string[];
}

export interface GAD7Result {
  score: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  interpretation: string;
  recommendations: string[];
}

/**
 * Score PHQ-9 questionnaire (0-27 scale)
 */
export function scorePHQ9(answers: number[]): PHQ9Result {
  if (answers.length !== 9) {
    throw new Error('PHQ-9 requires exactly 9 answers');
  }

  const score = answers.reduce((sum, val) => sum + val, 0);
  
  let severity: PHQ9Result['severity'];
  let interpretation: string;
  const recommendations: string[] = [];

  if (score <= 4) {
    severity = 'minimal';
    interpretation = 'Minimal or no depression symptoms. Your responses suggest good mental well-being.';
    recommendations.push('Maintain current healthy habits');
    recommendations.push('Continue regular exercise and social activities');
  } else if (score <= 9) {
    severity = 'mild';
    interpretation = 'Mild depression symptoms detected. You may benefit from self-care strategies and monitoring.';
    recommendations.push('Practice stress management techniques');
    recommendations.push('Maintain regular sleep schedule');
    recommendations.push('Engage in physical activity');
    recommendations.push('Consider talking to a mental health professional');
  } else if (score <= 14) {
    severity = 'moderate';
    interpretation = 'Moderate depression symptoms. Professional support may be beneficial.';
    recommendations.push('Consult with a mental health professional');
    recommendations.push('Consider therapy or counseling');
    recommendations.push('Practice self-care and stress reduction');
    recommendations.push('Maintain social connections');
  } else if (score <= 19) {
    severity = 'moderately-severe';
    interpretation = 'Moderately severe depression symptoms. Professional help is recommended.';
    recommendations.push('Seek professional mental health support');
    recommendations.push('Consider therapy and/or medication evaluation');
    recommendations.push('Reach out to trusted friends or family');
    recommendations.push('Consider crisis support if needed');
  } else {
    severity = 'severe';
    interpretation = 'Severe depression symptoms detected. Immediate professional support is strongly recommended.';
    recommendations.push('Seek immediate professional mental health support');
    recommendations.push('Contact a mental health crisis line if needed');
    recommendations.push('Reach out to healthcare provider');
    recommendations.push('Consider emergency services if experiencing suicidal thoughts');
  }

  return { score, severity, interpretation, recommendations };
}

/**
 * Score GAD-7 questionnaire (0-21 scale)
 */
export function scoreGAD7(answers: number[]): GAD7Result {
  if (answers.length !== 7) {
    throw new Error('GAD-7 requires exactly 7 answers');
  }

  const score = answers.reduce((sum, val) => sum + val, 0);
  
  let severity: GAD7Result['severity'];
  let interpretation: string;
  const recommendations: string[] = [];

  if (score <= 4) {
    severity = 'minimal';
    interpretation = 'Minimal or no anxiety symptoms. Your responses suggest good mental well-being.';
    recommendations.push('Maintain current healthy habits');
    recommendations.push('Continue stress management practices');
  } else if (score <= 9) {
    severity = 'mild';
    interpretation = 'Mild anxiety symptoms detected. Self-care strategies may be helpful.';
    recommendations.push('Practice relaxation techniques (deep breathing, meditation)');
    recommendations.push('Maintain regular sleep schedule');
    recommendations.push('Limit caffeine and alcohol intake');
    recommendations.push('Consider talking to a mental health professional');
  } else if (score <= 14) {
    severity = 'moderate';
    interpretation = 'Moderate anxiety symptoms. Professional support may be beneficial.';
    recommendations.push('Consult with a mental health professional');
    recommendations.push('Consider therapy or counseling');
    recommendations.push('Practice mindfulness and relaxation techniques');
    recommendations.push('Maintain healthy lifestyle habits');
  } else {
    severity = 'severe';
    interpretation = 'Severe anxiety symptoms detected. Professional help is recommended.';
    recommendations.push('Seek professional mental health support');
    recommendations.push('Consider therapy and/or medication evaluation');
    recommendations.push('Practice stress reduction techniques');
    recommendations.push('Reach out to trusted support network');
  }

  return { score, severity, interpretation, recommendations };
}

/**
 * Calculate overall mental health score (0-100)
 */
export function calculateMentalHealthScore(
  phq9Result: PHQ9Result,
  gad7Result: GAD7Result
): {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  interpretation: string;
  recommendations: string[];
} {
  // Invert scores (higher PHQ-9/GAD-7 = lower health score)
  const phq9HealthScore = Math.max(0, 100 - (phq9Result.score / 27) * 100);
  const gad7HealthScore = Math.max(0, 100 - (gad7Result.score / 21) * 100);
  
  // Weighted average (PHQ-9 slightly more weight)
  const overallScore = Math.round((phq9HealthScore * 0.55) + (gad7HealthScore * 0.45));

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  const recommendations: string[] = [];

  if (overallScore >= 80) {
    riskLevel = 'low';
  } else if (overallScore >= 60) {
    riskLevel = 'medium';
  } else if (overallScore >= 40) {
    riskLevel = 'high';
  } else {
    riskLevel = 'critical';
  }

  // Combine recommendations
  const allRecommendations = [...phq9Result.recommendations, ...gad7Result.recommendations];
  const uniqueRecommendations = [...new Set(allRecommendations)];
  recommendations.push(...uniqueRecommendations);

  let interpretation = `Overall Mental Health Score: ${overallScore}/100. `;
  interpretation += `Depression (PHQ-9): ${phq9Result.severity}, Anxiety (GAD-7): ${gad7Result.severity}. `;
  
  if (riskLevel === 'low') {
    interpretation += 'Your mental health appears to be in good condition.';
  } else if (riskLevel === 'medium') {
    interpretation += 'Some mental health concerns detected. Consider self-care and monitoring.';
  } else if (riskLevel === 'high') {
    interpretation += 'Significant mental health concerns detected. Professional support is recommended.';
  } else {
    interpretation += 'Severe mental health concerns detected. Immediate professional support is strongly recommended.';
  }

  return {
    overallScore,
    riskLevel,
    interpretation,
    recommendations
  };
}

