import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { workoutPrograms } from '@/data/workoutPrograms';
import { ArrowLeft, Dumbbell, RefreshCcw } from 'lucide-react';
import { Exercise } from '@/types/workout';

const WorkoutDetails = () => {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    // Hitta träningsdagen baserat på URL-parametern
    if (!day) return;
    
    // Sök igenom alla program för att hitta den specifika dagen
    for (const program of workoutPrograms) {
      const foundDay = program.weeklyPlan.find(d => d.day === day);
      if (foundDay) {
        setExercises(foundDay.exercises);
        break;
      }
    }
  }, [day]);

  // Funktion för att generera nya slumpmässiga övningar
  const regenerateExercises = () => {
    if (!day) return;
    
    // Hitta programmet och dagen
    for (const program of workoutPrograms) {
      const foundDayIndex = program.weeklyPlan.findIndex(d => d.day === day);
      if (foundDayIndex >= 0) {
        const foundDay = program.weeklyPlan[foundDayIndex];
        
        // Uppdatera övningar med slumpmässiga alternativ
        const updatedExercises = foundDay.exercises.map(exercise => {
          if (exercise.alternatives && exercise.alternatives.length > 0) {
            const randomIndex = Math.floor(Math.random() * exercise.alternatives.length);
            return {
              ...exercise,
              name: exercise.alternatives[randomIndex]
            };
          }
          return exercise;
        });
        
        setExercises(updatedExercises);
        break;
      }
    }
  };

  // Hitta dagens namn
  const getDayName = () => {
    if (!day) return 'Träningsdag';
    
    for (const program of workoutPrograms) {
      const foundDay = program.weeklyPlan.find(d => d.day === day);
      if (foundDay) {
        return foundDay.day;
      }
    }
    
    return 'Träningsdag';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/workout')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">{getDayName()}</h1>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={regenerateExercises}
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Slumpa övningar</span>
          </Button>
        </div>
        
        <div className="space-y-6">
          {exercises.map((exercise, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{exercise.name}</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-muted-foreground mb-1">Set</div>
                  <div className="font-medium text-foreground">{exercise.sets}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-muted-foreground mb-1">Reps</div>
                  <div className="font-medium text-foreground">{exercise.reps}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-muted-foreground mb-1">Vila</div>
                  <div className="font-medium text-foreground">{exercise.notes || '-'}</div>
                </div>
              </div>
            </div>
          ))}
          
          {exercises.length === 0 && (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
              <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Inga övningar hittades</h3>
              <p className="text-muted-foreground">Det finns inga övningar för denna dag.</p>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetails; 