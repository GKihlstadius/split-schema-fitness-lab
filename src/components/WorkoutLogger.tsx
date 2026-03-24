import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
// Card imports removed - using dark-themed divs instead
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Save, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  // Ladda befintliga loggar för valt datum
  const loadExistingLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let existingLogs: any[] = [];

      if (user) {
        try {
          // Försök ladda från Supabase först
          const { data } = await supabase
            .from('workout_logs')
            .select('*')
            .eq('user_id', user.id)
            .eq('program_name', programName)
            .eq('day', day)
            .eq('date', selectedDate);
          
          existingLogs = data || [];
        } catch (supabaseError) {
          // Supabase load failed, fall back to localStorage
        }
      }

      // Backup: Försök ladda från localStorage om Supabase misslyckades eller användaren inte är inloggad
      if (existingLogs.length === 0) {
        const storageKey = `workout_logs_${user?.id || 'local'}_${programName}_${day}_${selectedDate}`;
        const localData = localStorage.getItem(storageKey);
        if (localData) {
          existingLogs = JSON.parse(localData);
        }
      }

      // Skapa initial data för alla övningar
      const initialLogs = exercises.map(exercise => {
        const existingLog = existingLogs?.find(log => log.exercise_name === exercise.name);
        return {
          exercise_name: exercise.name,
          sets: existingLog?.sets || 0,
          reps: existingLog?.reps || 0,
          weight: existingLog?.weight || 0
        };
      });
      
      setExerciseLogs(initialLogs);
    } catch (error) {
      console.error('Error loading existing logs:', error);
      // Fallback till tom data
      const initialLogs = exercises.map(exercise => ({
        exercise_name: exercise.name,
        sets: 0,
        reps: 0,
        weight: 0
      }));
      setExerciseLogs(initialLogs);
    }
  };

  // Initiera/uppdatera loggdata när övningar eller datum ändras
  useEffect(() => {
    loadExistingLogs();
  }, [exercises, selectedDate, programName, day]);

  const updateExerciseLog = (index: number, field: keyof ExerciseLog, value: number) => {
    setExerciseLogs(prev => prev.map((log, i) => 
      i === index ? { ...log, [field]: value } : log
    ));
  };

  const saveWorkoutLog = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Förbered data för att spara med valt datum
      const logsToSave = exerciseLogs
        .filter(log => log.sets > 0 || log.reps > 0 || log.weight > 0)
        .map(log => ({
          user_id: user?.id || 'local-user',
          program_name: programName,
          day: day,
          exercise_name: log.exercise_name,
          sets: log.sets,
          reps: log.reps,
          weight: log.weight,
          date: selectedDate
        }));

      if (logsToSave.length === 0) {
        toast({
          title: "Inget att spara",
          description: "Fyll i minst en övning för att spara",
          variant: "destructive"
        });
        return;
      }

      let savedToCloud = false;
      
      if (user) {
        try {
          // Försök spara till Supabase först
          await supabase
            .from('workout_logs')
            .delete()
            .eq('user_id', user.id)
            .eq('program_name', programName)
            .eq('day', day)
            .eq('date', selectedDate);

          const { error } = await supabase
            .from('workout_logs')
            .insert(logsToSave);

          if (error) throw error;
          savedToCloud = true;
        } catch (supabaseError) {
          // Supabase save failed, fall back to localStorage
        }
      }

      // Backup: Spara till localStorage
      const storageKey = `workout_logs_${user?.id || 'local'}_${programName}_${day}_${selectedDate}`;
      localStorage.setItem(storageKey, JSON.stringify(logsToSave));

      const formattedDate = new Date(selectedDate).toLocaleDateString('sv-SE');
      
      if (savedToCloud) {
        toast({
          title: "Träningslogg sparad! ✅",
          description: `${logsToSave.length} övningar loggade för ${day} (${formattedDate}) - Sparat i molnet`,
        });
      } else {
        // Kontrollera om det är konfigurationsproblem
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!user) {
          toast({
            title: "Träningslogg sparad! 📅",
            description: `${logsToSave.length} övningar loggade för ${day} (${formattedDate}) - Sparat lokalt`,
          });
        } else if (!supabaseUrl || supabaseUrl.includes('your-project') || !supabaseKey || supabaseKey.includes('your-anon-key')) {
          toast({
            title: "Träningslogg sparad! ⚠️",
            description: `${logsToSave.length} övningar loggade för ${day} (${formattedDate}) - Sparat lokalt. Molnsynkronisering är inte konfigurerad.`,
          });
        } else {
          toast({
            title: "Träningslogg sparad! ⚠️",
            description: `${logsToSave.length} övningar loggade för ${day} (${formattedDate}) - Sparat lokalt. Molnsynkronisering misslyckades.`,
          });
        }
      }

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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border-gray-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Träningslogg - {day}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Datumväljare */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="workout-date" className="text-sm font-medium text-foreground">
                    Träningsdatum
                  </Label>
                  <Input
                    id="workout-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-1 bg-white border-gray-100 rounded-xl text-foreground"
                  />
                </div>
              </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Logga dina reps och vikt för varje övning. Data sparas med valt datum.
          </p>
          
          {exercises.map((exercise, index) => (
            <div key={exercise.name} className="bg-white border border-gray-100 rounded-2xl p-4">
               <div className="mb-3">
                 <div className="flex items-center gap-3 mb-1">
                   <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-medium">
                     {index + 1}
                   </div>
                   <h4 className="text-base font-medium text-foreground">{exercise.name}</h4>
                 </div>
                 <p className="text-sm text-muted-foreground ml-10">
                   Rekommenderat: {exercise.sets} set × {exercise.reps} reps
                 </p>
                 {exercise.tags && exercise.tags.length > 0 && (
                   <div className="flex flex-wrap gap-1 mt-2 ml-10">
                     {exercise.tags.map((tag, tagIndex) => (
                       <span key={tagIndex} className="text-xs px-2 py-1 bg-gray-100 rounded-md text-muted-foreground">
                         {tag}
                       </span>
                     ))}
                   </div>
                 )}
               </div>
              <div className="grid grid-cols-3 gap-3 ml-10">
                <div>
                  <Label htmlFor={`sets-${index}`} className="text-xs text-muted-foreground">Set</Label>
                  <Input
                    id={`sets-${index}`}
                    type="number"
                    placeholder="0"
                    min="0"
                    value={exerciseLogs[index]?.sets || ''}
                    onChange={(e) => updateExerciseLog(index, 'sets', parseInt(e.target.value) || 0)}
                    className="bg-white border-gray-100 rounded-xl text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor={`reps-${index}`} className="text-xs text-muted-foreground">Reps</Label>
                  <Input
                    id={`reps-${index}`}
                    type="number"
                    placeholder="0"
                    min="0"
                    value={exerciseLogs[index]?.reps || ''}
                    onChange={(e) => updateExerciseLog(index, 'reps', parseInt(e.target.value) || 0)}
                    className="bg-white border-gray-100 rounded-xl text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor={`weight-${index}`} className="text-xs text-muted-foreground">Vikt (kg)</Label>
                  <Input
                    id={`weight-${index}`}
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.5"
                    value={exerciseLogs[index]?.weight || ''}
                    onChange={(e) => updateExerciseLog(index, 'weight', parseFloat(e.target.value) || 0)}
                    className="bg-white border-gray-100 rounded-xl text-foreground"
                  />
                </div>
              </div>
            </div>
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