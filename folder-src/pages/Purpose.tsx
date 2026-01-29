import React from 'react';
import { Link } from 'react-router-dom';
import { GlassNavbar } from '@/components/GlassNavbar';
import { SiteFooter } from '@/components/SiteFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Shield, Cpu, Lightbulb, Smartphone, Heart, Activity, Zap, Target, Users, Stethoscope, ArrowRight } from 'lucide-react';

const Purpose = () => {
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 flex flex-col">
      <GlassNavbar />
      <main className="container mx-auto px-6 py-12 pt-24 flex-1">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg border-l-4 border-blue-600">
            <CardHeader className="text-center pb-8 bg-gradient-to-r from-blue-50 to-white">
              <Lightbulb className="w-16 h-16 mx-auto mb-6 text-blue-600" />
              <CardTitle className="text-4xl font-bold text-gray-900">
                The Purpose of Health Scan
              </CardTitle>
              <p className="text-xl text-gray-600 mt-4">
                Revolutionizing Neurological Screening Through Advanced Hardware & AI Integration
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <Badge className="bg-blue-600 text-white">ABDM Integrated</Badge>
                <Badge className="bg-green-600 text-white">Government Approved</Badge>
              </div>
            </CardHeader>
            <CardContent className="text-lg text-gray-700 space-y-6 bg-white">
              <p>
                    Health Scan represents the evolution from concept to reality—combining our innovative web-based AI platform with the revolutionary <strong className="text-gray-900">NeuraScan hardware device</strong>. What began as leveraging existing technology has transformed into creating purpose-built, medical-grade hardware for comprehensive health screening.
              </p>
              <p>
                Our mission has expanded to bridge the gap between accessible healthcare and professional-grade diagnostics. The NeuraScan device integrates multiple medical sensors with our AI-powered web platform, enabling early detection of neurological conditions like Parkinson's disease, Alzheimer's disease, and epilepsy in primary healthcare settings.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-center">
                <div className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Smartphone className="w-10 h-10 text-blue-600" />
                  <h3 className="font-bold text-gray-900">NeuraScan Device</h3>
                  <p className="text-sm text-gray-600">Professional-grade wearable with 6+ medical sensors and Raspberry Pi Zero processing.</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Heart className="w-10 h-10 text-green-600" />
                  <h3 className="font-bold text-gray-900">Medical-Grade Sensors</h3>
                  <p className="text-sm text-gray-600">Heart Rate Sensor AD8232, EMG, motion tracking, temperature, pulse oximetry, and voice analysis capabilities.</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <Brain className="w-10 h-10 text-orange-600" />
                  <h3 className="font-bold text-gray-900">AI-Powered Analysis</h3>
                  <p className="text-sm text-gray-600">Real-time neurological screening using advanced machine learning algorithms.</p>
                </div>
              </div>

              {/* New Hardware Features Section */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mt-8 border-l-4 border-blue-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Revolutionary Hardware Integration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-900 font-semibold">Comprehensive Monitoring</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      Simultaneous tracking of cardiac rhythm, muscle activity, tremor patterns, and vocal biomarkers for holistic neurological assessment.
                    </p>
                  </div>
                  <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      <span className="text-gray-900 font-semibold">8-10 Hour Battery Life</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      Extended continuous operation with USB-C fast charging and intelligent power management for all-day monitoring.
                    </p>
                  </div>
                  <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-green-600" />
                      <span className="text-gray-900 font-semibold">Early Detection Focus</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      Specialized algorithms for identifying early-stage Parkinson's, Alzheimer's, and epilepsy indicators through sensor fusion.
                    </p>
                  </div>
                  <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-cyan-600" />
                      <span className="text-gray-900 font-semibold">Primary Care Integration</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      Designed for seamless integration into primary healthcare workflows with secure data transmission and reporting.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 mt-8">
                <p className="text-center text-gray-700">
                  <strong className="text-blue-600">Important:</strong> The NeuraScan device is currently in development as a proof-of-concept for advanced neurological screening. 
                  It represents our vision for the future of accessible, technology-driven healthcare solutions that empower both patients and healthcare providers.
                </p>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-700 mb-4">
                  Experience our current web-based screening capabilities while we develop the full hardware solution.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/labs">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Try Web Labs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/device-model">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                      View Device Specs
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Purpose;
