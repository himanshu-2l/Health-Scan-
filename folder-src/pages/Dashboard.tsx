/**
 * Dashboard Page
 * Main health dashboard showing overall health score, recent tests, and quick actions
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HealthScoreCard } from '@/components/HealthScoreCard';
import { GlassNavbar } from '@/components/GlassNavbar';
import { SiteFooter } from '@/components/SiteFooter';
import { BodyTemperature } from '@/components/BodyTemperature';
import { GoogleFitIntegration } from '@/components/GoogleFitIntegration';
import { 
  Activity, 
  Plus, 
  Clock, 
  FileText,
  ArrowRight,
  Calendar,
  AlertCircle,
  CheckCircle,
  TestTube,
  Shield,
  Heart,
  Stethoscope,
  Droplet
} from 'lucide-react';
import { HealthScore } from '../types/health';
import { calculateHealthScore } from '../services/healthScoreService';
import { getRecentResults, getAllResults } from '../services/healthDataService';
import { HealthTestResult } from '../types/health';

export default function Dashboard() {
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [recentResults, setRecentResults] = useState<HealthTestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    try {
      // Calculate health score
      const score = calculateHealthScore();
      setHealthScore(score);

      // Get recent test results
      const recent = getRecentResults(6);
      setRecentResults(recent);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTestTypeLabel = (testType: string): string => {
    const labels: Record<string, string> = {
      'digit-span': 'Digit Span',
      'word-list-recall': 'Word List Recall',
      'alzheimers': "Alzheimer's Assessment",
      'parkinsons': "Parkinson's Assessment",
      'epilepsy': 'Epilepsy Assessment',
      'cognitive': 'Cognitive Assessment',
      'voice': 'Voice Analysis',
      'eye': 'Eye Test',
      'motor': 'Motor Test',
      'cardiovascular-test': 'Cardiovascular Test',
      'mental-health-assessment': 'Mental Health Assessment',
      'vision-test': 'Vision Test',
      'hearing-test': 'Hearing Test',
      'lifestyle-survey': 'Lifestyle Survey',
    };
    return labels[testType] || testType;
  };

  const getRiskBadgeVariant = (risk?: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!risk) return 'outline';
    switch (risk.toLowerCase()) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
        <GlassNavbar />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center space-y-4">
            <Activity className="w-12 h-12 animate-spin mx-auto text-blue-600" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const allResults = getAllResults();
  const hasTests = allResults.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 flex flex-col">
      <GlassNavbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 flex-1">
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-7 h-7 text-blue-600" />
                Health Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">Your comprehensive health overview</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white text-xs px-2 py-1">ABDM Integrated</Badge>
              <Badge className="bg-green-600 text-white text-xs px-2 py-1">Government Approved</Badge>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Health Score - Takes 2 columns on large screens */}
          {healthScore && (
            <div className="lg:col-span-2">
              <HealthScoreCard healthScore={healthScore} />
            </div>
          )}

          {/* Body Temperature - Takes 1 column */}
          <div className="lg:col-span-1">
            <BodyTemperature />
          </div>
        </div>

        {/* Google Fit Integration - Full Width */}
        <div className="mb-6">
          <GoogleFitIntegration />
        </div>

        {/* Quick Actions - Compact Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <Card className="hover:shadow-md transition-all cursor-pointer bg-white border border-blue-200 hover:border-blue-400 group">
              <Link to="/labs" className="block">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Plus className="w-4 h-4 text-blue-600" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-gray-900">New Test</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-gray-600">Take assessment</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs">
                    Start
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-all cursor-pointer bg-white border border-red-200 hover:border-red-400 group">
              <Link to="/bp-tracker" className="block">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                      <Heart className="w-4 h-4 text-red-600" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-gray-900">BP Tracker</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-gray-600">Monitor BP</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white h-8 text-xs">
                    Track
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-all cursor-pointer bg-white border border-purple-200 hover:border-purple-400 group">
              <Link to="/diabetes" className="block">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Droplet className="w-4 h-4 text-purple-600" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-gray-900">Diabetes</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-gray-600">Manage glucose</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs">
                    Manage
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-all cursor-pointer bg-white border border-green-200 hover:border-green-400 group">
              <Link to="/labs" className="block">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-gray-900">All Tests</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-gray-600">View history</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button size="sm" variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50 h-8 text-xs">
                    View
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-all cursor-pointer bg-white border border-orange-200 hover:border-orange-400 group">
              <Link to="/ehr" className="block">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <Stethoscope className="w-4 h-4 text-orange-600" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-gray-900">EHR</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-gray-600">ABDM integration</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button size="sm" variant="outline" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 h-8 text-xs">
                    Connect
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>

        {/* Recent Test Results and Reminders - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Test Results - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg font-semibold text-gray-900">Recent Test Results</CardTitle>
                  </div>
                  <Link to="/labs">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View All
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {!hasTests ? (
                  <div className="text-center py-8 space-y-3">
                    <TestTube className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <h3 className="text-sm font-semibold mb-1 text-gray-900">No tests yet</h3>
                      <p className="text-xs text-gray-600 mb-3">
                        Start by taking your first health assessment
                      </p>
                      <Link to="/labs">
                        <Button size="sm">
                          <Plus className="w-3 h-3 mr-2" />
                          Take First Test
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : recentResults.length === 0 ? (
                  <div className="text-center py-6 text-sm text-gray-500">
                    No recent test results
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recentResults.map((result) => (
                      <Card key={result.id} className="hover:shadow-md transition-shadow bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-sm font-semibold text-gray-900 truncate">
                                {getTestTypeLabel(result.testType)}
                              </CardTitle>
                              <CardDescription className="text-xs text-gray-600 mt-0.5">
                                {formatDate(result.testDate)}
                              </CardDescription>
                            </div>
                            {result.riskLevel && (
                              <Badge variant={getRiskBadgeVariant(result.riskLevel)} className="text-xs ml-2 shrink-0">
                                {result.riskLevel}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2 space-y-2">
                          {result.score !== undefined && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Score:</span>
                              <span className="font-semibold text-gray-900">
                                {result.score}
                                {result.maxScore && ` / ${result.maxScore}`}
                              </span>
                            </div>
                          )}
                          {result.scorePercentage !== undefined && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>Performance</span>
                                <span className="font-medium">{Math.round(result.scorePercentage)}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-600 transition-all"
                                  style={{ width: `${result.scorePercentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                          <Link to="/labs">
                            <Button variant="ghost" size="sm" className="w-full h-7 text-xs mt-1">
                              View Details
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Health Reminders - Takes 1 column */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg font-semibold text-gray-900">Health Reminders</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {hasTests ? (
                    <>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border-l-2 border-yellow-500">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs text-gray-900 mb-0.5">Regular Monitoring</p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Retake tests every 3-6 months per NHM guidelines
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border-l-2 border-green-500">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs text-gray-900 mb-0.5">Keep Testing</p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Regular assessments track health trends
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border-l-2 border-blue-500">
                        <Heart className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs text-gray-900 mb-0.5">ABDM Benefits</p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Share data securely with healthcare providers
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 text-xs text-gray-500 bg-gray-50 rounded-lg">
                      Complete your first test to see personalized reminders
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
