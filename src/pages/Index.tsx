import React, { useState, useEffect } from 'react';
import { ProgramSelector } from '@/components/ProgramSelector';
import { ProgramDetail } from '@/components/ProgramDetail';
import { workoutPrograms } from '@/data/workoutPrograms';
import { Navbar } from '@/components/Navbar';
import { 
  getCurrentUser, 
  getUserSetting, 
  saveUserSetting,
  saveWorkoutProgram
} from '@/utils/supabaseAuth';
import { Loader2, Dumbbell, TreePine } from 'lucide-react';

const Index = () => {
  const [selectedProgram, setSelectedProgram] = useState(workoutPrograms[0]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Ladda användardata och sparat träningsprogram
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const result = await getCurrentUser();
        if (!result.success || !result.user) return;
        
        setUser(result.user);

        // Ladda sparat träningsprogram
        const savedProgramId = await getUserSetting(result.user.id, 'selectedWorkoutProgram');
        if (savedProgramId) {
          const savedProgram = workoutPrograms.find(program => program.id === savedProgramId);
          if (savedProgram) {
            setSelectedProgram(savedProgram);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Hantera programval och spara automatiskt
  const handleProgramSelect = async (program: typeof workoutPrograms[0]) => {
    setSelectedProgram(program);
    
    if (user) {
      try {
        // Spara inställning
        await saveUserSetting(user.id, 'selectedWorkoutProgram', program.id);
        
        // Spara även som aktivt träningsprogram
        await saveWorkoutProgram(user.id, program.id, program.name);
      } catch (error) {
        console.error('Error saving workout program:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Laddar träningsprogram...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="w-full max-w-screen-sm mx-auto px-4 py-8 sm:px-6">
        {/* Centrerad logo ovanför allt */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <Dumbbell className="h-14 w-14 text-primary" />
            <TreePine className="h-14 w-14 text-green-600" aria-label="Julgran" />
          </div>
        </div>
        
        {/* Centrerad programväljare */}
        <div className="mb-6">
          <ProgramSelector 
            programs={workoutPrograms}
            selectedProgram={selectedProgram}
            onSelectProgram={handleProgramSelect}
          />
        </div>
        
        {/* Centrerat träningsprogram */}
        <div className="w-full">
          <ProgramDetail program={selectedProgram} />
        </div>
      </div>
    </div>
  );
};

export default Index;
