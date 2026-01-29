/**
 * Government Banner Component
 * Displays Indian government health mission banners and slogans
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Heart, Activity, CheckCircle } from 'lucide-react';

export const GovernmentBanner: React.FC = () => {
  const missions = [
    {
      name: 'Ayushman Bharat',
      slogan: 'स्वस्थ भारत, समृद्ध भारत',
      english: 'Healthy India, Prosperous India',
      color: 'bg-blue-600',
      icon: Heart,
    },
    {
      name: 'ABDM',
      slogan: 'Digital Health for All',
      english: 'Ayushman Bharat Digital Mission',
      color: 'bg-green-600',
      icon: Shield,
    },
    {
      name: 'Swachh Bharat',
      slogan: 'एक कदम स्वच्छता की ओर',
      english: 'One Step Towards Cleanliness',
      color: 'bg-orange-500',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-green-50 via-white to-blue-50 shadow-sm pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Main Slogan */}
          <div className="text-center max-w-4xl">
            <p className="text-xl md:text-2xl font-bold text-blue-900 leading-relaxed">
              "Health does not simply mean freedom from diseases. A healthy life is everyone's right."
            </p>
            <p className="text-sm md:text-base text-gray-600 mt-3">
              - Prime Minister of India
            </p>
          </div>

          {/* Mission Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            {missions.map((mission, index) => {
              const Icon = mission.icon;
              return (
                <div
                  key={index}
                  className={`${mission.color} text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{mission.name}</span>
                    <span className="text-xs opacity-90">{mission.english}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

