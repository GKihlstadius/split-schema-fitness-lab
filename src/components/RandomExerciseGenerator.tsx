import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DayPlan, Exercise as WorkoutExercise } from '@/types/workout';
import { getRandomExercises } from '@/data/exerciseDatabase';
import { Shuffle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RandomExerciseGeneratorProps {
  dayPlan: DayPlan;
  onApplyRandomExercises: (exercises: WorkoutExercise[]) => void;
}

export function RandomExerciseGenerator({ dayPlan, onApplyRandomExercises }: RandomExerciseGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateAndApplyRandomExercises = () => {
    setIsGenerating(true);
    
    // Skapa nya övningar baserat på muskelgrupperna i dayPlan
    const newExercises: WorkoutExercise[] = [];
    
    // För varje muskelgrupp i dagens pass, generera en eller flera övningar
    dayPlan.muscleGroups.forEach(muscleGroup => {
      if (muscleGroup === 'Rest') return; // Skippa vila
      
      // Beräkna hur många övningar som behövs för denna muskelgrupp
      // Baserat på hur många övningar som finns i det ursprungliga passet
      const originalExercisesForMuscle = dayPlan.exercises.filter(ex => 
        ex.tags?.includes(muscleGroup)
      ).length;
      
      // Minst 1 övning per muskelgrupp, eller samma antal som i originalet
      const exerciseCount = Math.max(1, originalExercisesForMuscle);
      
      // Hämta slumpmässiga övningar för denna muskelgrupp
      const randomExercisesForMuscle = getRandomExercises(muscleGroup, exerciseCount);
      
      // Lägg till övningarna i resultatlistan
      randomExercisesForMuscle.forEach(randomEx => {
        newExercises.push({
          name: randomEx.name,
          sets: '3-4', // Standard sets
          reps: randomEx.difficulty === 'beginner' ? '12-15' : '8-12', // Anpassa reps efter svårighetsgrad
          tags: [muscleGroup]
        });
      });
    });
    
    // Applicera övningarna direkt
    onApplyRandomExercises(newExercises);
    setIsGenerating(false);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={generateAndApplyRandomExercises}
            disabled={isGenerating}
          >
            <Shuffle className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Slumpa nya övningar för {dayPlan.day}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 