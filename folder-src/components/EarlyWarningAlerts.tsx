/**
 * Hypoglycemia / Hyperglycemia Early Warning Alerts Component
 * Integrates heart rate, temperature, and glucose data
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  Heart,
  Thermometer,
  Droplet,
  Bell,
  MessageSquare,
  Activity,
} from 'lucide-react';
import {
  analyzeSensorData,
  saveAlert,
  getRecentAlerts,
  getCriticalAlertsCount,
  WarningAlert,
  SensorData,
  sendSMSAlert,
} from '@/services/earlyWarningService';
import { format, parseISO } from 'date-fns';
import { getAllGlucoseReadings } from '@/services/glucoseService';

// Using relative URLs - Vite proxy handles routing to backend

export const EarlyWarningAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<WarningAlert[]>([]);
  const [criticalCount, setCriticalCount] = useState(0);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [glucose, setGlucose] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [autoCheck, setAutoCheck] = useState(true);

  useEffect(() => {
    loadRecentAlerts();
    loadCriticalCount();
    
    // Auto-check every 5 minutes if enabled
    if (autoCheck) {
      const interval = setInterval(() => {
        checkSensorData();
      }, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [autoCheck]);

  useEffect(() => {
    // Load heart rate and temperature from Google Fit if available
    loadSensorData();
    
    // Refresh sensor data every 30 seconds
    const interval = setInterval(() => {
      loadSensorData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadRecentAlerts = () => {
    const recent = getRecentAlerts(7);
    setAlerts(recent);
  };

  const loadCriticalCount = () => {
    const count = getCriticalAlertsCount(24);
    setCriticalCount(count);
  };

  const loadSensorData = async () => {
    try {
      // Try to get heart rate from Google Fit
      const token = localStorage.getItem('googleFitToken');
      if (!token) {
        return;
      }
      
      const hrResponse = await fetch('/api/google-fit/data/heart-rate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (hrResponse.ok) {
        const hrData = await hrResponse.json();
        // API returns array of { timestamp, bpm, source }
        if (Array.isArray(hrData) && hrData.length > 0) {
          // Get the most recent heart rate reading
          const latestHR = hrData.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];
          setHeartRate(Math.round(latestHR.bpm));
        } else if (hrData.heartRate && Array.isArray(hrData.heartRate) && hrData.heartRate.length > 0) {
          // Fallback for different response format
          const latestHR = hrData.heartRate[0];
          setHeartRate(Math.round(latestHR.bpm));
        }
      }
    } catch (error) {
      console.log('Heart rate data not available:', error);
    }

    try {
      // Try to get temperature
      const tempResponse = await fetch('/api/body-temperature', {
        credentials: 'include',
      });
      if (tempResponse.ok) {
        const tempData = await tempResponse.json();
        setTemperature(tempData.temperature);
      }
    } catch (error) {
      console.log('Temperature data not available:', error);
    }

    // Get latest glucose reading
    const glucoseReadings = getAllGlucoseReadings();
    if (glucoseReadings.length > 0) {
      const latest = glucoseReadings[0];
      setGlucose(latest.fasting || latest.postMeal || null);
    }
  };

  const checkSensorData = () => {
    const sensorData: SensorData = {
      heartRate: heartRate || undefined,
      temperature: temperature || undefined,
      glucose: glucose || undefined,
      timestamp: new Date().toISOString(),
    };

    const detectedAlerts = analyzeSensorData(sensorData);
    
    if (detectedAlerts.length > 0) {
      detectedAlerts.forEach(alert => {
        saveAlert(alert);
        
        // Send SMS if phone number is set and alert is critical
        if (phoneNumber && alert.requiresImmediateAction) {
          sendSMSAlert(alert, phoneNumber);
        }
      });
      
      loadRecentAlerts();
      loadCriticalCount();
    }
  };

  const handleManualCheck = () => {
    checkSensorData();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'hypoglycemia':
      case 'hypoglycemia-risk':
        return <Droplet className="w-5 h-5 text-blue-600" />;
      case 'hyperglycemia':
        return <Droplet className="w-5 h-5 text-red-600" />;
      case 'infection-risk':
        return <Thermometer className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-gray-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
              Early Warning Alerts System
            </CardTitle>
          </div>
          {criticalCount > 0 && (
            <Badge className="bg-red-600 text-white text-sm px-2 py-1">
              {criticalCount} Critical
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          Hypoglycemia/Hyperglycemia detection using heart rate, temperature, and glucose sensors
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Current Sensor Data */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800 text-center">
            <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
            <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">Heart Rate</div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {heartRate ? `${heartRate} bpm` : 'N/A'}
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3 border border-orange-200 dark:border-orange-800 text-center">
            <Thermometer className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
            <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">Temperature</div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-300">
              {temperature ? `${temperature.toFixed(1)}°C` : 'N/A'}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-800 text-center">
            <Droplet className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
            <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">Glucose</div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">
              {glucose ? `${glucose} mg/dL` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Manual Input */}
        <Card className="bg-gray-50 dark:bg-gray-700">
          <CardHeader>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100">
              Manual Sensor Input (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
                  Heart Rate (bpm)
                </label>
                <Input
                  type="number"
                  value={heartRate || ''}
                  onChange={(e) => setHeartRate(e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="72"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
                  Temperature (°C)
                </label>
                <Input
                  type="number"
                  value={temperature || ''}
                  onChange={(e) => setTemperature(e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="36.5"
                  step="0.1"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
                  Glucose (mg/dL)
                </label>
                <Input
                  type="number"
                  value={glucose || ''}
                  onChange={(e) => setGlucose(e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="100"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
            <Button
              onClick={handleManualCheck}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
            >
              <Activity className="w-4 h-4 mr-2" />
              Check for Alerts
            </Button>
          </CardContent>
        </Card>

        {/* SMS Alert Setup */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              SMS Alert Setup (GSM Module)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number for emergency alerts"
                className="bg-white dark:bg-gray-800 flex-1"
              />
              <Button
                onClick={() => {
                  localStorage.setItem('emergency_phone', phoneNumber);
                  alert('Phone number saved! Critical alerts will be sent via SMS.');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300 mt-2 font-medium">
              Critical alerts will be automatically sent to this number via GSM module
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-600 dark:text-red-400" />
              Recent Alerts (Last 7 Days)
            </div>
            {alerts.map((alert) => (
              <Alert
                key={alert.id}
                className={
                  alert.severity === 'critical'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : alert.severity === 'high'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                }
              >
                <div className="flex items-start gap-2">
                  {getAlertTypeIcon(alert.type)}
                  <div className="flex-1">
                    <AlertTitle className="font-semibold text-gray-900 dark:text-gray-100">
                      {alert.message}
                    </AlertTitle>
                    <AlertDescription className="mt-2 space-y-2">
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        {format(parseISO(alert.timestamp), 'MMM dd, yyyy HH:mm')}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Sensor Data:</strong> HR: {alert.sensorData.heartRate || 'N/A'} bpm, 
                        Temp: {alert.sensorData.temperature ? `${alert.sensorData.temperature.toFixed(1)}°C` : 'N/A'}, 
                        Glucose: {alert.sensorData.glucose || 'N/A'} mg/dL
                      </div>
                      {alert.recommendations.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            Recommendations:
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            {alert.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {alert.requiresImmediateAction && (
                        <Badge className="bg-red-600 text-white mt-2">
                          Requires Immediate Action
                        </Badge>
                      )}
                    </AlertDescription>
                  </div>
                  <Badge className={getSeverityColor(alert.severity) + ' text-white'}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Empty State */}
        {alerts.length === 0 && (
          <div className="text-center py-8 space-y-4">
            <AlertTriangle className="w-16 h-16 mx-auto text-gray-600 dark:text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                No alerts detected
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                System will automatically check sensor data and alert you of any risks
              </p>
              <Button
                onClick={handleManualCheck}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Activity className="w-4 h-4 mr-2" />
                Check Now
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EarlyWarningAlerts;

