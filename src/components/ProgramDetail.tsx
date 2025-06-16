
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutProgram } from '@/types/workout';

interface ProgramDetailProps {
  program: WorkoutProgram;
}

export const ProgramDetail: React.FC<ProgramDetailProps> = ({ program }) => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const muscleGroupColors: Record<string, string> = {
    'chest': 'bg-gray-50 text-gray-700',
    'back': 'bg-gray-50 text-gray-700',
    'shoulders': 'bg-gray-50 text-gray-700',
    'arms': 'bg-gray-50 text-gray-700',
    'legs': 'bg-gray-50 text-gray-700',
    'glutes': 'bg-gray-50 text-gray-700',
    'abs': 'bg-gray-50 text-gray-700',
    'core': 'bg-gray-50 text-gray-700',
    'cardio': 'bg-gray-50 text-gray-700',
  };

  const getMuscleGroupColor = (muscle: string) => {
    const lowerMuscle = muscle.toLowerCase();
    for (const [key, color] of Object.entries(muscleGroupColors)) {
      if (lowerMuscle.includes(key)) {
        return color;
      }
    }
    return 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="max-w-5xl">
      {/* Program Header */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-gray-900 mb-3">{program.name}</h2>
          <p className="text-gray-500 font-light text-lg">{program.goal}</p>
        </div>
        
        <div className="flex gap-3 mb-8">
          <Badge variant="outline" className="px-3 py-1 border-gray-200 text-gray-600 font-light">
            {program.frequency}
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-gray-200 text-gray-600 font-light">
            {program.difficulty}
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-gray-200 text-gray-600 font-light">
            {program.duration}
          </Badge>
        </div>

        <p className="text-gray-600 mb-8 max-w-2xl font-light leading-relaxed">{program.description}</p>

        <div className="flex gap-4">
          <Button className="bg-gray-900 hover:bg-gray-800 text-white font-light px-6 py-2">
            Starta program
          </Button>
          <Button variant="outline" className="border-gray-200 text-gray-600 font-light px-6 py-2">
            Spara program
          </Button>
        </div>
      </div>

      {/* Weekly Split */}
      <div className="mb-12">        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {program.weeklyPlan.map((day) => (
            <Card key={day.day} className="border-gray-100 shadow-none hover:shadow-sm transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-light text-gray-900">
                  {day.day}
                </CardTitle>
                <div className="flex flex-wrap gap-1">
                  {day.muscleGroups.map((muscle, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className={`text-xs font-light border-0 ${getMuscleGroupColor(muscle)}`}
                    >
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 font-light mb-4">{day.focus}</p>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedDay(
                      expandedDay === day.day ? null : day.day
                    )}
                    className="w-full justify-start text-left p-0 h-auto hover:bg-transparent"
                  >
                    <div className="text-left">
                      <div className="text-sm text-gray-600 font-light">
                        {day.exercises.length} övningar
                      </div>
                      <div className="text-xs text-gray-400 font-light">
                        {expandedDay === day.day ? 'Dölj' : 'Visa'} detaljer
                      </div>
                    </div>
                  </Button>

                  {expandedDay === day.day && (
                    <div className="space-y-3 mt-4 pt-4 border-t border-gray-50">
                      {day.exercises.map((exercise, idx) => (
                        <div key={idx} className="p-3 bg-gray-25 rounded text-sm">
                          <div className="font-light text-gray-900 mb-1">
                            {exercise.name}
                          </div>
                          <div className="text-gray-500 text-xs font-light">
                            {exercise.sets} × {exercise.reps}
                            {exercise.notes && (
                              <span className="text-gray-400 ml-2">
                                {exercise.notes}
                              </span>
                            )}
                          </div>
                          {exercise.tags && (
                            <div className="flex gap-1 mt-2">
                              {exercise.tags.map((tag, tagIdx) => (
                                <Badge
                                  key={tagIdx}
                                  variant="secondary"
                                  className="text-xs px-2 py-0 bg-gray-50 text-gray-600 border-0 font-light"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Program Benefits */}
      <Card className="bg-gray-25 border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-light text-gray-900">
            Fördelar med programmet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {program.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-3 flex-shrink-0" />
                <p className="text-gray-600 font-light">{benefit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
