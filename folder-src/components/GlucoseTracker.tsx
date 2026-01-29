/**
 * Smart Blood Glucose Log + Prediction Component
 * AI-based glucose trend predictor with explainable insights
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Droplet, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Brain,
  BarChart3,
  X,
  Info,
  Lightbulb,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  saveGlucoseReading,
  getAllGlucoseReadings,
  getGlucoseReadingsForPeriod,
  calculateGlucoseStats,
  getGlucoseCategory,
  predictGlucoseTrend,
  generateGlucoseInsights,
  deleteGlucoseReading,
  GlucoseReading,
  GlucosePrediction,
  GlucoseInsight,
  GlucoseStats,
} from '@/services/glucoseService';
import { format, parseISO } from 'date-fns';

export const GlucoseTracker: React.FC = () => {
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [fasting, setFasting] = useState<string>('');
  const [postMeal, setPostMeal] = useState<string>('');
  const [hba1c, setHba1c] = useState<string>('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | undefined>(undefined);
  const [notes, setNotes] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [stats, setStats] = useState<GlucoseStats | null>(null);
  const [predictions, setPredictions] = useState<GlucosePrediction[]>([]);
  const [insights, setInsights] = useState<GlucoseInsight[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadReadings();
  }, []);

  useEffect(() => {
    if (readings.length > 0) {
      const periodReadings = getGlucoseReadingsForPeriod(selectedPeriod);
      const periodStats = calculateGlucoseStats(periodReadings);
      setStats(periodStats);
      
      // Generate predictions
      const preds = predictGlucoseTrend(readings);
      setPredictions(preds);
      
      // Generate insights
      const ins = generateGlucoseInsights(readings, preds);
      setInsights(ins);
    } else {
      setStats(null);
      setPredictions([]);
      setInsights([]);
    }
  }, [readings, selectedPeriod]);

  const loadReadings = () => {
    const allReadings = getAllGlucoseReadings();
    setReadings(allReadings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const fastingNum = fasting ? parseFloat(fasting) : undefined;
    const postMealNum = postMeal ? parseFloat(postMeal) : undefined;
    const hba1cNum = hba1c ? parseFloat(hba1c) : undefined;

    if (!fastingNum && !postMealNum && !hba1cNum) {
      alert('Please enter at least one value (Fasting, Post-Meal, or HbA1c)');
      return;
    }

    if (fastingNum && (fastingNum < 50 || fastingNum > 500)) {
      alert('Please enter valid fasting glucose (50-500 mg/dL)');
      return;
    }

    if (postMealNum && (postMealNum < 50 || postMealNum > 500)) {
      alert('Please enter valid post-meal glucose (50-500 mg/dL)');
      return;
    }

    if (hba1cNum && (hba1cNum < 3 || hba1cNum > 15)) {
      alert('Please enter valid HbA1c (3-15%)');
      return;
    }

    try {
      const newReading = saveGlucoseReading({
        fasting: fastingNum,
        postMeal: postMealNum,
        hba1c: hba1cNum,
        mealType,
        timestamp: new Date().toISOString(),
        notes: notes.trim() || undefined,
      });

      setReadings([newReading, ...readings]);
      setFasting('');
      setPostMeal('');
      setHba1c('');
      setMealType(undefined);
      setNotes('');
      setShowForm(false);
    } catch (error) {
      console.error('Error saving glucose reading:', error);
      alert('Failed to save glucose reading');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reading?')) {
      if (deleteGlucoseReading(id)) {
        setReadings(readings.filter(r => r.id !== id));
      }
    }
  };

  const prepareChartData = () => {
    const periodReadings = getGlucoseReadingsForPeriod(selectedPeriod);
    const chartData: Array<{
      date: string;
      fasting: number | null;
      postMeal: number | null;
      predictedFasting: number | null;
      predictedPostMeal: number | null;
    }> = [];

    // Add historical data
    periodReadings.forEach(reading => {
      const dateKey = format(parseISO(reading.date), 'MMM dd');
      chartData.push({
        date: dateKey,
        fasting: reading.fasting || null,
        postMeal: reading.postMeal || null,
        predictedFasting: null,
        predictedPostMeal: null,
      });
    });

    // Add predictions
    predictions.forEach(pred => {
      const dateKey = format(parseISO(pred.date), 'MMM dd');
      chartData.push({
        date: dateKey,
        fasting: null,
        postMeal: null,
        predictedFasting: pred.predictedFasting,
        predictedPostMeal: pred.predictedPostMeal,
      });
    });

    // Sort by date
    return chartData.sort((a, b) => {
      const dateA = parseISO(a.date);
      const dateB = parseISO(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const chartData = prepareChartData();
  const lastReading = readings[0];
  const lastCategory = lastReading 
    ? getGlucoseCategory(lastReading.fasting, lastReading.postMeal, lastReading.hba1c)
    : null;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
              AI Glucose Tracker & Predictor
            </CardTitle>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reading
          </Button>
        </div>
        <CardDescription className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          Track glucose levels with AI-powered 7-day trend prediction
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Entry Form */}
        {showForm && (
          <Card className="bg-gray-50 dark:bg-gray-700 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Add Glucose Reading</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                  className="text-gray-700 dark:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
                      Fasting Glucose (mg/dL)
                    </label>
                    <Input
                      type="number"
                      value={fasting}
                      onChange={(e) => setFasting(e.target.value)}
                      placeholder="100"
                      min="50"
                      max="500"
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
                      Post-Meal Glucose (mg/dL)
                    </label>
                    <Input
                      type="number"
                      value={postMeal}
                      onChange={(e) => setPostMeal(e.target.value)}
                      placeholder="140"
                      min="50"
                      max="500"
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
                      HbA1c (%)
                    </label>
                    <Input
                      type="number"
                      value={hba1c}
                      onChange={(e) => setHba1c(e.target.value)}
                      placeholder="5.7"
                      min="3"
                      max="15"
                      step="0.1"
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
                      Meal Type (Optional)
                    </label>
                    <Select value={mealType || ''} onValueChange={(v) => setMealType(v as any)}>
                      <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
                    Notes (Optional)
                  </label>
                  <Input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., After exercise, before meal"
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                    Save Reading
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Current Reading Display */}
        {lastReading && (
          <div className="bg-gradient-to-r from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Latest Reading</div>
                <div className="flex items-center gap-4">
                  {lastReading.fasting && (
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {lastReading.fasting}
                        <span className="text-lg text-gray-600 dark:text-gray-300 ml-1">mg/dL</span>
                      </div>
                      <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">Fasting</div>
                    </div>
                  )}
                  {lastReading.postMeal && (
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {lastReading.postMeal}
                        <span className="text-lg text-gray-600 dark:text-gray-300 ml-1">mg/dL</span>
                      </div>
                      <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">Post-Meal</div>
                    </div>
                  )}
                  {lastReading.hba1c && (
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {lastReading.hba1c}%
                        <span className="text-lg text-gray-600 dark:text-gray-300 ml-1">HbA1c</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300 mt-2 font-medium">
                  {format(parseISO(lastReading.timestamp), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
              <div className="text-right">
                <Badge
                  className={
                    lastCategory?.severity === 'critical' || lastCategory?.severity === 'diabetic'
                      ? 'bg-red-600 text-white'
                      : lastCategory?.severity === 'prediabetic'
                      ? 'bg-orange-500 text-white'
                      : 'bg-green-600 text-white'
                  }
                >
                  {lastCategory?.category || 'Unknown'}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* AI Predictions */}
        {predictions.length > 0 && (
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                AI 7-Day Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 300]} 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="fasting"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    name="Fasting (Actual)"
                  />
                  <Area
                    type="monotone"
                    dataKey="postMeal"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                    name="Post-Meal (Actual)"
                  />
                  <Line
                    type="monotone"
                    dataKey="predictedFasting"
                    stroke="#8b5cf6"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    name="Fasting (Predicted)"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predictedPostMeal"
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    name="Post-Meal (Predicted)"
                    dot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              {/* Risk Periods */}
              <div className="mt-4 space-y-2">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">Predicted Risk Periods:</div>
                <div className="flex flex-wrap gap-2">
                  {predictions.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').map((pred, idx) => (
                    <Badge
                      key={idx}
                      className={
                        pred.riskLevel === 'critical'
                          ? 'bg-red-600 text-white'
                          : 'bg-orange-500 text-white'
                      }
                    >
                      {format(parseISO(pred.date), 'MMM dd')}: {pred.riskLevel === 'critical' ? 'Critical' : 'High'} Risk
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Insights */}
        {insights.length > 0 && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, idx) => (
                  <Alert
                    key={idx}
                    className={
                      insight.severity === 'high'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : insight.severity === 'moderate'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    }
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="font-semibold text-gray-900 dark:text-gray-100">
                      {insight.message}
                    </AlertTitle>
                    <AlertDescription className="mt-2 space-y-2">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Top reasons:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {insight.reasons.map((reason, rIdx) => (
                            <li key={rIdx}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-2">
                        💡 {insight.recommendation}
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Summary */}
        {stats && stats.readingCount > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.averageFasting > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">Avg Fasting</div>
                <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {stats.averageFasting}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-medium">mg/dL</div>
              </div>
            )}
            {stats.averagePostMeal > 0 && (
              <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">Avg Post-Meal</div>
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {stats.averagePostMeal}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-medium">mg/dL</div>
              </div>
            )}
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
              <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">Total Readings</div>
              <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                {stats.readingCount}
              </div>
            </div>
            {stats.hba1c && (
              <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">HbA1c</div>
                <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                  {stats.hba1c}%
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Readings */}
        {readings.length > 0 && (
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Recent Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {readings.slice(0, 10).map((reading) => {
                  const category = getGlucoseCategory(reading.fasting, reading.postMeal, reading.hba1c);
                  return (
                    <div
                      key={reading.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {reading.fasting && (
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              F: {reading.fasting}
                            </div>
                          )}
                          {reading.postMeal && (
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              PM: {reading.postMeal}
                            </div>
                          )}
                          {reading.hba1c && (
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              HbA1c: {reading.hba1c}%
                            </div>
                          )}
                          <Badge
                            className={
                              category.severity === 'critical' || category.severity === 'diabetic'
                                ? 'bg-red-600 text-white'
                                : category.severity === 'prediabetic'
                                ? 'bg-orange-500 text-white'
                                : 'bg-green-600 text-white'
                            }
                          >
                            {category.category}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                          {format(parseISO(reading.timestamp), 'MMM dd, yyyy HH:mm')}
                          {reading.mealType && ` • ${reading.mealType}`}
                          {reading.notes && ` • ${reading.notes}`}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(reading.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {readings.length === 0 && (
          <div className="text-center py-8 space-y-4">
            <Droplet className="w-16 h-16 mx-auto text-gray-600 dark:text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">No glucose readings yet</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                Start tracking your blood glucose to get AI-powered predictions
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Reading
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GlucoseTracker;

