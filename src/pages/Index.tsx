
import React, { useState } from 'react';
import { ProgramSelector } from '@/components/ProgramSelector';
import { ProgramDetail } from '@/components/ProgramDetail';
import { workoutPrograms } from '@/data/workoutPrograms';

const Index = () => {
  const [selectedProgram, setSelectedProgram] = useState(workoutPrograms[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Träningsprogram</h1>
            <p className="text-gray-600">Välj och följ ditt optimala träningsupplägg</p>
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
