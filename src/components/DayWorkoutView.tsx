import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DayPlan, Exercise } from '@/types/workout';
import { RandomExerciseGenerator } from './RandomExerciseGenerator';
import { WorkoutLogger } from './WorkoutLogger';
import { exerciseDatabase } from '@/data/exerciseDatabase';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronDown, Dumbbell, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface DayWorkoutViewProps {
  dayPlan: DayPlan;
  programName?: string;
  onSaveChanges?: (updatedExercises: Exercise[]) => void;
}

export function DayWorkoutView({ dayPlan, programName = 'Okänt program', onSaveChanges }: DayWorkoutViewProps) {
  const [exercises, setExercises] = useState<Exercise[]>(dayPlan.exercises);
  const [openPopover, setOpenPopover] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setExercises(dayPlan.exercises);
    setHasChanges(false);
  }, [dayPlan.day]);
  
  const handleApplyRandomExercises = (randomExercises: Exercise[]) => {
    setExercises(randomExercises);
    setHasChanges(true);
  };

  const handleExerciseChange = (exerciseIndex: number, newExerciseName: string) => {
    // Hitta den nya övningen i databasen
    const allExercises = Object.values(exerciseDatabase).flat();
    const newExercise = allExercises.find(ex => ex.name === newExerciseName);
    
    if (!newExercise) return;

    setExercises(prev => prev.map((exercise, index) => {
      if (index === exerciseIndex) {
        return {
          ...exercise,
          name: newExercise.name,
          tags: [newExercise.muscleGroup, ...(newExercise.equipment ? [newExercise.equipment] : [])]
        };
      }
      return exercise;
    }));
    
    setHasChanges(true);
    setOpenPopover(null);
  };

  const saveChanges = async () => {
    try {
      // Försök spara till Supabase först
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Spara till Supabase
        const saveData = {
          user_id: user.id,
          program_name: programName,
          day: dayPlan.day,
          exercises: exercises,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('user_workout_customizations')
          .upsert(saveData, {
            onConflict: 'user_id,program_name,day'
          });

        if (error) {
          console.error('Supabase error:', error);
          // Fallback till localStorage
          saveToLocalStorage();
        } else {
          toast({
            title: "Ändringar sparade! ✅",
            description: `${dayPlan.day} uppdaterat i molnet`,
          });
        }
      } else {
        // Användaren är inte inloggad, spara lokalt
        saveToLocalStorage();
      }
      
      // Anropa callback om den finns
      if (onSaveChanges) {
        onSaveChanges(exercises);
      }
      
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      // Fallback till localStorage
      saveToLocalStorage();
    }
  };

  const saveToLocalStorage = () => {
    try {
      const storageKey = `workout_customizations_${programName}_${dayPlan.day}`;
      const saveData = {
        exercises: exercises,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(storageKey, JSON.stringify(saveData));
      
      // Kontrollera om det är konfigurationsproblem
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || supabaseUrl.includes('your-project') || !supabaseKey || supabaseKey.includes('your-anon-key')) {
        toast({
          title: "Sparad lokalt ⚠️",
          description: `${dayPlan.day} sparat. Molnsynkronisering är inte konfigurerad än.`,
        });
      } else {
        toast({
          title: "Sparad lokalt ⚠️", 
          description: `${dayPlan.day} sparat. Molnsynkronisering misslyckades.`,
        });
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast({
        title: "Fel vid sparande",
        description: "Kunde inte spara ändringarna",
        variant: "destructive"
      });
    }
  };

  // Läs in sparade ändringar när komponenten laddas
  useEffect(() => {
    const loadSavedChanges = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Försök läsa från Supabase
          const { data, error } = await supabase
            .from('user_workout_customizations')
            .select('exercises')
            .eq('user_id', user.id)
            .eq('program_name', programName)
            .eq('day', dayPlan.day)
            .single();

          if (!error && data && data.exercises) {
            setExercises(data.exercises);
            return;
          }
        }
        
        // Fallback till localStorage
        const storageKey = `workout_customizations_${programName}_${dayPlan.day}`;
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.exercises && Array.isArray(parsed.exercises)) {
            setExercises(parsed.exercises);
          }
        }
      } catch (error) {
        console.error('Error loading saved changes:', error);
        // Använd originalövningarna om något går fel
        setExercises(dayPlan.exercises);
      }
    };

    loadSavedChanges();
  }, [programName, dayPlan.day, dayPlan.exercises]);

  // Hämta tillgängliga övningar baserat på muskelgrupp för en övning
  const getAvailableExercises = (currentExercise: Exercise) => {
    // Försök identifiera muskelgrupp från tags
    const currentTags = currentExercise.tags || [];
    let muscleGroup = '';
    
    // Leta efter muskelgrupp i tags
    for (const tag of currentTags) {
      if (exerciseDatabase[tag]) {
        muscleGroup = tag;
        break;
      }
    }
    
    // Om vi inte hittar muskelgrupp i tags, försök matcha med övningsnamn
    if (!muscleGroup) {
      const allExercises = Object.values(exerciseDatabase).flat();
      const matchingExercise = allExercises.find(ex => ex.name === currentExercise.name);
      if (matchingExercise) {
        muscleGroup = matchingExercise.muscleGroup;
      }
    }
    
    // Returnera övningar för den muskelgruppen
    return muscleGroup && exerciseDatabase[muscleGroup] ? exerciseDatabase[muscleGroup] : [];
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
          
          <div className="flex items-center gap-2">
            {/* Sparknapp - visas bara om det finns ändringar */}
            {hasChanges && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={saveChanges}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Spara
              </Button>
            )}
            
            {/* Loggbok */}
            <WorkoutLogger 
              programName={programName}
              day={dayPlan.day}
              exercises={exercises}
            />
            
            {/* Slumpa övningar */}
            <RandomExerciseGenerator 
              dayPlan={{...dayPlan, exercises}} 
              onApplyRandomExercises={handleApplyRandomExercises}
            />
          </div>
        </div>
        
        {exercises.length === 0 && (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Inga övningar</h3>
            <p className="text-muted-foreground">Det finns inga övningar för denna dag.</p>
          </div>
        )}

        {exercises.map((exercise, index) => (
          <div key={index} className="border-b border-white/10 pb-5 last:border-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-medium text-sm">
                  {index + 1}
                </div>
                
                {/* Klickbar övningsnamn med dropdown */}
                <Popover open={openPopover === index} onOpenChange={(open) => setOpenPopover(open ? index : null)}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      role="combobox"
                      aria-expanded={openPopover === index}
                      className="justify-start p-0 h-auto font-light text-lg text-foreground hover:text-primary hover:bg-transparent"
                    >
                      {exercise.name}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0 bg-[#1A1A2E] border-white/10">
                    <Command>
                      <CommandInput placeholder="Sök övningar..." />
                      <CommandList>
                        <CommandEmpty>Inga övningar hittades.</CommandEmpty>
                        <CommandGroup>
                          {getAvailableExercises(exercise).map((availableExercise) => (
                            <CommandItem
                              key={availableExercise.name}
                              value={availableExercise.name}
                              onSelect={() => handleExerciseChange(index, availableExercise.name)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  exercise.name === availableExercise.name ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{availableExercise.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {availableExercise.equipment && `${availableExercise.equipment} • `}
                                  {availableExercise.difficulty}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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