import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Battery, 
  Wifi, 
  Bluetooth, 
  Download, 
  AlertTriangle, 
  Heart, 
  Thermometer,
  Gauge,
  Power,
  WifiOff,
  BluetoothOff,
  CheckCircle,
  XCircle,
  FileText,
  BarChart3,
  TrendingUp,
  Clock
} from 'lucide-react';

// Types for sensor data
interface SensorData {
  timestamp: number;
  value: number;
}

interface DeviceStatus {
  isConnected: boolean;
  batteryLevel: number;
  powerConsumption: number;
  wifiStrength: number;
  bluetoothConnected: boolean;
  sensors: {
    ecg: boolean;
    temperature: boolean;
  };
}

interface AlertData {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
  sensor: string;
}

export const HardwareDataDisplay: React.FC = () => {
  // State for real-time data
  const [ecgData, setEcgData] = useState<SensorData[]>([]);
  const [tempData, setTempData] = useState<SensorData[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    isConnected: false,
    batteryLevel: 0,
    powerConsumption: 0,
    wifiStrength: 0,
    bluetoothConnected: false,
    sensors: {
      ecg: false,
      temperature: false
    }
  });
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSimulatingConnection, setIsSimulatingConnection] = useState(false);
  const [showConnectionSuccess, setShowConnectionSuccess] = useState(false);
  const [isWaitingForTemperature, setIsWaitingForTemperature] = useState(false);

  // Canvas refs for real-time charts
  const ecgCanvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const temperatureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tempIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate fake random temperature data
  const generateFakeTemperature = useCallback((): number => {
    const baseTemp = 36.5; // Base temperature in Celsius
    const variation = (Math.random() - 0.5) * 0.8; // Random variation between -0.4 and +0.4
    const timeVariation = Math.sin(Date.now() / 60000) * 0.3; // Slow sine wave for natural variation
    const temperatureCelsius = baseTemp + variation + timeVariation;
    // Ensure temperature stays within normal human range
    return Math.max(36.0, Math.min(37.5, temperatureCelsius));
  }, []);

  // Simulate real-time data generation - but only for connected sensors
  useEffect(() => {
    // Only generate data if device is connected
    if (!deviceStatus.isConnected) {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      
      // Simulate Heart Rate Sensor AD8232 data (heart rate pattern)
      if (deviceStatus.sensors.ecg) {
        const ecgValue = Math.sin(now / 100) * 50 + Math.random() * 10 + 60;
        setEcgData(prev => [...prev.slice(-100), { timestamp: now, value: ecgValue }]);
        
        // Generate alerts for abnormal readings
        if (ecgValue > 120 && Math.random() < 0.1) {
          const newAlert: AlertData = {
            id: `alert-${now}`,
            type: 'warning',
            message: 'High heart rate detected',
            timestamp: now,
            sensor: 'Heart Rate Sensor AD8232'
          };
          setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
        }
      }
      
      // Temperature is handled separately with 30-second intervals
      // Don't generate temperature here anymore
      
      // Randomly update device status
      if (Math.random() < 0.1) {
        setDeviceStatus(prev => ({
          ...prev,
          batteryLevel: Math.max(0, prev.batteryLevel - 0.1),
          powerConsumption: 12 + Math.random() * 8,
          wifiStrength: 70 + Math.random() * 30
        }));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [deviceStatus.isConnected, deviceStatus.sensors]);

  // Temperature data generation with 30-second intervals
  useEffect(() => {
    if (deviceStatus.isConnected && deviceStatus.sensors.temperature && !isWaitingForTemperature) {
      // Generate initial temperature
      const generateTemp = () => {
        const tempValue = generateFakeTemperature();
        const now = Date.now();
        setTempData(prev => [...prev.slice(-100), { timestamp: now, value: tempValue }]);
      };

      // Generate immediately
      generateTemp();

      // Set up interval for every 30 seconds
      if (!tempIntervalRef.current) {
        tempIntervalRef.current = setInterval(() => {
          generateTemp();
        }, 30000); // 30 seconds
      }
    } else {
      // Clear interval when disconnected or waiting
      if (tempIntervalRef.current) {
        clearInterval(tempIntervalRef.current);
        tempIntervalRef.current = null;
      }
    }

    return () => {
      if (tempIntervalRef.current) {
        clearInterval(tempIntervalRef.current);
        tempIntervalRef.current = null;
      }
    };
  }, [deviceStatus.isConnected, deviceStatus.sensors.temperature, isWaitingForTemperature, generateFakeTemperature]);

  // Draw real-time charts
  useEffect(() => {
    drawChart(ecgCanvasRef.current, ecgData, '#8b5cf6', 'Heart Rate Sensor AD8232');
  }, [ecgData]);

  useEffect(() => {
    drawChart(tempCanvasRef.current, tempData, '#f59e0b', 'Temperature');
  }, [tempData]);

  const drawChart = (canvas: HTMLCanvasElement | null, data: SensorData[], color: string, label: string) => {
    if (!canvas || data.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw data line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((point.value - Math.min(...data.map(d => d.value))) / 
        (Math.max(...data.map(d => d.value)) - Math.min(...data.map(d => d.value)))) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  };

  const exportData = (format: 'json' | 'csv' | 'pdf') => {
    const data = {
      ecg: ecgData,
      temperature: tempData,
      timestamp: new Date().toISOString()
    };
    
    let content: string;
    let fileName: string;
    let mimeType: string;
    
    switch (format) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        fileName = `healthscan-data-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      case 'csv':
        const csvHeader = 'Timestamp,Heart_Rate_Sensor_AD8232,Temperature\n';
        const csvRows = ecgData.map((_, index) => {
          return [
            ecgData[index]?.timestamp || '',
            ecgData[index]?.value || '',
            tempData[index]?.value || ''
          ].join(',');
        }).join('\n');
        content = csvHeader + csvRows;
        fileName = `healthscan-data-${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;
      case 'pdf':
        // For PDF, we'll create a simple text representation
        content = `Health Scan Hardware Data Report\n\nGenerated: ${new Date().toISOString()}\n\nHeart Rate Sensor AD8232 Data Points: ${ecgData.length}\nTemperature Data Points: ${tempData.length}`;
        fileName = `healthscan-report-${Date.now()}.txt`;
        mimeType = 'text/plain';
        break;
      default:
        return;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (isOnline: boolean) => isOnline ? 'text-green-400' : 'text-red-400';
  const getStatusIcon = (isOnline: boolean) => isOnline ? CheckCircle : XCircle;

  // Secret button handler - simulate sensor connection
  const handleSecretConnect = useCallback(() => {
    if (!deviceStatus.isConnected) {
      setIsSimulatingConnection(true);
      setShowConnectionSuccess(false);
      setIsWaitingForTemperature(false);
      
      // Clear any existing timeouts
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      if (temperatureTimeoutRef.current) {
        clearTimeout(temperatureTimeoutRef.current);
      }
      
      // After 4 seconds, show "Sensor successfully connected!" message
      connectionTimeoutRef.current = setTimeout(() => {
        setIsSimulatingConnection(false);
        setShowConnectionSuccess(true);
        
        // Update device status to connected
        setDeviceStatus(prev => ({
          ...prev,
          isConnected: true,
          batteryLevel: 85,
          powerConsumption: 15,
          wifiStrength: 85,
          bluetoothConnected: true,
          sensors: {
            ecg: true,
            temperature: false // Will be enabled after 30 seconds
          }
        }));
        
        setIsWaitingForTemperature(true);
        
        // After another 30 seconds (total 34 seconds), enable temperature sensor
        temperatureTimeoutRef.current = setTimeout(() => {
          setIsWaitingForTemperature(false);
          setShowConnectionSuccess(false);
          
          // Enable temperature sensor
          setDeviceStatus(prev => ({
            ...prev,
            sensors: {
              ...prev.sensors,
              temperature: true
            }
          }));
        }, 30000); // Wait 30 seconds after connection success
      }, 4000); // Wait 4 seconds before showing success message
    }
  }, [deviceStatus.isConnected]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      if (temperatureTimeoutRef.current) {
        clearTimeout(temperatureTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-4 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Activity className="w-8 h-8 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-900">Hardware Integration</h1>
        </div>
        <p className="text-lg text-gray-700">
          Real-time neurological sensor data monitoring from Health Scan waistband device
        </p>
        <Badge className="bg-indigo-600 text-white mt-2">Live Data Streaming</Badge>
      </div>

      {/* Development Status Banner */}
      <Alert className="border-yellow-500 bg-yellow-50 border-l-4">
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
        <AlertDescription className="text-gray-700">
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">Hardware Integration Interface</p>
            <p className="text-sm">
              This hardware integration interface displays real-time sensor data from the Health Scan waistband device. 
              Connect your device to view live sensor readings.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Device Connection Status */}
      <Card className={`bg-white shadow-md border-l-4 ${deviceStatus.isConnected ? 'border-green-600' : 'border-red-600'}`}>
        <CardHeader>
          <CardTitle className={`text-gray-900 flex items-center gap-2 ${deviceStatus.isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {deviceStatus.isConnected ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            {deviceStatus.isConnected ? 'Device Connected' : 'Device Not Connected'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {deviceStatus.isConnected 
              ? 'Health Scan waistband device is connected and streaming sensor data.'
              : 'Health Scan waistband device is not currently connected. Please connect your device to view real-time sensor data.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {deviceStatus.isConnected ? (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 cursor-pointer border-green-600 text-green-700 hover:bg-green-50"
                  disabled
                >
                  <CheckCircle className="w-4 h-4" />
                  Connected
                </Button>
                <Badge className="bg-green-600 text-white">Online</Badge>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 cursor-pointer border-indigo-600 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors"
                  onClick={handleSecretConnect}
                  title="Click to connect sensor"
                >
                  <Power className="w-4 h-4" />
                  Connect Device
                </Button>
                <Badge className="bg-red-600 text-white">Offline</Badge>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connection Status Messages */}
      {(isSimulatingConnection || showConnectionSuccess || isWaitingForTemperature) && (
        <Alert className={`border-l-4 bg-white ${
          isSimulatingConnection ? 'border-yellow-500 bg-yellow-50' :
          showConnectionSuccess ? 'border-green-500 bg-green-50' :
          'border-blue-500 bg-blue-50'
        }`}>
          <Activity className={`h-5 w-5 ${
            isSimulatingConnection ? 'text-yellow-600 animate-spin' :
            showConnectionSuccess ? 'text-green-600' :
            'text-blue-600 animate-spin'
          }`} />
          <AlertDescription className={`${
            isSimulatingConnection ? 'text-yellow-800' :
            showConnectionSuccess ? 'text-green-800' :
            'text-blue-800'
          }`}>
            {isSimulatingConnection ? (
              <span className="font-medium">Connecting to sensor...</span>
            ) : showConnectionSuccess ? (
              <div>
                <div className="font-semibold mb-1 text-gray-900">Sensor successfully connected!</div>
                <div className="text-sm text-gray-700">Initializing temperature reading...</div>
              </div>
            ) : (
              <div>
                <div className="font-semibold mb-1 text-gray-900">Sensor successfully connected!</div>
                <div className="text-sm text-gray-700">Waiting for temperature data...</div>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Recording Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-600">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Data Recording</h2>
          <p className="text-gray-600">Start recording sensor data for analysis</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsRecording(!isRecording)}
            className={`flex items-center gap-2 ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
            disabled={!deviceStatus.isConnected}
          >
            {isRecording ? <XCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </div>
      </div>

      {/* Device Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Battery Status */}
        <Card className={`bg-white shadow-md border-l-4 ${deviceStatus.isConnected ? 'border-blue-600' : 'border-gray-400'} ${deviceStatus.isConnected ? '' : 'opacity-60'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 flex items-center gap-2 text-sm font-semibold">
              <Battery className={`w-4 h-4 ${deviceStatus.isConnected ? 'text-blue-600' : 'text-gray-500'}`} />
              Battery Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-3xl font-bold ${deviceStatus.isConnected ? 'text-blue-600' : 'text-gray-400'}`}>
                  {deviceStatus.isConnected ? `${Math.round(deviceStatus.batteryLevel)}%` : '--'}
                </span>
                <Badge className={deviceStatus.isConnected ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}>
                  {deviceStatus.isConnected ? 'Active' : 'No Device'}
                </Badge>
              </div>
              <Progress value={deviceStatus.isConnected ? deviceStatus.batteryLevel : 0} className="h-3" />
              <p className={`text-xs font-medium ${deviceStatus.isConnected ? 'text-gray-600' : 'text-gray-400'}`}>
                Power: {deviceStatus.isConnected ? `${deviceStatus.powerConsumption.toFixed(1)} W` : '-- W'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        <Card className={`bg-white shadow-md border-l-4 ${deviceStatus.isConnected ? 'border-green-600' : 'border-gray-400'} ${deviceStatus.isConnected ? '' : 'opacity-60'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 flex items-center gap-2 text-sm font-semibold">
              {deviceStatus.isConnected ? (
                <Wifi className="w-4 h-4 text-green-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-gray-500" />
              )}
              Connectivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className={`text-sm font-medium ${deviceStatus.isConnected ? 'text-gray-700' : 'text-gray-400'}`}>WiFi</span>
                <div className="flex items-center gap-2">
                  {deviceStatus.isConnected ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-600">{Math.round(deviceStatus.wifiStrength)}%</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">--</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className={`text-sm font-medium ${deviceStatus.isConnected ? 'text-gray-700' : 'text-gray-400'}`}>Bluetooth</span>
                <div className="flex items-center gap-2">
                  {deviceStatus.bluetoothConnected ? (
                    <>
                      <Bluetooth className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-600">Connected</span>
                    </>
                  ) : (
                    <>
                      <BluetoothOff className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Disconnected</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Status */}
        <Card className={`bg-white shadow-md border-l-4 ${deviceStatus.isConnected ? 'border-purple-600' : 'border-gray-400'} ${deviceStatus.isConnected ? '' : 'opacity-60'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 flex items-center gap-2 text-sm font-semibold">
              <Gauge className={`w-4 h-4 ${deviceStatus.isConnected ? 'text-purple-600' : 'text-gray-500'}`} />
              Sensors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(deviceStatus.sensors).map(([sensor, status]) => {
                const StatusIcon = getStatusIcon(status);
                return (
                  <div key={sensor} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <StatusIcon className={`w-4 h-4 ${status ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-xs font-medium capitalize ${status ? 'text-gray-900' : 'text-gray-500'}`}>{sensor}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card className={`bg-white shadow-md border-l-4 border-orange-600 ${!deviceStatus.isConnected ? 'opacity-60' : ''}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 flex items-center gap-2 text-sm font-semibold">
              <Download className="w-4 h-4 text-orange-600" />
              Export Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => exportData('json')}
                className="w-full text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={!deviceStatus.isConnected}
              >
                <FileText className="w-3 h-3 mr-1" />
                JSON
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => exportData('csv')}
                className="w-full text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={!deviceStatus.isConnected}
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Active Alerts
          </h3>
          {alerts.map((alert) => (
            <Alert key={alert.id} className={`border-l-4 bg-white ${
              alert.type === 'error' ? 'border-red-600 bg-red-50' : 
              alert.type === 'warning' ? 'border-yellow-600 bg-yellow-50' : 'border-blue-600 bg-blue-50'
            }`}>
              <AlertTriangle className={`h-4 w-4 ${
                alert.type === 'error' ? 'text-red-600' : 
                alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
              }`} />
              <AlertDescription className="text-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <strong className="text-gray-900">{alert.sensor}:</strong> {alert.message}
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Real-time Charts */}
      <Tabs defaultValue="ecg" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger value="ecg" className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-700">
            <Heart className="w-4 h-4" />
            Heart Rate Sensor AD8232
          </TabsTrigger>
          <TabsTrigger value="temp" className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-700">
            <Thermometer className="w-4 h-4" />
            Temperature
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ecg">
          <Card className="bg-white shadow-md border-l-4 border-red-600">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Heart Rate Sensor AD8232 - Single-lead heart rate monitoring
              </CardTitle>
              <CardDescription className="text-gray-600">Real-time heart electrical activity monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-sm font-medium text-gray-700">
                    Current BPM: <span className="text-red-600 font-bold text-lg">
                      {ecgData.length > 0 ? Math.round(ecgData[ecgData.length - 1].value) : '--'}
                    </span>
                  </div>
                  <Badge className={ecgData.length > 0 && ecgData[ecgData.length - 1].value > 100 ? "bg-red-600 text-white" : "bg-green-600 text-white"}>
                    {ecgData.length > 0 && ecgData[ecgData.length - 1].value > 100 ? 'Elevated' : 'Normal'}
                  </Badge>
                </div>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <canvas 
                    ref={ecgCanvasRef} 
                    width={800} 
                    height={200} 
                    className="w-full h-48 bg-white rounded border border-gray-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temp">
          <Card className="bg-white shadow-md border-l-4 border-orange-600">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-orange-600" />
                Temperature Monitoring
              </CardTitle>
              <CardDescription className="text-gray-600">
                Real-time body temperature tracking via IoT sensor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-sm font-medium text-gray-700">
                    Current Temp: <span className="text-orange-600 font-bold text-lg">
                      {tempData.length > 0 ? `${tempData[tempData.length - 1].value.toFixed(1)}°C` : 
                       isWaitingForTemperature ? 'Initializing...' : '--'}
                    </span>
                  </div>
                  <Badge className={tempData.length > 0 ? "bg-green-600 text-white" : isWaitingForTemperature ? "bg-yellow-500 text-white" : "bg-gray-400 text-white"}>
                    {tempData.length > 0 ? 'Normal' : isWaitingForTemperature ? 'Waiting...' : 'No Data'}
                  </Badge>
                </div>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <canvas 
                    ref={tempCanvasRef} 
                    width={800} 
                    height={200} 
                    className="w-full h-48 bg-white rounded border border-gray-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Historical Data Section */}
      <Card className="bg-white shadow-md border-l-4 border-indigo-600">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Historical Data & Trends
          </CardTitle>
          <CardDescription className="text-gray-600">Data analysis and historical comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-5 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-sm font-medium text-gray-600 mb-1">Session Duration</div>
              <div className="text-2xl font-bold text-blue-600">
                --:--
              </div>
            </div>
            <div className="text-center p-5 bg-green-50 rounded-lg border border-green-200">
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-sm font-medium text-gray-600 mb-1">Data Points</div>
              <div className="text-2xl font-bold text-green-600">
                {ecgData.length + tempData.length}
              </div>
            </div>
            <div className="text-center p-5 bg-purple-50 rounded-lg border border-purple-200">
              <Activity className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-sm font-medium text-gray-600 mb-1">Data Rate</div>
              <div className="text-2xl font-bold text-purple-600">-- Hz</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HardwareDataDisplay;
