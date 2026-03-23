import React from 'react';
import { CalorieCalculator } from '@/components/CalorieCalculator';

const CalorieCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex flex-col items-center px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Kaloriräknare</h1>
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