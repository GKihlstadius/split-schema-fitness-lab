
import React, { useState } from 'react';
import { WorkoutSidebar } from '@/components/WorkoutSidebar';
import { ProgramDetail } from '@/components/ProgramDetail';
import { workoutPrograms } from '@/data/workoutPrograms';

const Index = () => {
  const [selectedProgram, setSelectedProgram] = useState(workoutPrograms[0]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <WorkoutSidebar 
        programs={workoutPrograms}
        selectedProgram={selectedProgram}
        onSelectProgram={setSelectedProgram}
      />
      <div className="flex-1 lg:ml-80">
        <ProgramDetail program={selectedProgram} />
      </div>
    </div>
  );
};

export default Index;
