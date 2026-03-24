import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { workoutPrograms } from '@/data/workoutPrograms';
import { ArrowLeft, Dumbbell, RefreshCcw } from 'lucide-react';
import { Exercise, WorkoutProgram } from '@/types/workout';
import { getCurrentUser, getUserSetting } from '@/utils/supabaseAuth';

const WorkoutDetails = () => {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [dayFocus, setDayFocus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!day) return;

    const loadExercises = async () => {
      let program: WorkoutProgram = workoutPrograms[0];

      // Try to load the user's selected program
      try {
        const result = await getCurrentUser();
        if (result.success && result.user) {
          const savedProgramId = await getUserSetting(result.user.id, 'selectedWorkoutProgram');
          if (savedProgramId) {
            const found = workoutPrograms.find(p => p.id === savedProgramId);
            if (found) program = found;
          }
        }
      } catch {
        // Fall back to first program
      }

      const foundDay = program.weeklyPlan.find(d => d.day === day);
      if (foundDay) {
        setExercises(foundDay.exercises);
        setDayFocus(foundDay.focus);
      }
      setLoading(false);
    };

    loadExercises();
  }, [day]);

  const regenerateExercises = () => {
    setExercises(prev =>
      prev.map(exercise => {
        if (exercise.alternatives && exercise.alternatives.length > 0) {
          const idx = Math.floor(Math.random() * exercise.alternatives.length);
          return { ...exercise, name: exercise.alternatives[idx] };
        }
        return exercise;
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <Dumbbell className="h-8 w-8 text-gray-300" />
          <p className="text-muted-foreground text-sm">Laddar övningar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="w-full max-w-screen-sm mx-auto px-5 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-border h-10 w-10"
              onClick={() => navigate('/workouts')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{day}</h1>
              {dayFocus && <p className="text-xs text-muted-foreground">{dayFocus}</p>}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-border text-sm"
            onClick={regenerateExercises}
          >
            <RefreshCcw className="h-3.5 w-3.5 mr-1.5" />
            Slumpa
          </Button>
        </div>

        {/* Exercises */}
        <div className="space-y-3">
          {exercises.map((exercise, index) => (
            <div key={index} className="bg-card border border-border rounded-2xl shadow-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-base font-semibold text-foreground">{exercise.name}</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-muted rounded-xl p-2.5">
                  <div className="text-[10px] text-muted-foreground mb-0.5">Set</div>
                  <div className="text-sm font-semibold text-foreground">{exercise.sets}</div>
                </div>
                <div className="bg-muted rounded-xl p-2.5">
                  <div className="text-[10px] text-muted-foreground mb-0.5">Reps</div>
                  <div className="text-sm font-semibold text-foreground">{exercise.reps}</div>
                </div>
                <div className="bg-muted rounded-xl p-2.5">
                  <div className="text-[10px] text-muted-foreground mb-0.5">Vila</div>
                  <div className="text-sm font-semibold text-foreground">{exercise.rest || '-'}</div>
                </div>
              </div>
            </div>
          ))}

          {exercises.length === 0 && (
            <div className="text-center py-16 bg-card border border-border rounded-2xl shadow-sm">
              <Dumbbell className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-medium text-foreground mb-1">Inga övningar hittades</h3>
              <p className="text-sm text-muted-foreground">Det finns inga övningar för denna dag.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetails;
