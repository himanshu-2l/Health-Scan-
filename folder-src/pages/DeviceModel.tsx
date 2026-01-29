import React from 'react';
import { GlassNavbar } from '@/components/GlassNavbar';
import { SiteFooter } from '@/components/SiteFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Mic, 
  Cpu, 
  Battery, 
  Wifi, 
  Gauge,
  Zap,
  Brain,
  MonitorSpeaker,
  Waves
} from 'lucide-react';

const DeviceModel: React.FC = () => {

  const sensorSpecs = [
    {
      icon: Heart,
      name: "AD8232 Heart Rate Monitor",
      description: "Single-lead heart rate signal acquisition",
      features: [
        "Heart rate variability analysis",
        "Real-time cardiac rhythm monitoring", 
        "Operating range: 30-300 BPM"
      ],
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: Activity,
      name: "EMG Muscle Activity Sensor (MyoWare)",
      description: "Surface electromyography detection",
      features: [
        "Muscle contraction amplitude measurement",
        "Frequency analysis: 20-500 Hz",
        "Adjustable gain control"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Gauge,
      name: "MPU-6050 Motion Sensor",
      description: "6-axis gyroscope and accelerometer",
      features: [
        "Tremor frequency detection (0.1-20 Hz)",
        "Movement pattern analysis",
        "Digital output with 16-bit ADCs"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Thermometer,
      name: "MAX30205 Temperature Sensor",
      description: "High-precision body temperature monitoring",
      features: [
        "±0.1°C accuracy",
        "Temperature compensation for sensor calibration",
        "I2C digital interface"
      ],
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: MonitorSpeaker,
      name: "MAX30102 Pulse Oximeter",
      description: "SpO2 oxygen saturation measurement",
      features: [
        "Heart rate monitoring",
        "Red and infrared LED configuration",
        "Real-time pulse waveform analysis"
      ],
      gradient: "from-purple-500 to-violet-500"
    },
    {
      icon: Mic,
      name: "INMP441 Digital Microphone",
      description: "High-fidelity speech capture",
      features: [
        "I2S digital audio interface",
        "Voice pattern analysis compatibility",
        "Low-noise, high SNR design"
      ],
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  const systemSpecs = [
    {
      icon: Cpu,
      name: "Raspberry Pi Zero",
      description: "Compact single-board computer",
      specs: [
        "ARM11 single-core processor",
        "Wi-Fi and Bluetooth connectivity",
        "MicroSD card storage",
        "Real-time data processing capabilities"
      ]
    },
    {
      icon: Battery,
      name: "3000mAh Li-ion Battery",
      description: "Extended operation power system",
      specs: [
        "8-10 hours continuous operation",
        "USB-C fast charging",
        "Battery level monitoring",
        "Low-power sleep modes"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 flex flex-col">
      <GlassNavbar />
      
      <div className="pt-24 pb-20 px-4 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-600">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              <span className="text-blue-600">NeuraScan</span> Device
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Professional-Grade Neurological Screening Hardware combining multiple medical-grade sensors 
              with our NeuraLab web platform for early detection of neurological conditions.
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge className="bg-blue-600 text-white">ABDM Integrated</Badge>
              <Badge className="bg-green-600 text-white">Government Approved</Badge>
            </div>
          </div>

          {/* Device Images */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Device Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((num) => (
                <Card key={num} className="bg-white shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300 border border-gray-200">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={`/idea${num}.png`} 
                      alt={`NeuraScan Device Concept ${num}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4 bg-white">
                    <h3 className="text-lg font-semibold text-gray-900 text-center">
                      Concept {num}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Overview Section */}
          <div className="mb-16">
            <Card className="bg-white shadow-lg border-l-4 border-green-600">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Overview</h2>
                <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                  The NeuraScan device is a comprehensive, wearable neurological screening kit designed for primary healthcare settings. 
                  By combining multiple medical-grade sensors with our NeuraLab web platform, it enables early detection of neurological 
                  conditions including Parkinson's disease, Alzheimer's disease, and epilepsy.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Sensor Array */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Core Sensor Array</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sensorSpecs.map((sensor, index) => {
                const IconComponent = sensor.icon;
                return (
                  <Card key={index} className="bg-white shadow-md group hover:shadow-lg transition-all duration-300 border-l-4 border-blue-600">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                      <div className={`p-4 rounded-lg bg-gradient-to-br ${sensor.gradient} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{sensor.name}</CardTitle>
                      <CardDescription className="text-gray-600 text-base">
                        {sensor.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="bg-white">
                      <ul className="space-y-2">
                        {sensor.features.map((feature, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Processing & Power Systems */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Processing & Power Systems</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {systemSpecs.map((system, index) => {
                const IconComponent = system.icon;
                return (
                  <Card key={index} className="bg-white shadow-md group hover:shadow-lg transition-all duration-300 border-l-4 border-green-600">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-white">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-green-100 w-fit">
                          <IconComponent className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-gray-900">{system.name}</CardTitle>
                          <CardDescription className="text-gray-600 text-base mt-1">
                            {system.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="bg-white">
                      <ul className="space-y-3">
                        {system.specs.map((spec, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start gap-3">
                            <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Technical Specifications Summary */}
          <div className="mb-16">
            <Card className="bg-white shadow-lg border-l-4 border-orange-600">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
                <CardTitle className="text-3xl font-bold text-gray-900 text-center">
                  Technical Specifications Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">6+</div>
                    <div className="text-gray-700">Medical-Grade Sensors</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">8-10h</div>
                    <div className="text-gray-700">Battery Life</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">Real-time</div>
                    <div className="text-gray-700">Data Processing</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">Wi-Fi</div>
                    <div className="text-gray-700">Connectivity</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Applications */}
          <div className="mb-16">
            <Card className="bg-white shadow-lg border-l-4 border-purple-600">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-white">
                <CardTitle className="text-3xl font-bold text-gray-900 text-center mb-6">
                  Target Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-lg border-2 border-purple-200 bg-purple-50">
                    <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Parkinson's Disease</h3>
                    <p className="text-gray-700">Early detection through tremor analysis and motor function assessment</p>
                  </div>
                  <div className="text-center p-6 rounded-lg border-2 border-pink-200 bg-pink-50">
                    <Waves className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Alzheimer's Disease</h3>
                    <p className="text-gray-700">Cognitive screening through voice pattern and motor coordination analysis</p>
                  </div>
                  <div className="text-center p-6 rounded-lg border-2 border-blue-200 bg-blue-50">
                    <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Epilepsy</h3>
                    <p className="text-gray-700">Seizure detection and monitoring through comprehensive sensor fusion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="bg-white shadow-lg max-w-2xl mx-auto border-l-4 border-blue-600">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Experience NeuraScan
                </h3>
                <p className="text-gray-700 mb-6">
                  Try our AI-powered neurological screening platform and discover how technology 
                  is revolutionizing early detection and healthcare accessibility.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/labs" 
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-center"
                  >
                    Try the Labs
                  </a>
                  <a 
                    href="/about" 
                    className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 text-center"
                  >
                    Learn More
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default DeviceModel;
