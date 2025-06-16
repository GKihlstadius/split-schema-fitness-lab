import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { DayPlan, Exercise } from '@/types/workout';
import { RandomExerciseGenerator } from './RandomExerciseGenerator';

interface DayWorkoutViewProps {
  dayPlan: DayPlan;
}

export function DayWorkoutView({ dayPlan }: DayWorkoutViewProps) {
  const [exercises, setExercises] = useState<Exercise[]>(dayPlan.exercises);
  
  useEffect(() => {
    setExercises(dayPlan.exercises);
  }, [dayPlan.day]);
  
  const handleApplyRandomExercises = (randomExercises: Exercise[]) => {
    setExercises(randomExercises);
  };
  
  const getMuscleGroupClass = (muscleGroup: string) => {
    const lowerMuscle = muscleGroup.toLowerCase();
    
    if (lowerMuscle.includes('chest')) return 'muscle-badge-chest';
    if (lowerMuscle.includes('back')) return 'muscle-badge-back';
    if (lowerMuscle.includes('shoulder')) return 'muscle-badge-shoulders';
    if (lowerMuscle.includes('bicep')) return 'muscle-badge-biceps';
    if (lowerMuscle.includes('tricep')) return 'muscle-badge-triceps';
    if (lowerMuscle.includes('leg')) return 'muscle-badge-legs';
    if (lowerMuscle.includes('quad')) return 'muscle-badge-quads';
    if (lowerMuscle.includes('hamstring')) return 'muscle-badge-hamstrings';
    if (lowerMuscle.includes('glute')) return 'muscle-badge-glutes';
    if (lowerMuscle.includes('calf') || lowerMuscle.includes('calves')) return 'muscle-badge-calves';
    if (lowerMuscle.includes('forearm')) return 'muscle-badge-forearms';
    if (lowerMuscle.includes('core') || lowerMuscle.includes('abs')) return 'muscle-badge-core';
    if (lowerMuscle.includes('rest')) return 'muscle-badge-rest';
    
    return 'bg-secondary text-secondary-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Visa övningar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Dagens övningar</h3>
          
          {/* Slumpa övningar */}
          <RandomExerciseGenerator 
            dayPlan={{...dayPlan, exercises}} 
            onApplyRandomExercises={handleApplyRandomExercises}
          />
        </div>
        
        {exercises.map((exercise, index) => (
          <div key={index} className="border-b border-border pb-5 last:border-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-light">
                  {index + 1}
                </div>
                <h4 className="text-lg font-light text-foreground">{exercise.name}</h4>
              </div>
              <div className="text-sm font-light text-muted-foreground">
                {exercise.sets} sets × {exercise.reps}
              </div>
            </div>
            
            {exercise.tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {exercise.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} className={`${getMuscleGroupClass(tag)} border-0 font-light`}>
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {exercise.notes && (
              <div className="mt-3 text-sm text-muted-foreground font-light">
                <span className="font-medium">Anteckningar:</span> {exercise.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 