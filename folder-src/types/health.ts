/**
 * Unified Health Data Types
 * Centralized types for all health test results and health scoring
 */

import { NeuroScanTestResult } from './ehr';

// Test result categories
export type TestCategory = 
  | 'neurological'
  | 'cardiovascular'
  | 'respiratory'
  | 'mental-health'
  | 'vision-hearing'
  | 'lifestyle';

// Test types
export type TestType =
  | 'digit-span'
  | 'word-list-recall'
  | 'saccade'
  | 'stroop'
  | 'alzheimers'
  | 'parkinsons'
  | 'epilepsy'
  | 'cognitive'
  | 'voice'
  | 'eye'
  | 'motor'
  | 'cardiovascular-test'
  | 'respiratory-test'
  | 'mental-health-assessment'
  | 'vision-test'
  | 'hearing-test'
  | 'lifestyle-survey';

// Risk levels
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// Health trend direction
export type TrendDirection = 'improving' | 'stable' | 'declining' | 'fluctuating';

// Unified Health Test Result Interface
export interface HealthTestResult {
  id: string;
  testType: TestType;
  category: TestCategory;
  testDate: string;
  timestamp: string;
  
  // Test-specific data (flexible structure)
  data: Record<string, any>;
  
  // Scores
  score?: number;
  maxScore?: number;
  scorePercentage?: number;
  
  // Risk assessment
  riskLevel?: RiskLevel;
  
  // Interpretation
  interpretation?: string;
  recommendations?: string[];
  
  // Metadata
  duration?: number; // in milliseconds
  status?: 'preliminary' | 'final' | 'amended';
  
  // Legacy support for NeuroScanTestResult
  neuroScanResult?: NeuroScanTestResult;
}

// Health Score Interface
export interface HealthScore {
  overall: number; // 0-100
  breakdown: {
    neurological: number;
    cardiovascular: number;
    respiratory: number;
    mentalHealth: number;
    visionHearing: number;
    lifestyle: number;
  };
  riskLevel: RiskLevel;
  trend: TrendDirection;
  lastUpdated: string;
  recommendations: string[];
}

// Health Trend Data Point
export interface HealthTrendPoint {
  date: string;
  score: number;
  category?: TestCategory;
  testType?: TestType;
}

// Health History Entry
export interface HealthHistoryEntry {
  date: string;
  tests: HealthTestResult[];
  overallScore: number;
  notes?: string;
}

// Category Score Calculation
export interface CategoryScore {
  category: TestCategory;
  score: number; // 0-100
  weight: number; // weight in overall calculation
  testCount: number;
  lastTestDate?: string;
  trend: TrendDirection;
}

