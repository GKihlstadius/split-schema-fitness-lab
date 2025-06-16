import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProgramSelector } from '@/components/ProgramSelector';
import { ProgramDetail } from '@/components/ProgramDetail';
import { workoutPrograms } from '@/data/workoutPrograms';
import { Navbar } from '@/components/Navbar';

const Workout = () => {
  const [selectedProgram, setSelectedProgram] = useState(workoutPrograms[0]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Träningsprogram</h1>
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

export default Workout; 