import React from 'react';
import { Utensils } from 'lucide-react';
import { SimplifiedMealPlanner } from '@/components/SimplifiedMealPlanner';

const NutritionHub = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-7xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-emerald-50">
              <Utensils className="h-6 w-6 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Näring</h1>
          </div>
          <SimplifiedMealPlanner />
        </div>
      </div>
    </div>
  );
};

export default NutritionHub; 