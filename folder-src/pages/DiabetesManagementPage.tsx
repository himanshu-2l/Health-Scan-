/**
 * Diabetes Tracking Page
 * Combines all diabetes tracking features
 */

import React from 'react';
import { GlassNavbar } from '@/components/GlassNavbar';
import { SiteFooter } from '@/components/SiteFooter';
import { GlucoseTracker } from '@/components/GlucoseTracker';
import { DiabeticRiskCalculator } from '@/components/DiabeticRiskCalculator';
import { MealPlanner } from '@/components/MealPlanner';
import { InsulinReminder } from '@/components/InsulinReminder';
import { EarlyWarningAlerts } from '@/components/EarlyWarningAlerts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Droplet,
  Shield,
  UtensilsCrossed,
  Pill,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export default function DiabetesManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 flex flex-col">
      <GlassNavbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 flex-1">
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Droplet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Diabetes Tracking
                  <Badge className="bg-purple-600 text-white text-xs ml-2">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI-Powered
                  </Badge>
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Comprehensive glucose tracking, risk assessment, meal planning & smart reminders
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white text-xs px-2 py-1">ABDM Integrated</Badge>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="glucose" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger 
              value="glucose" 
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 data-[state=active]:font-semibold rounded-md py-2.5 text-sm font-medium transition-all text-gray-800 hover:text-gray-900 data-[state=active]:[&>svg]:text-blue-600 [&>svg]:text-gray-700"
            >
              <Droplet className="w-4 h-4" />
              <span className="hidden sm:inline">Glucose</span>
              <span className="sm:hidden">Track</span>
            </TabsTrigger>
            <TabsTrigger 
              value="risk" 
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-700 data-[state=active]:font-semibold rounded-md py-2.5 text-sm font-medium transition-all text-gray-800 hover:text-gray-900 data-[state=active]:[&>svg]:text-green-600 [&>svg]:text-gray-700"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Risk</span>
              <span className="sm:hidden">Risk</span>
            </TabsTrigger>
            <TabsTrigger 
              value="meals" 
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-700 data-[state=active]:font-semibold rounded-md py-2.5 text-sm font-medium transition-all text-gray-800 hover:text-gray-900 data-[state=active]:[&>svg]:text-orange-600 [&>svg]:text-gray-700"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span className="hidden sm:inline">Meals</span>
              <span className="sm:hidden">Meals</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reminders" 
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-700 data-[state=active]:font-semibold rounded-md py-2.5 text-sm font-medium transition-all text-gray-800 hover:text-gray-900 data-[state=active]:[&>svg]:text-purple-600 [&>svg]:text-gray-700"
            >
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">Reminders</span>
              <span className="sm:hidden">Meds</span>
            </TabsTrigger>
            <TabsTrigger 
              value="alerts" 
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-700 data-[state=active]:font-semibold rounded-md py-2.5 text-sm font-medium transition-all text-gray-800 hover:text-gray-900 data-[state=active]:[&>svg]:text-red-600 [&>svg]:text-gray-700"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
              <span className="sm:hidden">Alert</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="glucose" className="mt-0">
            <GlucoseTracker />
          </TabsContent>

          <TabsContent value="risk" className="mt-0">
            <DiabeticRiskCalculator />
          </TabsContent>

          <TabsContent value="meals" className="mt-0">
            <MealPlanner />
          </TabsContent>

          <TabsContent value="reminders" className="mt-0">
            <InsulinReminder />
          </TabsContent>

          <TabsContent value="alerts" className="mt-0">
            <EarlyWarningAlerts />
          </TabsContent>
        </Tabs>
      </div>
      
      <SiteFooter />
    </div>
  );
}
