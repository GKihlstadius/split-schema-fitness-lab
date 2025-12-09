import React, { useState, useEffect } from 'react';
import { useMemo, useState, useEffect } from 'react';
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
import { Loader2, Dumbbell, TreePine, Info, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const formatProgramPlan = useMemo(() => {
    return (program: typeof workoutPrograms[0]) => {
      const lines: string[] = [
        `Program: ${program.name}`,
        `Mål: ${program.goal}`,
        `Frekvens: ${program.frequency}`,
        `Svårighetsgrad: ${program.difficulty}`,
        `Fokus: ${program.focus}`,
        `Längd: ${program.duration}`,
        '',
        'Veckoplanering:'
      ];

      program.weeklyPlan.forEach((dayPlan) => {
        lines.push(
          `${dayPlan.day} — ${dayPlan.focus}`,
          `Muskelgrupper: ${dayPlan.muscleGroups.join(', ')}`,
          'Övningar:'
        );

        dayPlan.exercises.forEach((exercise, idx) => {
          const tags = exercise.tags?.length ? ` [${exercise.tags.join(', ')}]` : '';
          const rest = exercise.rest ? ` | Vila: ${exercise.rest}` : '';
          const notes = exercise.notes ? ` | Anteckning: ${exercise.notes}` : '';
          lines.push(
            `${idx + 1}. ${exercise.name} — ${exercise.sets} set × ${exercise.reps}${rest}${tags}${notes}`
          );
        });

        lines.push('');
      });

      return lines.join('\n');
    };
  }, []);

  const copyProgramPlan = async () => {
    const text = formatProgramPlan(selectedProgram);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch (error) {
      console.error('Kunde inte kopiera träningsschema:', error);
    }
  };

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
        
        {/* Top row: centrerad dropdown + info/export ikoner */}
        <div className="mb-4 w-full flex justify-center">
          <div className="max-w-md w-full flex items-center gap-2">
            <div className="flex-1">
              <ProgramSelector 
                programs={workoutPrograms}
                selectedProgram={selectedProgram}
                onSelectProgram={handleProgramSelect}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-border"
              aria-label="Visa information om programmet"
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-border"
              aria-label="Exportera schema"
              onClick={copyProgramPlan}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
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
