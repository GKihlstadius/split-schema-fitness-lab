import React from 'react';
import { Navbar } from '@/components/Navbar';
import { SimplifiedMealPlanner } from '@/components/SimplifiedMealPlanner';

const NutritionHub = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SimplifiedMealPlanner />
      </div>
    </div>
  );
};

export default NutritionHub; 