import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceLab } from '@/components/labs/VoiceLab';
import MotorLab from '@/components/labs/MotorLab';
import { EyeLab } from '@/components/labs/EyeLab';
import { GlassNavbar } from '@/components/GlassNavbar';
import { GovernmentBanner } from '@/components/GovernmentBanner';
import { SiteFooter } from '@/components/SiteFooter';
import { 
  Activity, 
  Brain, 
  Eye, 
  Mic, 
  Timer, 
  TrendingUp,
  Sparkles,
  Shield,
  Cpu,
  ArrowRight,
  Stethoscope,
  Heart,
  CheckCircle
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const labs = [
    {
      id: 'motor',
      title: 'Motor & Tremor Lab', 
      description: 'Measure movement patterns, tremor frequency, and motor control',
      icon: Activity,
      status: 'ready',
      features: ['Finger Tapping', 'Tremor Analysis', 'Movement Speed', 'Coordination'],
      color: 'blue'
    },
    {
      id: 'voice',
      title: 'Voice & Speech Lab',
      description: 'Analyze vocal patterns, pitch stability, and speech characteristics',
      icon: Mic,
      status: 'ready',
      features: ['Pitch Analysis', 'Jitter Detection', 'Voice Quality', 'Speech Patterns'],
      color: 'green'
    },
    {
      id: 'eye',
      title: 'Eye & Cognition Lab',
      description: 'Test reaction times, visual attention, and cognitive processing',
      icon: Eye,
      status: 'ready', 
      features: ['Saccade Tests', 'Reaction Time', 'Stroop Test', 'Visual Attention'],
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 flex flex-col">
      <GlassNavbar />
      <GovernmentBanner />
      
      <main className="container mx-auto px-6 py-12 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-12 justify-center bg-white shadow-md border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700">Overview</TabsTrigger>
            <TabsTrigger value="labs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700">Labs</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-12 space-y-16">
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-lg p-12 text-center border-l-4 border-blue-600">
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Brain className="w-12 h-12 text-blue-600" />
                  <Stethoscope className="w-12 h-12 text-green-600" />
                </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                      Health Scan
                    </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Privacy-first browser lab bench for comprehensive health screening. 
                  All processing happens securely on your device.
                </p>
                <p className="text-lg text-gray-700 font-medium">
                  ABDM Integrated | Government Approved Healthcare Platform
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Badge className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 text-sm">
                  <Shield className="w-4 h-4" />
                  Privacy-First
                </Badge>
                <Badge className="bg-green-600 text-white flex items-center gap-2 px-4 py-2 text-sm">
                  <Cpu className="w-4 h-4" />
                  On-Device Processing
                </Badge>
                <Badge className="bg-orange-600 text-white flex items-center gap-2 px-4 py-2 text-sm">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Insights
                </Badge>
                <Badge className="bg-purple-600 text-white flex items-center gap-2 px-4 py-2 text-sm">
                  <Heart className="w-4 h-4" />
                  ABDM Compatible
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-600">
                <CardHeader className="text-center pb-8">
                  <Timer className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-4xl font-bold text-gray-900">3</CardTitle>
                  <CardDescription className="text-lg text-gray-600">Active Labs</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-600">
                <CardHeader className="text-center pb-8">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-4xl font-bold text-gray-900">Ready</CardTitle>
                  <CardDescription className="text-lg text-gray-600">System Status</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-600">
                <CardHeader className="text-center pb-8">
                  <CheckCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <CardTitle className="text-4xl font-bold text-gray-900">100%</CardTitle>
                  <CardDescription className="text-lg text-gray-600">Secure & Private</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Featured Lab */}
            <Card className="bg-white shadow-lg border-l-4 border-green-600">
              <CardHeader className="pb-6 bg-gradient-to-r from-green-50 to-white">
                <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                  <Mic className="w-8 h-8 text-green-600" />
                  Featured: Voice & Speech Lab
                </CardTitle>
                <CardDescription className="text-lg leading-relaxed text-gray-600">
                  Start with our most advanced lab - analyze vocal patterns and speech characteristics using cutting-edge signal processing
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Link to="/labs">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    Begin Voice Analysis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="labs" className="mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
              {labs.map((lab) => {
                const IconComponent = lab.icon;
                const colorClasses = {
                  blue: 'border-blue-600 text-blue-600 bg-blue-50',
                  green: 'border-green-600 text-green-600 bg-green-50',
                  orange: 'border-orange-600 text-orange-600 bg-orange-50'
                };
                return (
                  <Link to={`/labs/${lab.id}`} key={lab.id}>
                    <Card className={`bg-white shadow-md group cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 ${colorClasses[lab.color as keyof typeof colorClasses]}`}>
                      <CardHeader className="pb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-2xl ${colorClasses[lab.color as keyof typeof colorClasses]}`}>
                            <IconComponent className={`w-10 h-10 ${lab.color === 'blue' ? 'text-blue-600' : lab.color === 'green' ? 'text-green-600' : 'text-orange-600'}`} />
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-green-300 text-sm px-3 py-1">
                            {lab.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">
                          {lab.title}
                        </CardTitle>
                        <CardDescription className="text-lg leading-relaxed text-gray-600">
                          {lab.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="bg-white">
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {lab.features.map((feature) => (
                              <Badge
                                key={feature}
                                variant="outline"
                                className="text-sm px-3 py-1 border-gray-300 text-gray-700 bg-gray-50"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          <Button 
                            className={`w-full ${lab.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : lab.color === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'} text-white`}
                            size="lg"
                          >
                            Launch Lab
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-12">
            <Card className="bg-white shadow-lg border-l-4 border-green-600">
              <CardHeader className="bg-gradient-to-r from-green-50 to-white">
                <CardTitle className="text-3xl text-gray-900">Clinical Reports</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  AI-generated summaries and clinician-ready reports with comprehensive analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="text-center py-16">
                  <Brain className="w-16 h-16 mx-auto mb-6 text-blue-600" />
                  <p className="text-xl text-gray-700">Complete lab sessions to generate detailed reports</p>
                  <Link to="/dashboard" className="mt-6 inline-block">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      View Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
