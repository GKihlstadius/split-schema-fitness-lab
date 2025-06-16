import React, { useState } from 'react';
import { ProgramSelector } from '@/components/ProgramSelector';
import { ProgramDetail } from '@/components/ProgramDetail';
import { Header } from '@/components/Header';
import { workoutPrograms } from '@/data/workoutPrograms';

const Index = () => {
  const [selectedProgram, setSelectedProgram] = useState(workoutPrograms[0]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-end mb-8">
          <ProgramSelector 
            programs={workoutPrograms}
            selectedProgram={selectedProgram}
            onSelectProgram={setSelectedProgram}
          />
        </div>
        <ProgramDetail program={selectedProgram} />
      </div>
    </div>
  );
};

export default Index;
