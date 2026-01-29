import React from 'react';
import { GlassNavbar } from '@/components/GlassNavbar';
import { SiteFooter } from '@/components/SiteFooter';
import HardwareDataDisplay from '@/components/HardwareDataDisplay';

const HardwareIntegration: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 flex flex-col">
      <GlassNavbar />
      
      <div className="pt-24 flex-1">
        <HardwareDataDisplay />
      </div>
      <SiteFooter />
    </div>
  );
};

export default HardwareIntegration;
