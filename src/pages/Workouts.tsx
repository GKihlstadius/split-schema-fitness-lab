import React, { useState, useEffect } from 'react';
import { ProgramSelector } from '@/components/ProgramSelector';
import { ProgramDetail } from '@/components/ProgramDetail';
import { workoutPrograms } from '@/data/workoutPrograms';
import {
  getCurrentUser,
  getUserSetting,
  saveUserSetting,
  saveWorkoutProgram
} from '@/utils/supabaseAuth';
import { Loader2, Dumbbell, Info, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Workouts = () => {
  const [selectedProgram, setSelectedProgram] = useState(workoutPrograms[0]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showInfo, setShowInfo] = useState(false);

  const formatProgramPlan = (program: typeof workoutPrograms[0]) => {
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
      console.error('Kunde inte kopiera:', error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const result = await getCurrentUser();
        if (!result.success || !result.user) return;
        setUser(result.user);
        const savedProgramId = await getUserSetting(result.user.id, 'selectedWorkoutProgram');
        if (savedProgramId) {
          const savedProgram = workoutPrograms.find(program => program.id === savedProgramId);
          if (savedProgram) setSelectedProgram(savedProgram);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleProgramSelect = async (program: typeof workoutPrograms[0]) => {
    setSelectedProgram(program);
    if (user) {
      try {
        await saveUserSetting(user.id, 'selectedWorkoutProgram', program.id);
        await saveWorkoutProgram(user.id, program.id, program.name);
      } catch (error) {
        console.error('Error saving workout program:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Laddar program...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="w-full max-w-screen-sm mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Dumbbell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Träningsprogram</h1>
            <p className="text-xs text-muted-foreground">Välj och utforska program</p>
          </div>
        </div>

        {/* Program Selector */}
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
              className="h-10 w-10 rounded-full border-border bg-card hover:bg-muted"
              aria-label="Visa information"
              onClick={() => setShowInfo(prev => !prev)}
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-border bg-card hover:bg-muted"
              aria-label="Exportera"
              onClick={copyProgramPlan}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Info card */}
        {showInfo && (
          <div className="mb-4 max-w-md mx-auto w-full">
            <div className="rounded-xl border border-border bg-card shadow-sm px-4 py-3 text-sm text-muted-foreground space-y-1">
              <p>{selectedProgram.goal} &middot; {selectedProgram.frequency} &middot; {selectedProgram.difficulty}</p>
              {selectedProgram.focus && <p className="text-foreground">{selectedProgram.focus}</p>}
              {selectedProgram.description && <p>{selectedProgram.description}</p>}
            </div>
          </div>
        )}

        {/* Program Detail */}
        <div className="w-full">
          <ProgramDetail program={selectedProgram} />
        </div>
      </div>
    </div>
  );
};

export default Workouts;
