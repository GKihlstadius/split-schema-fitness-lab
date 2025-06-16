import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutProgram } from '@/types/workout';
import { DayWorkoutView } from '@/components/DayWorkoutView';

interface ProgramDetailProps {
  program: WorkoutProgram;
}

export const ProgramDetail: React.FC<ProgramDetailProps> = ({ program }) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const dayWorkoutRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (selectedDay && dayWorkoutRef.current) {
      dayWorkoutRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedDay]);

  const getMuscleGroupClass = (muscle: string) => {
    const lowerMuscle = muscle.toLowerCase();
    
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

  // Find the selected day plan
  const selectedDayPlan = program.weeklyPlan.find(day => day.day === selectedDay);

  return (
    <div className="max-w-5xl">
      {/* Program Header */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-primary mb-3">{program.name}</h2>
          <p className="text-muted-foreground font-light text-lg">{program.goal}</p>
        </div>
        
        <div className="flex gap-3 mb-8">
          <Badge variant="outline" className="px-3 py-1 border-border text-muted-foreground font-light">
            {program.frequency}
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-border text-muted-foreground font-light">
            {program.difficulty}
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-border text-muted-foreground font-light">
            {program.duration}
          </Badge>
        </div>

        <p className="text-foreground mb-8 max-w-2xl font-light leading-relaxed">{program.description}</p>
      </div>

      {/* Weekly Split */}
      <div className="mb-12">
        <h3 className="text-xl font-light text-primary mb-6">Veckoschema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {program.weeklyPlan.map((day) => (
            <Card 
              key={day.day} 
              className={`border-border shadow-none hover:shadow-sm transition-shadow cursor-pointer ${
                selectedDay === day.day ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-light text-foreground">
                  {day.day}
                </CardTitle>
                <div className="flex flex-wrap gap-1">
                  {day.muscleGroups.map((muscle, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className={`text-xs font-light border-0 ${getMuscleGroupClass(muscle)}`}
                    >
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground font-light mb-4">{day.focus}</p>
                  
                  <div className="text-left">
                    <div className="text-sm text-foreground font-light">
                      {day.exercises.length} övningar
                    </div>
                    <div className="text-xs text-muted-foreground font-light">
                      Klicka för att {selectedDay === day.day ? 'dölja' : 'visa'} detaljer
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Day Workout View */}
      {selectedDayPlan && (
        <div className="mb-12" ref={dayWorkoutRef}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-light text-primary">Övningar för {selectedDayPlan.day}</h3>
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedDay(null)}
            >
              Stäng
            </Button>
          </div>
          <Card className="border-border shadow-none">
            <CardContent className="pt-6">
              <DayWorkoutView dayPlan={selectedDayPlan} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Program Benefits */}
      <Card className="bg-secondary border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-light text-primary">
            Fördelar med programmet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {program.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-1 h-1 bg-primary rounded-full mt-3 flex-shrink-0" />
                <p className="text-foreground font-light">{benefit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
