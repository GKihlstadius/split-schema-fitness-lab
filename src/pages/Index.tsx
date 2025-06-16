
import React, { useState } from 'react';
import { ProgramSelector } from '@/components/ProgramSelector';
import { ProgramDetail } from '@/components/ProgramDetail';
import { workoutPrograms } from '@/data/workoutPrograms';

const Index = () => {
  const [selectedProgram, setSelectedProgram] = useState(workoutPrograms[0]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-start mb-16">
          <div className="flex-1">
            <h1 className="text-2xl font-light text-gray-900 mb-2">Träning</h1>
            <p className="text-gray-500 font-light">Välj ditt program</p>
          </div>
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
