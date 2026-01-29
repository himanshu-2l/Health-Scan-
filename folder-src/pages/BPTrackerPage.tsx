/**
 * BP Tracker Page
 * Dedicated full-page view for Blood Pressure tracking
 */

import React from 'react';
import { GlassNavbar } from '@/components/GlassNavbar';
import { SiteFooter } from '@/components/SiteFooter';
import { BPTracker } from '@/components/BPTracker';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity } from 'lucide-react';

export default function BPTrackerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <GlassNavbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 flex-1">
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Smart BP Tracker
                  <Badge className="bg-red-600 text-white text-xs ml-2">
                    <Activity className="w-3 h-3 mr-1" />
                    Real-time
                  </Badge>
                </h1>
                <p className="text-sm text-gray-700 mt-1">
                  Monitor blood pressure with visual trends, automatic alerts & detailed analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white text-xs px-2 py-1">ABDM Integrated</Badge>
            </div>
          </div>
        </div>

        {/* BP Tracker Component */}
        <BPTracker />
      </div>
      
      <SiteFooter />
    </div>
  );
}

