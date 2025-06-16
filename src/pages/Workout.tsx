import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProgramSelector } from '@/components/ProgramSelector';
import { ProgramDetail } from '@/components/ProgramDetail';
import { workoutPrograms } from '@/data/workoutPrograms';
import { Navbar } from '@/components/Navbar';
import { saveSelectedWorkoutProgram, loadSelectedWorkoutProgram } from '@/utils/localStorage';

const Workout = () => {
  const [selectedProgram, setSelectedProgram] = useState(workoutPrograms[0]);

  // Ladda sparat träningsprogram vid start
  useEffect(() => {
    const savedProgramId = loadSelectedWorkoutProgram();
    if (savedProgramId) {
      const savedProgram = workoutPrograms.find(program => program.id === savedProgramId);
      if (savedProgram) {
        setSelectedProgram(savedProgram);
      }
    }
  }, []);

  // Hantera programval och spara automatiskt
  const handleProgramSelect = (program: typeof workoutPrograms[0]) => {
    setSelectedProgram(program);
    saveSelectedWorkoutProgram(program.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Träningsprogram</h1>
        <div className="flex justify-end mb-8">
          <ProgramSelector 
            programs={workoutPrograms}
            selectedProgram={selectedProgram}
            onSelectProgram={handleProgramSelect}
          />
        </div>
        <ProgramDetail program={selectedProgram} />
      </div>
    </div>
  );
};

export default Workout; 