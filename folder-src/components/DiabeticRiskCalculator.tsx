/**
 * Diabetic Risk Score Calculator Component
 * AI-powered risk assessment with heatmap visualization
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
} from 'lucide-react';
import {
  calculateDiabeticRisk,
  generateRiskHeatmap,
  RiskFactors,
  RiskAssessment,
  RiskHeatmapData,
} from '@/services/diabeticRiskService';
import { format } from 'date-fns';

export const DiabeticRiskCalculator: React.FC = () => {
  const [age, setAge] = useState<string>('');
  const [familyHistory, setFamilyHistory] = useState<'none' | 'parent' | 'sibling' | 'both'>('none');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'>('moderate');
  const [mealHabits, setMealHabits] = useState<'regular' | 'irregular' | 'frequent-snacking' | 'skipping-meals'>('regular');
  const [systolicBP, setSystolicBP] = useState<string>('');
  const [diastolicBP, setDiastolicBP] = useState<string>('');
  const [fastingGlucose, setFastingGlucose] = useState<string>('');
  const [postMealGlucose, setPostMealGlucose] = useState<string>('');
  const [hba1c, setHba1c] = useState<string>('');
  
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [heatmap, setHeatmap] = useState<RiskHeatmapData[]>([]);

  const calculateBMI = (): number => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    if (!weightNum || !heightNum || heightNum === 0) return 0;
    return weightNum / ((heightNum / 100) ** 2);
  };

  const handleCalculate = () => {
    const bmi = calculateBMI();
    if (!age || bmi === 0) {
      alert('Please enter age, weight, and height');
      return;
    }

    const factors: RiskFactors = {
      age: parseFloat(age),
      familyHistory,
      bmi,
      activityLevel,
      mealHabits,
      systolicBP: systolicBP ? parseFloat(systolicBP) : undefined,
      diastolicBP: diastolicBP ? parseFloat(diastolicBP) : undefined,
      fastingGlucose: fastingGlucose ? parseFloat(fastingGlucose) : undefined,
      postMealGlucose: postMealGlucose ? parseFloat(postMealGlucose) : undefined,
      hba1c: hba1c ? parseFloat(hba1c) : undefined,
    };

    const result = calculateDiabeticRisk(factors);
    setAssessment(result);
    
    const heatmapData = generateRiskHeatmap(result, 7);
    setHeatmap(heatmapData);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very-high': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very-high': return 'Very High';
      case 'high': return 'High';
      case 'moderate': return 'Moderate';
      default: return 'Low';
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
            AI Diabetic Risk Calculator
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          Assess your diabetes risk using AI-powered analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Age *
            </label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="35"
              min="18"
              max="100"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Family History *
            </label>
            <Select value={familyHistory} onValueChange={(v: any) => setFamilyHistory(v)}>
              <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="both">Both Parents/Siblings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Weight (kg) *
            </label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              min="30"
              max="200"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Height (cm) *
            </label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              min="100"
              max="250"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Activity Level *
            </label>
            <Select value={activityLevel} onValueChange={(v: any) => setActivityLevel(v)}>
              <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="light">Light Activity</SelectItem>
                <SelectItem value="moderate">Moderate Activity</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="very-active">Very Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Meal Habits *
            </label>
            <Select value={mealHabits} onValueChange={(v: any) => setMealHabits(v)}>
              <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="irregular">Irregular</SelectItem>
                <SelectItem value="frequent-snacking">Frequent Snacking</SelectItem>
                <SelectItem value="skipping-meals">Skipping Meals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Systolic BP (mmHg) - Optional
            </label>
            <Input
              type="number"
              value={systolicBP}
              onChange={(e) => setSystolicBP(e.target.value)}
              placeholder="120"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Diastolic BP (mmHg) - Optional
            </label>
            <Input
              type="number"
              value={diastolicBP}
              onChange={(e) => setDiastolicBP(e.target.value)}
              placeholder="80"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Fasting Glucose (mg/dL) - Optional
            </label>
            <Input
              type="number"
              value={fastingGlucose}
              onChange={(e) => setFastingGlucose(e.target.value)}
              placeholder="100"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Post-Meal Glucose (mg/dL) - Optional
            </label>
            <Input
              type="number"
              value={postMealGlucose}
              onChange={(e) => setPostMealGlucose(e.target.value)}
              placeholder="140"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              HbA1c (%) - Optional
            </label>
            <Input
              type="number"
              value={hba1c}
              onChange={(e) => setHba1c(e.target.value)}
              placeholder="5.7"
              step="0.1"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        {weight && height && (
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Calculated BMI:</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {calculateBMI().toFixed(1)}
            </div>
          </div>
        )}

        <Button
          onClick={handleCalculate}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Risk Score
        </Button>

        {/* Risk Assessment Results */}
        {assessment && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Risk Assessment Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Risk Score</div>
                    <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      {assessment.riskScore}
                      <span className="text-lg text-gray-600 dark:text-gray-300">/100</span>
                    </div>
                  </div>
                  <Badge className={`${getRiskColor(assessment.riskCategory)} text-white text-lg px-4 py-2`}>
                    {getRiskLabel(assessment.riskCategory)} Risk
                  </Badge>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Estimated Probability of Developing Diabetes:
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {assessment.riskPercentage}%
                  </div>
                </div>

                {/* Risk Factors */}
                <div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Contributing Factors:
                  </div>
                  <div className="space-y-2">
                    {assessment.factors.slice(0, 5).map((factor, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{factor.factor}</span>
                        <Badge
                          className={
                            factor.severity === 'high'
                              ? 'bg-red-600 text-white'
                              : factor.severity === 'moderate'
                              ? 'bg-orange-500 text-white'
                              : 'bg-yellow-500 text-white'
                          }
                        >
                          +{factor.contribution} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Recommendations:</div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {assessment.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>

                {/* Next Steps */}
                <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Next Steps:</div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {assessment.nextSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Risk Heatmap */}
            {heatmap.length > 0 && (
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                    7-Day Risk Heatmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {heatmap.map((day, idx) => (
                      <div
                        key={idx}
                        className={`${getRiskColor(day.riskLevel)} text-white rounded-lg p-3 text-center`}
                      >
                        <div className="text-xs font-semibold mb-1">
                          {format(new Date(day.date), 'EEE')}
                        </div>
                        <div className="text-lg font-bold">{day.riskScore}</div>
                        <div className="text-xs mt-1 opacity-90">
                          {getRiskLabel(day.riskLevel)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiabeticRiskCalculator;

