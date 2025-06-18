import React from 'react';
import { Navbar } from '@/components/Navbar';
import { SimplifiedMealPlanner } from '@/components/SimplifiedMealPlanner';

const NutritionHub = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-7xl">
          <SimplifiedMealPlanner />
        </div>
      </div>
    </div>
  );
};

export default NutritionHub; 