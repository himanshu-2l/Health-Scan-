/**
 * EHR Integration Page
 * Displays EHR integration, medical history, and health data management
 */

import React from 'react';
import { GlassNavbar } from '@/components/GlassNavbar';
import { SiteFooter } from '@/components/SiteFooter';
import { EHRIntegration } from '@/components/EHRIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hospital, Shield, TrendingUp, Users, FileText, Activity, Heart } from 'lucide-react';

export const EHRPage: React.FC = () => {

  const benefits = [
    {
      icon: Hospital,
      title: "ABDM Integration",
      description: "Connect to India's national health infrastructure",
      color: "blue"
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description: "Your health data is encrypted and stored securely",
      color: "green"
    },
    {
      icon: TrendingUp,
      title: "Track Trends",
      description: "Monitor your health metrics over time",
      color: "orange"
    },
    {
      icon: Users,
      title: "Share with Doctors",
      description: "Seamlessly share results with healthcare providers",
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'border-blue-600 bg-blue-50 text-blue-600',
      green: 'border-green-600 bg-green-50 text-green-600',
      orange: 'border-orange-600 bg-orange-50 text-orange-600',
      purple: 'border-purple-600 bg-purple-50 text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 flex flex-col">
      <GlassNavbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 flex-1">
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Hospital className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Electronic Health Records
                  <Badge className="bg-blue-600 text-white text-xs ml-2">
                    <Shield className="w-3 h-3 mr-1" />
                    ABDM
                  </Badge>
                </h1>
                <p className="text-sm text-gray-700 mt-1">
                  Connect your ABHA ID to access medical history & enable seamless health data sharing
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white text-xs px-2 py-1">Government Approved</Badge>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className={`bg-white shadow-md hover:shadow-lg transition-all border-l-4 ${getColorClasses(benefit.color)}`}>
                  <CardHeader className="pb-3">
                    <div className={`p-2 rounded-lg w-fit mb-3 ${getColorClasses(benefit.color)}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-base text-gray-900">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white pt-0">
                    <CardDescription className="text-sm text-gray-700">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {/* Main EHR Integration Component */}
        <EHRIntegration />
      </div>
      <SiteFooter />
    </div>
  );
};
