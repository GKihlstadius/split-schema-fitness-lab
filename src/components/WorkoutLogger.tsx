import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Plus, Save } from 'lucide-react';
import { supabase, WorkoutLog } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Exercise } from '@/types/workout';

interface WorkoutLoggerProps {
  programName: string;
  day: string;
  exercises: Exercise[];
}

interface ExerciseLog {
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
}

export function WorkoutLogger({ programName, day, exercises }: WorkoutLoggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initiera loggdata för alla övningar
  useEffect(() => {
    const initialLogs = exercises.map(exercise => ({
      exercise_name: exercise.name,
      sets: 0,
      reps: 0,
      weight: 0
    }));
    setExerciseLogs(initialLogs);
  }, [exercises]);

  const updateExerciseLog = (index: number, field: keyof ExerciseLog, value: number) => {
    setExerciseLogs(prev => prev.map((log, i) => 
      i === index ? { ...log, [field]: value } : log
    ));
  };

  const saveWorkoutLog = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Fel",
          description: "Du måste vara inloggad för att spara träningslogg",
          variant: "destructive"
        });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Förbered data för att spara
      const logsToSave = exerciseLogs
        .filter(log => log.sets > 0 || log.reps > 0 || log.weight > 0)
        .map(log => ({
          user_id: user.id,
          program_name: programName,
          day: day,
          exercise_name: log.exercise_name,
          sets: log.sets,
          reps: log.reps,
          weight: log.weight,
          date: today
        }));

      if (logsToSave.length === 0) {
        toast({
          title: "Inget att spara",
          description: "Fyll i minst en övning för att spara",
          variant: "destructive"
        });
        return;
      }

      // Ta bort befintliga loggar för samma dag och program
      await supabase
        .from('workout_logs')
        .delete()
        .eq('user_id', user.id)
        .eq('program_name', programName)
        .eq('day', day)
        .eq('date', today);

      // Spara nya loggar
      const { error } = await supabase
        .from('workout_logs')
        .insert(logsToSave);

      if (error) throw error;

      toast({
        title: "Träningslogg sparad!",
        description: `${logsToSave.length} övningar loggade för ${day}`,
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Error saving workout log:', error);
      toast({
        title: "Fel vid sparande",
        description: "Kunde inte spara träningsloggen",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Loggbok
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Träningslogg - {day}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Logga dina reps och vikt för varje övning. Data sparas automatiskt med dagens datum.
          </p>
          
          {exercises.map((exercise, index) => (
            <Card key={exercise.name} className="border border-border">
                             <CardHeader className="pb-3">
                 <CardTitle className="text-base">{exercise.name}</CardTitle>
                 <p className="text-sm text-muted-foreground">
                   Rekommenderat: {exercise.sets} set × {exercise.reps} reps
                 </p>
                 {exercise.tags && exercise.tags.length > 0 && (
                   <div className="flex flex-wrap gap-1 mt-2">
                     {exercise.tags.map((tag, tagIndex) => (
                       <span key={tagIndex} className="text-xs px-2 py-1 bg-muted rounded-md">
                         {tag}
                       </span>
                     ))}
                   </div>
                 )}
               </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor={`sets-${index}`} className="text-xs">Set</Label>
                  <Input
                    id={`sets-${index}`}
                    type="number"
                    placeholder="0"
                    min="0"
                    value={exerciseLogs[index]?.sets || ''}
                    onChange={(e) => updateExerciseLog(index, 'sets', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor={`reps-${index}`} className="text-xs">Reps</Label>
                  <Input
                    id={`reps-${index}`}
                    type="number"
                    placeholder="0"
                    min="0"
                    value={exerciseLogs[index]?.reps || ''}
                    onChange={(e) => updateExerciseLog(index, 'reps', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor={`weight-${index}`} className="text-xs">Vikt (kg)</Label>
                  <Input
                    id={`weight-${index}`}
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.5"
                    value={exerciseLogs[index]?.weight || ''}
                    onChange={(e) => updateExerciseLog(index, 'weight', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Avbryt
            </Button>
            <Button 
              onClick={saveWorkoutLog}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Sparar...' : 'Spara logg'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 