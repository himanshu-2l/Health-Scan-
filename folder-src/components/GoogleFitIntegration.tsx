import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  Heart,
  Footprints,
  Flame,
  Moon,
  TrendingUp,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Watch,
} from 'lucide-react';

// Using relative URLs - Vite proxy handles routing to backend

interface FitnessData {
  heartRate: Array<{ timestamp: Date; bpm: number; source: string }>;
  steps: Array<{ date: Date; steps: number; source: string }>;
  calories: Array<{ date: Date; calories: number; source: string }>;
  sleep: Array<{ date: Date; durationHours: string; sleepType: string; source: string }>;
  summary: {
    avgHeartRate: number;
    totalSteps: number;
    avgSteps: number;
    totalCalories: number;
    avgCalories: number;
    avgSleepHours: string;
    period: string;
  };
}

export const GoogleFitIntegration: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fitnessData, setFitnessData] = useState<FitnessData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [heartRateData, setHeartRateData] = useState<Array<{ timestamp: Date; bpm: number; source: string }> | null>(null);
  const [latestHeartRate, setLatestHeartRate] = useState<number | null>(null);

  useEffect(() => {
    // Check for Google Fit connection success from redirect
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (urlParams.get('google_fit') === 'connected' && token) {
      // Store token in localStorage
      localStorage.setItem('googleFitToken', token);
      // Clear the query parameter
      window.history.replaceState({}, '', window.location.pathname);
      // Refresh connection status and fetch data
      setTimeout(() => {
        checkConnectionStatus();
      }, 500);
    } else {
      checkConnectionStatus();
    }
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const token = localStorage.getItem('googleFitToken');
      const response = await fetch('/api/google-fit/status', {
        method: 'GET',
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {},
      });
      
      if (!response.ok) {
        throw new Error('Status check failed');
      }
      
      const data = await response.json();
      setConnected(data.connected);
      
      if (data.connected && token) {
        fetchFitnessData();
        fetchHeartRateData();
      }
    } catch (err) {
      console.error('Failed to check connection status:', err);
      setConnected(false);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/google-fit/auth', {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (err) {
      setError('Failed to initiate Google Fit connection');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('googleFitToken');
      await fetch('/api/google-fit/disconnect', {
        method: 'POST',
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {},
      });
      // Remove token from localStorage
      localStorage.removeItem('googleFitToken');
      setConnected(false);
      setFitnessData(null);
      setHeartRateData(null);
      setLatestHeartRate(null);
    } catch (err) {
      setError('Failed to disconnect Google Fit');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFitnessData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('googleFitToken');
      if (!token) {
        throw new Error('Not connected to Google Fit');
      }

      const response = await fetch('/api/google-fit/data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch fitness data');
      }

      const data = await response.json();
      setFitnessData(data);
    } catch (err) {
      setError('Failed to fetch fitness data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeartRateData = async () => {
    try {
      const token = localStorage.getItem('googleFitToken');
      if (!token) {
        return;
      }

      const response = await fetch('/api/google-fit/data/heart-rate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        // API returns array of { timestamp, bpm, source }
        if (Array.isArray(data) && data.length > 0) {
          // Sort by timestamp (most recent first)
          const sortedData = data.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setHeartRateData(sortedData);
          setLatestHeartRate(Math.round(sortedData[0].bpm));
        }
      }
    } catch (err) {
      console.error('Failed to fetch heart rate data:', err);
    }
  };

  return (
    <Card className="bg-white shadow-md border-l-4 border-blue-600">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Watch className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-gray-900">Connect Smartwatch</CardTitle>
              <CardDescription className="text-gray-700">
                Connect your Noise watch via Google Fit to track health metrics
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant={connected ? 'default' : 'secondary'}
            className={connected ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}
          >
            {connected ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" />
                Connected
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-3 w-3" />
                Not Connected
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 bg-white">
        {/* Connection Flow Diagram */}
        <div className="flex items-center justify-center gap-3 text-sm py-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Watch className="h-5 w-5 text-blue-600" />
            <span className="text-gray-900 font-medium">Noise Watch</span>
          </div>
          <span className="text-gray-600 font-bold text-lg">→</span>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="text-gray-900 font-medium">NoiseFit</span>
          </div>
          <span className="text-gray-600 font-bold text-lg">→</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-gray-900 font-medium">Google Fit</span>
          </div>
          <span className="text-gray-600 font-bold text-lg">→</span>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-600" />
            <span className="text-gray-900 font-medium">HealthScan</span>
          </div>
        </div>

        <p className="text-sm text-center text-gray-700 font-medium">
          Your fitness data will be synced automatically
        </p>

        {/* Connection Button */}
        <div className="flex justify-center">
          {!connected ? (
            <Button
              onClick={handleConnect}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-4 w-4" />
                  Connect Google Fit
                </>
              )}
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  fetchFitnessData();
                  fetchHeartRateData();
                }}
                disabled={loading}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:text-gray-900"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh Data
              </Button>
              <Button
                onClick={handleDisconnect}
                disabled={loading}
                variant="destructive"
              >
                Disconnect
              </Button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Fitness Data Display */}
        {connected && fitnessData && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">What we'll sync:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Heart Rate Card */}
              <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Heart className="h-8 w-8 text-red-600" />
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {fitnessData.summary.avgHeartRate}
                      </p>
                      <p className="text-xs text-gray-700 font-medium">avg BPM</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-800 font-medium">Heart Rate</p>
                </CardContent>
              </Card>

              {/* Steps Card */}
              <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Footprints className="h-8 w-8 text-green-600" />
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {fitnessData.summary.totalSteps.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-700 font-medium">total steps</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-800 font-medium">Steps</p>
                </CardContent>
              </Card>

              {/* Calories Card */}
              <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Flame className="h-8 w-8 text-orange-600" />
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {fitnessData.summary.totalCalories.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-700 font-medium">kcal</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-800 font-medium">Calories</p>
                </CardContent>
              </Card>

              {/* Sleep Card */}
              <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Moon className="h-8 w-8 text-purple-600" />
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {fitnessData.summary.avgSleepHours}h
                      </p>
                      <p className="text-xs text-gray-700 font-medium">avg per night</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-800 font-medium">Sleep</p>
                </CardContent>
              </Card>
            </div>

            <p className="text-xs text-center text-gray-700 font-medium">
              Data from last {fitnessData.summary.period}
            </p>

            {/* Detailed Heart Rate Data */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Heart Rate Data from Smartwatch
                </h4>
                <Button
                  onClick={fetchHeartRateData}
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh HR
                </Button>
              </div>
              {heartRateData && heartRateData.length > 0 ? (
                <>
                  {latestHeartRate && (
                    <div className="mb-4 p-4 bg-red-50 rounded-lg border-2 border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-700 font-medium mb-1">Latest Reading</div>
                          <div className="text-3xl font-bold text-red-600">
                            {latestHeartRate} <span className="text-lg text-gray-800">BPM</span>
                          </div>
                        </div>
                        <Heart className="h-12 w-12 text-red-600" />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {heartRateData.slice(0, 12).map((reading, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-gray-900">
                              {Math.round(reading.bpm)} BPM
                            </div>
                            <div className="text-xs text-gray-700 mt-1">
                              {new Date(reading.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <Heart className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="text-xs text-gray-700 mt-1">
                          Source: {reading.source.split(':').pop() || 'Unknown'}
                        </div>
                      </div>
                    ))}
                  </div>
                  {heartRateData.length > 12 && (
                    <p className="text-xs text-center text-gray-700 font-medium mt-2">
                      Showing latest 12 readings of {heartRateData.length} total
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-700">
                  <Heart className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                  <p className="font-medium text-gray-900">No heart rate data available</p>
                  <p className="text-xs mt-1 text-gray-700">Make sure your smartwatch is synced with Google Fit</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

