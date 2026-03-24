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
    
    // Skapa nya övningar genom att bara byta namn, behåll sets/reps från originalet
    const newExercises: WorkoutExercise[] = dayPlan.exercises.map(originalExercise => {
      // Skippa vila-övningar
      if (originalExercise.tags?.includes('Rest')) {
        return originalExercise;
      }
      
      // Hitta muskelgrupp för denna övning
      const muscleGroup = originalExercise.tags?.[0];
      if (!muscleGroup) {
        return originalExercise; // Behåll originalet om ingen muskelgrupp finns
      }
      
      // Hämta en slumpmässig övning för samma muskelgrupp
      const randomExercises = getRandomExercises(muscleGroup, 1);
      if (randomExercises.length === 0) {
        return originalExercise; // Behåll originalet om inga alternativ finns
      }
      
      // Returnera övning med nytt namn men ursprungliga sets/reps/tags/notes
      return {
        ...originalExercise,
        name: randomExercises[0].name
      };
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
        <TooltipContent className="bg-card border-border text-foreground">
          <p>Slumpa nya övningar för {dayPlan.day}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 