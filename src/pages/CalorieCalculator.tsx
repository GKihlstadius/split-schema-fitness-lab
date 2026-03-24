import React from 'react';
import { Flame } from 'lucide-react';
import { CalorieCalculator } from '@/components/CalorieCalculator';

const CalorieCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex flex-col items-center px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <Flame className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Kaloriräknare</h1>
        </div>
        <p className="text-center text-muted-foreground mb-8 max-w-lg">
          Baserad på Alex Hormozis enkla men effektiva metod. Ange din vikt, ditt mål och antal måltider för att få en personlig plan.
        </p>
        <div className="flex justify-center w-full">
          <CalorieCalculator />
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculatorPage; 