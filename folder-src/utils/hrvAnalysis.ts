/**
 * Heart Rate Variability (HRV) Analysis Utility
 * Calculates HRV metrics from RR intervals (time between heartbeats)
 */

export interface HRVMetrics {
  rmssd: number;           // Root Mean Square of Successive Differences
  sdnn: number;            // Standard Deviation of NN intervals
  pnn50: number;           // Percentage of NN50 intervals
  meanRR: number;          // Mean RR interval (ms)
  minRR: number;           // Minimum RR interval (ms)
  maxRR: number;           // Maximum RR interval (ms)
  stressLevel: 'low' | 'moderate' | 'high' | 'very-high';
  hrvScore: number;        // 0-100 score
  interpretation: string;
  recommendations: string[];
}

/**
 * Calculate HRV metrics from RR intervals
 * @param rrIntervals Array of RR intervals in milliseconds
 * @returns HRV metrics
 */
export function calculateHRV(rrIntervals: number[]): HRVMetrics {
  if (rrIntervals.length < 10) {
    return {
      rmssd: 0,
      sdnn: 0,
      pnn50: 0,
      meanRR: 0,
      minRR: 0,
      maxRR: 0,
      stressLevel: 'very-high',
      hrvScore: 0,
      interpretation: 'Insufficient data for HRV analysis. Need at least 10 heartbeats.',
      recommendations: ['Record for longer duration', 'Ensure stable lighting', 'Keep face still']
    };
  }

  // Calculate mean RR interval
  const meanRR = rrIntervals.reduce((a, b) => a + b, 0) / rrIntervals.length;

  // Calculate RMSSD (Root Mean Square of Successive Differences)
  let sumSquaredDiffs = 0;
  for (let i = 1; i < rrIntervals.length; i++) {
    const diff = rrIntervals[i] - rrIntervals[i - 1];
    sumSquaredDiffs += diff * diff;
  }
  const rmssd = Math.sqrt(sumSquaredDiffs / (rrIntervals.length - 1));

  // Calculate SDNN (Standard Deviation of NN intervals)
  const variance = rrIntervals.reduce((sum, val) => sum + Math.pow(val - meanRR, 2), 0) / rrIntervals.length;
  const sdnn = Math.sqrt(variance);

  // Calculate pNN50 (Percentage of NN50 intervals)
  let nn50Count = 0;
  for (let i = 1; i < rrIntervals.length; i++) {
    const diff = Math.abs(rrIntervals[i] - rrIntervals[i - 1]);
    if (diff > 50) {
      nn50Count++;
    }
  }
  const pnn50 = (nn50Count / (rrIntervals.length - 1)) * 100;

  // Find min and max RR intervals
  const minRR = Math.min(...rrIntervals);
  const maxRR = Math.max(...rrIntervals);

  // Determine stress level based on RMSSD (typical ranges)
  let stressLevel: 'low' | 'moderate' | 'high' | 'very-high';
  let hrvScore: number;
  let interpretation: string;
  const recommendations: string[] = [];

  if (rmssd >= 50) {
    stressLevel = 'low';
    hrvScore = 85 + Math.min(15, (rmssd - 50) / 2);
    interpretation = 'Excellent HRV. Your autonomic nervous system shows good balance and recovery capacity.';
    recommendations.push('Maintain current lifestyle habits');
    recommendations.push('Continue regular exercise');
  } else if (rmssd >= 30) {
    stressLevel = 'moderate';
    hrvScore = 60 + ((rmssd - 30) / 20) * 25;
    interpretation = 'Moderate HRV. Your body shows reasonable stress recovery capacity.';
    recommendations.push('Consider stress management techniques');
    recommendations.push('Ensure adequate sleep (7-9 hours)');
    recommendations.push('Practice deep breathing exercises');
  } else if (rmssd >= 20) {
    stressLevel = 'high';
    hrvScore = 30 + ((rmssd - 20) / 10) * 30;
    interpretation = 'Reduced HRV detected. Your body may be experiencing elevated stress levels.';
    recommendations.push('Prioritize stress reduction activities');
    recommendations.push('Improve sleep quality and duration');
    recommendations.push('Consider meditation or mindfulness practices');
    recommendations.push('Review work-life balance');
  } else {
    stressLevel = 'very-high';
    hrvScore = Math.max(0, (rmssd / 20) * 30);
    interpretation = 'Very low HRV detected. This may indicate high stress, fatigue, or health concerns.';
    recommendations.push('Consult with healthcare provider');
    recommendations.push('Focus on rest and recovery');
    recommendations.push('Reduce stressors where possible');
    recommendations.push('Consider professional stress management support');
  }

  // Additional recommendations based on SDNN
  if (sdnn < 20) {
    recommendations.push('Low variability detected - consider cardiovascular health check');
  }

  return {
    rmssd: Math.round(rmssd * 100) / 100,
    sdnn: Math.round(sdnn * 100) / 100,
    pnn50: Math.round(pnn50 * 100) / 100,
    meanRR: Math.round(meanRR),
    minRR,
    maxRR,
    stressLevel,
    hrvScore: Math.min(100, Math.max(0, Math.round(hrvScore))),
    interpretation,
    recommendations
  };
}

/**
 * Estimate blood pressure from pulse wave characteristics
 * Note: This is a rough estimation and not a replacement for medical-grade BP measurement
 */
export function estimateBloodPressure(
  meanRR: number,
  pulseAmplitude: number,
  age: number = 35
): { systolic: number; diastolic: number; confidence: number } {
  // Basic estimation based on pulse characteristics
  // Note: This is an approximate estimation and should be used as a screening tool
  
  const baseSystolic = 110 + (age - 20) * 0.5;
  const baseDiastolic = 70 + (age - 20) * 0.3;
  
  // Adjust based on RR interval (shorter RR = higher BP)
  const rrFactor = 60000 / meanRR; // Convert to BPM
  const bpmAdjustment = (rrFactor - 70) * 0.2;
  
  // Adjust based on pulse amplitude (lower amplitude might indicate higher BP)
  const amplitudeFactor = (1 - pulseAmplitude) * 10;
  
  const systolic = Math.round(baseSystolic + bpmAdjustment + amplitudeFactor);
  const diastolic = Math.round(baseDiastolic + bpmAdjustment * 0.6 + amplitudeFactor * 0.6);
  
  // Low confidence - this is just an estimation
  const confidence = 0.3;
  
  return {
    systolic: Math.max(90, Math.min(180, systolic)),
    diastolic: Math.max(60, Math.min(120, diastolic)),
    confidence
  };
}

/**
 * Calculate cardiovascular risk score (0-100)
 */
export function calculateCardiovascularRisk(
  bpm: number,
  hrvMetrics: HRVMetrics,
  estimatedBP: { systolic: number; diastolic: number },
  age: number = 35
): {
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  factors: string[];
  recommendations: string[];
} {
  let riskScore = 50; // Base score
  const factors: string[] = [];
  const recommendations: string[] = [];

  // Heart rate assessment
  if (bpm > 100) {
    riskScore += 15;
    factors.push('Elevated resting heart rate');
    recommendations.push('Consider cardiovascular exercise to improve heart health');
  } else if (bpm < 60) {
    riskScore += 5;
    factors.push('Low resting heart rate (may be normal for athletes)');
  } else {
    riskScore -= 5;
  }

  // HRV assessment
  if (hrvMetrics.stressLevel === 'very-high' || hrvMetrics.stressLevel === 'high') {
    riskScore += 20;
    factors.push('Reduced heart rate variability');
    recommendations.push('Focus on stress management');
  } else if (hrvMetrics.stressLevel === 'low') {
    riskScore -= 10;
  }

  // Blood pressure assessment
  if (estimatedBP.systolic > 140 || estimatedBP.diastolic > 90) {
    riskScore += 25;
    factors.push('Elevated blood pressure');
    recommendations.push('Monitor blood pressure regularly');
    recommendations.push('Consider lifestyle modifications');
  } else if (estimatedBP.systolic > 120 || estimatedBP.diastolic > 80) {
    riskScore += 10;
    factors.push('Pre-hypertensive range');
    recommendations.push('Maintain healthy lifestyle');
  }

  // Age factor
  if (age > 50) {
    riskScore += 10;
    factors.push('Age-related risk factor');
  }

  // Determine risk level
  let riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  if (riskScore < 30) {
    riskLevel = 'low';
  } else if (riskScore < 50) {
    riskLevel = 'moderate';
  } else if (riskScore < 70) {
    riskLevel = 'high';
  } else {
    riskLevel = 'very-high';
  }

  // General recommendations
  if (riskLevel === 'high' || riskLevel === 'very-high') {
    recommendations.push('Consult with healthcare provider for comprehensive cardiovascular assessment');
    recommendations.push('Consider regular cardiovascular monitoring');
  }

  return {
    riskScore: Math.min(100, Math.max(0, Math.round(riskScore))),
    riskLevel,
    factors,
    recommendations: [...new Set(recommendations)] // Remove duplicates
  };
}

