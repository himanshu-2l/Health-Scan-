/**
 * Statistical Accuracy Utilities
 * Provides robust statistical methods, outlier detection, and data validation
 * to improve lab test accuracy
 */

/**
 * Remove outliers using IQR (Interquartile Range) method
 * @param data Array of numbers
 * @param factor IQR multiplier (default 1.5, higher = more aggressive filtering)
 * @returns Filtered data array
 */
export function removeOutliers(data: number[], factor: number = 1.5): number[] {
  if (data.length < 4) return data; // Need at least 4 points for IQR
  
  const sorted = [...data].sort((a, b) => a - b);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  const iqr = q3 - q1;
  
  const lowerBound = q1 - factor * iqr;
  const upperBound = q3 + factor * iqr;
  
  return data.filter(x => x >= lowerBound && x <= upperBound);
}

/**
 * Calculate robust mean (median of means from subsets)
 * @param data Array of numbers
 * @param subsetSize Size of subsets (default 5)
 * @returns Robust mean value
 */
export function robustMean(data: number[], subsetSize: number = 5): number {
  if (data.length === 0) return 0;
  if (data.length <= subsetSize) return median(data);
  
  const means: number[] = [];
  for (let i = 0; i < data.length; i += subsetSize) {
    const subset = data.slice(i, i + subsetSize);
    means.push(subset.reduce((a, b) => a + b, 0) / subset.length);
  }
  
  return median(means);
}

/**
 * Calculate median value
 * @param data Array of numbers
 * @returns Median value
 */
export function median(data: number[]): number {
  if (data.length === 0) return 0;
  
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Calculate trimmed mean (removes top and bottom percentiles)
 * @param data Array of numbers
 * @param trimPercent Percentage to trim from each end (default 10%)
 * @returns Trimmed mean
 */
export function trimmedMean(data: number[], trimPercent: number = 10): number {
  if (data.length === 0) return 0;
  
  const sorted = [...data].sort((a, b) => a - b);
  const trimCount = Math.floor(data.length * trimPercent / 100);
  const trimmed = sorted.slice(trimCount, sorted.length - trimCount);
  
  if (trimmed.length === 0) return median(data);
  
  return trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
}

/**
 * Calculate standard deviation
 * @param data Array of numbers
 * @param useSample Use sample standard deviation (n-1) vs population (n)
 * @returns Standard deviation
 */
export function standardDeviation(data: number[], useSample: boolean = true): number {
  if (data.length === 0) return 0;
  if (data.length === 1) return 0;
  
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / 
    (useSample ? data.length - 1 : data.length);
  
  return Math.sqrt(variance);
}

/**
 * Calculate coefficient of variation (CV) - relative measure of variability
 * @param data Array of numbers
 * @returns Coefficient of variation as percentage
 */
export function coefficientOfVariation(data: number[]): number {
  if (data.length === 0) return 0;
  
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  if (mean === 0) return 0;
  
  const stdDev = standardDeviation(data);
  return (stdDev / mean) * 100;
}

/**
 * Calculate confidence interval for mean
 * @param data Array of numbers
 * @param confidenceLevel Confidence level (default 0.95 for 95%)
 * @returns Object with mean, lower bound, upper bound, and margin of error
 */
export function confidenceInterval(
  data: number[],
  confidenceLevel: number = 0.95
): { mean: number; lower: number; upper: number; margin: number } {
  if (data.length === 0) {
    return { mean: 0, lower: 0, upper: 0, margin: 0 };
  }
  
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const stdDev = standardDeviation(data, true);
  const n = data.length;
  
  // Z-score for confidence level (approximation for large samples)
  // For 95%: 1.96, for 99%: 2.576
  const zScore = confidenceLevel === 0.95 ? 1.96 : confidenceLevel === 0.99 ? 2.576 : 1.96;
  
  const margin = (zScore * stdDev) / Math.sqrt(n);
  
  return {
    mean,
    lower: mean - margin,
    upper: mean + margin,
    margin
  };
}

/**
 * Validate data quality
 * @param data Array of numbers
 * @param minSamples Minimum number of samples required
 * @param maxCV Maximum coefficient of variation allowed (as percentage)
 * @returns Validation result with quality score and issues
 */
export function validateDataQuality(
  data: number[],
  minSamples: number = 10,
  maxCV: number = 50
): {
  isValid: boolean;
  qualityScore: number; // 0-100
  issues: string[];
  sampleCount: number;
  cv: number;
} {
  const issues: string[] = [];
  let qualityScore = 100;
  
  // Check sample count
  if (data.length < minSamples) {
    issues.push(`Insufficient samples: ${data.length} < ${minSamples}`);
    qualityScore -= 30;
  }
  
  // Check for invalid values
  const invalidCount = data.filter(x => !isFinite(x) || isNaN(x)).length;
  if (invalidCount > 0) {
    issues.push(`Invalid values detected: ${invalidCount}`);
    qualityScore -= 20;
  }
  
  // Check coefficient of variation
  const cv = coefficientOfVariation(data.filter(x => isFinite(x) && !isNaN(x)));
  if (cv > maxCV) {
    issues.push(`High variability detected: CV = ${cv.toFixed(1)}%`);
    qualityScore -= 15;
  }
  
  // Check for constant values (no variation)
  const uniqueValues = new Set(data.filter(x => isFinite(x) && !isNaN(x)));
  if (uniqueValues.size === 1 && data.length > 1) {
    issues.push('No variation in data - possible sensor issue');
    qualityScore -= 25;
  }
  
  return {
    isValid: issues.length === 0 && data.length >= minSamples,
    qualityScore: Math.max(0, qualityScore),
    issues,
    sampleCount: data.length,
    cv
  };
}

/**
 * Smooth data using moving average
 * @param data Array of numbers
 * @param windowSize Size of moving average window
 * @returns Smoothed data array
 */
export function movingAverage(data: number[], windowSize: number = 5): number[] {
  if (data.length === 0) return [];
  if (windowSize >= data.length) return [data.reduce((a, b) => a + b, 0) / data.length];
  
  const smoothed: number[] = [];
  const halfWindow = Math.floor(windowSize / 2);
  
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(data.length, i + halfWindow + 1);
    const window = data.slice(start, end);
    smoothed.push(window.reduce((a, b) => a + b, 0) / window.length);
  }
  
  return smoothed;
}

/**
 * Calculate robust statistics summary
 * @param data Array of numbers
 * @param removeOutliersFlag Whether to remove outliers before calculation
 * @returns Comprehensive statistics summary
 */
export function robustStatistics(
  data: number[],
  removeOutliersFlag: boolean = true
): {
  mean: number;
  median: number;
  trimmedMean: number;
  robustMean: number;
  stdDev: number;
  cv: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
  outlierCount: number;
  sampleCount: number;
  confidenceInterval: { mean: number; lower: number; upper: number; margin: number };
} {
  if (data.length === 0) {
    return {
      mean: 0,
      median: 0,
      trimmedMean: 0,
      robustMean: 0,
      stdDev: 0,
      cv: 0,
      min: 0,
      max: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
      outlierCount: 0,
      sampleCount: 0,
      confidenceInterval: { mean: 0, lower: 0, upper: 0, margin: 0 }
    };
  }
  
  const validData = data.filter(x => isFinite(x) && !isNaN(x));
  const originalLength = validData.length;
  
  let processedData = validData;
  let outlierCount = 0;
  
  if (removeOutliersFlag && validData.length >= 4) {
    const filtered = removeOutliers(validData);
    outlierCount = originalLength - filtered.length;
    processedData = filtered;
  }
  
  const sorted = [...processedData].sort((a, b) => a - b);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  
  return {
    mean: processedData.reduce((a, b) => a + b, 0) / processedData.length,
    median: median(processedData),
    trimmedMean: trimmedMean(processedData),
    robustMean: robustMean(processedData),
    stdDev: standardDeviation(processedData),
    cv: coefficientOfVariation(processedData),
    min: Math.min(...processedData),
    max: Math.max(...processedData),
    q1: sorted[q1Index] || 0,
    q3: sorted[q3Index] || 0,
    iqr: (sorted[q3Index] || 0) - (sorted[q1Index] || 0),
    outlierCount,
    sampleCount: processedData.length,
    confidenceInterval: confidenceInterval(processedData)
  };
}

/**
 * Calculate accuracy score based on data quality metrics
 * @param stats Robust statistics object
 * @param qualityValidation Data quality validation result
 * @returns Accuracy score (0-100)
 */
export function calculateAccuracyScore(
  stats: ReturnType<typeof robustStatistics>,
  qualityValidation: ReturnType<typeof validateDataQuality>
): number {
  let score = qualityValidation.qualityScore;
  
  // Boost score for sufficient samples
  if (stats.sampleCount >= 30) score += 5;
  else if (stats.sampleCount >= 20) score += 3;
  else if (stats.sampleCount >= 10) score += 1;
  
  // Reduce score for high variability
  if (stats.cv > 30) score -= 10;
  else if (stats.cv > 20) score -= 5;
  
  // Reduce score for many outliers
  const outlierPercent = (stats.outlierCount / stats.sampleCount) * 100;
  if (outlierPercent > 20) score -= 10;
  else if (outlierPercent > 10) score -= 5;
  
  // Boost score for tight confidence interval (relative to mean)
  if (stats.mean !== 0) {
    const relativeMargin = (stats.confidenceInterval.margin / Math.abs(stats.mean)) * 100;
    if (relativeMargin < 5) score += 5;
    else if (relativeMargin < 10) score += 2;
  }
  
  return Math.max(0, Math.min(100, score));
}

