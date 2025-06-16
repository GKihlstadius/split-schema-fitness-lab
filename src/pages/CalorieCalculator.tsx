import React from 'react';
import { CalorieCalculator } from '@/components/CalorieCalculator';
import { Navbar } from '@/components/Navbar';

const CalorieCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Kaloriräknare</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-lg mx-auto">
          Baserad på Alex Hormozis enkla men effektiva metod. Ange din vikt, ditt mål och antal måltider för att få en personlig plan.
        </p>
        <CalorieCalculator />
      </main>
    </div>
  );
};

export default CalorieCalculatorPage; 