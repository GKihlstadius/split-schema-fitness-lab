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
    'chest': 'bg-red-100 text-red-800 border-red-200',
    'back': 'bg-blue-100 text-blue-800 border-blue-200',
    'shoulders': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'arms': 'bg-purple-100 text-purple-800 border-purple-200',
    'legs': 'bg-green-100 text-green-800 border-green-200',
    'glutes': 'bg-pink-100 text-pink-800 border-pink-200',
    'abs': 'bg-orange-100 text-orange-800 border-orange-200',
    'core': 'bg-orange-100 text-orange-800 border-orange-200',
    'cardio': 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const getMuscleGroupColor = (muscle: string) => {
    const lowerMuscle = muscle.toLowerCase();
    for (const [key, color] of Object.entries(muscleGroupColors)) {
      if (lowerMuscle.includes(key)) {
        return color;
      }
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Program Header */}
      <div className="mb-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{program.name}</h1>
          <p className="text-lg text-gray-600">{program.goal}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <Badge variant="outline" className="px-3 py-1">
            {program.frequency}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {program.difficulty}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {program.duration}
          </Badge>
        </div>

        <p className="text-gray-700 mb-6 max-w-3xl">{program.description}</p>

        <div className="flex gap-4">
          <Button size="lg" className="bg-red-600 hover:bg-red-700">
            Start This Program
          </Button>
          <Button variant="outline" size="lg">
            Save Program
          </Button>
        </div>
      </div>

      {/* Weekly Split */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">6-Day Training Split</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {program.weeklyPlan.map((day) => (
            <Card key={day.day} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {day.day}
                </CardTitle>
                <div className="flex flex-wrap gap-1">
                  {day.muscleGroups.map((muscle, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className={`text-xs ${getMuscleGroupColor(muscle)}`}
                    >
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">{day.focus}</p>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedDay(
                      expandedDay === day.day ? null : day.day
                    )}
                    className="w-full justify-start text-left p-2 h-auto"
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">
                        {day.exercises.length} Exercises
                      </div>
                      <div className="text-xs text-gray-500">
                        {expandedDay === day.day ? 'Hide' : 'Show'} details
                      </div>
                    </div>
                  </Button>

                  {expandedDay === day.day && (
                    <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                      {day.exercises.map((exercise, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                          <div className="font-medium text-gray-900">
                            {exercise.name}
                          </div>
                          <div className="text-gray-600 text-xs">
                            {exercise.sets} × {exercise.reps}
                            {exercise.notes && (
                              <span className="text-gray-500 ml-2">
                                • {exercise.notes}
                              </span>
                            )}
                          </div>
                          {exercise.tags && (
                            <div className="flex gap-1 mt-1">
                              {exercise.tags.map((tag, tagIdx) => (
                                <Badge
                                  key={tagIdx}
                                  variant="secondary"
                                  className="text-xs px-1 py-0"
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
      <Card className="bg-gray-50 border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Program Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {program.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
