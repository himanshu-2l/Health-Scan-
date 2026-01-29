import React from 'react';
import { GlassNavbar } from '@/components/GlassNavbar';
import { SiteFooter } from '@/components/SiteFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Github } from 'lucide-react';
import { Brain, Heart, Users, Award, Lightbulb, Shield, Cpu, Smartphone, Zap, Target, Activity, Stethoscope } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const About: React.FC = () => {
  
  const values = [
    {
      icon: Smartphone,
      title: "Hardware Innovation",
      description: "Developing professional-grade medical sensors integrated with Raspberry Pi Zero processing for comprehensive neurological monitoring.",
      color: "blue"
    },
    {
      icon: Stethoscope,
      title: "Medical Precision",
      description: "Every sensor and algorithm is designed with medical accuracy in mind, targeting early detection of neurological conditions.",
      color: "green"
    },
    {
      icon: Activity,
      title: "Comprehensive Monitoring",
      description: "Six medical-grade sensors working in harmony - Heart Rate Sensor, EMG, motion tracking, temperature, pulse oximetry, and voice analysis.",
      color: "orange"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "8-10 hour battery life with continuous real-time analysis and intelligent power management for all-day monitoring.",
      color: "purple"
    },
    {
      icon: Target,
      title: "Early Detection Focus",
      description: "Specialized AI algorithms for identifying early-stage indicators of Parkinson's, Alzheimer's, and epilepsy.",
      color: "cyan"
    },
    {
      icon: Users,
      title: "Primary Care Integration",
      description: "Designed for seamless integration into primary healthcare workflows with secure data transmission and professional reporting.",
      color: "indigo"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'border-blue-600 bg-blue-50 text-blue-600',
      green: 'border-green-600 bg-green-50 text-green-600',
      orange: 'border-orange-600 bg-orange-50 text-orange-600',
      purple: 'border-purple-600 bg-purple-50 text-purple-600',
      cyan: 'border-cyan-600 bg-cyan-50 text-cyan-600',
      indigo: 'border-indigo-600 bg-indigo-50 text-indigo-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 flex flex-col">
      <GlassNavbar />
      
      <div className="pt-24 pb-20 px-4 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-600">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              About <span className="text-blue-600">Health Scan</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're pioneering the future of neurological healthcare by developing the <strong className="text-gray-900">NeuraScan device</strong> - 
              a comprehensive medical-grade hardware platform that combines advanced AI with professional sensor technology 
              for early detection and monitoring of neurological conditions.
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge className="bg-blue-600 text-white">ABDM Integrated</Badge>
              <Badge className="bg-green-600 text-white">Government Approved</Badge>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mb-16">
            <Card className="bg-white shadow-lg border-l-4 border-green-600">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                  To revolutionize neurological healthcare by developing the <strong className="text-gray-900">NeuraScan device</strong> - 
                  a professional-grade, wearable diagnostic platform that bridges the gap between accessible healthcare and medical precision. 
                  Our comprehensive sensor array and AI-powered analysis enable early detection of Parkinson's disease, Alzheimer's disease, 
                  and epilepsy in primary care settings, making advanced neurological screening universally accessible.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card key={index} className={`bg-white shadow-md hover:shadow-lg transition-all duration-300 border-l-4 ${getColorClasses(value.color)}`}>
                    <CardHeader>
                      <div className={`p-3 rounded-lg w-fit mb-4 ${getColorClasses(value.color)}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">
                        {value.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {value.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Team</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Owais naeem */}
                <Card className="bg-white shadow-lg border-l-4 border-blue-600">
                  <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-white">
                    <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-blue-200">
                      <AvatarImage src="/owais.png" alt="Owais Naeem" />
                      <AvatarFallback className="bg-blue-100 text-blue-600">ON</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      Owais Naeem
                    </CardTitle>
                    <p className="text-xl text-gray-600 mt-2">Hardware Integration & AI Developer</p>
                  </CardHeader>
                  <CardContent className="mt-6 text-lg text-gray-700 space-y-6 text-center bg-white">
                    <p>
                      Owais is the co-creator of Health Scan, leading the backend development and AI integration for the NeuraScan platform. 
                      He specializes in machine learning algorithms for neurological analysis, backend API development, medical sensor data processing, 
                      and seamless integration between hardware components and AI systems.
                    </p>
                    <div className="flex justify-center gap-6 mt-8">
                      <a href="https://github.com/Geekluffy" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                        <Github className="w-8 h-8" />
                      </a>
                      <a href="https://linkedin.com/in/mohammad-owais-naeem" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                        <Linkedin className="w-8 h-8" />
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Himanshu Rathore */}
                <Card className="bg-white shadow-lg border-l-4 border-green-600">
                  <CardHeader className="text-center bg-gradient-to-r from-green-50 to-white">
                    <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-green-200">
                      <AvatarImage src="/himanshu.png" alt="Himanshu Rathore" />
                      <AvatarFallback className="bg-green-100 text-green-600">HR</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      Himanshu Rathore
                    </CardTitle>
                    <p className="text-xl text-gray-600 mt-2">Frontend, UX & IoT Developer</p>
                  </CardHeader>
                  <CardContent className="mt-6 text-lg text-gray-700 space-y-6 text-center bg-white">
                    <p>
                      Himanshu is the co-creator of Health Scan, leading frontend development and IoT integration for the NeuraScan platform. 
                      He specializes in creating intuitive user interfaces, medical data visualization, IoT device communication protocols, 
                      and seamless connectivity between the NeuraScan hardware and web platform for real-time monitoring.
                    </p>
                    <div className="flex justify-center gap-6 mt-8">
                      <a href="https://github.com/himanshu-2l" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600 transition-colors">
                        <Github className="w-8 h-8" />
                      </a>
                      <a href="https://www.linkedin.com/in/himanshu-rathore21/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600 transition-colors">
                        <Linkedin className="w-8 h-8" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default About;
