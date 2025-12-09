import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutProgram, DayPlan } from '@/types/workout';
import { DayWorkoutView } from '@/components/DayWorkoutView';
import { Info, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProgramDetailProps {
  program: WorkoutProgram;
}

export const ProgramDetail: React.FC<ProgramDetailProps> = ({ program }) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showSetInfo, setShowSetInfo] = useState<boolean>(false);
  const dayWorkoutRef = useRef<HTMLDivElement>(null);
  const dayCardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { toast } = useToast();
  
  useEffect(() => {
    if (selectedDay && dayWorkoutRef.current) {
      dayWorkoutRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedDay]);

  const handleCloseDay = () => {
    const currentDay = selectedDay;
    setSelectedDay(null);
    
    // Scroll back to the day card after a short delay to ensure state has updated
    if (currentDay && dayCardRefs.current[currentDay]) {
      setTimeout(() => {
        dayCardRefs.current[currentDay]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  };

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

  const formatProgramPlan = () => {
    const lines: string[] = [
      `Program: ${program.name}`,
      `Mål: ${program.goal}`,
      `Frekvens: ${program.frequency}`,
      `Svårighetsgrad: ${program.difficulty}`,
      `Fokus: ${program.focus}`,
      `Längd: ${program.duration}`,
      '',
      'Veckoplanering:'
    ];

    program.weeklyPlan.forEach((dayPlan) => {
      lines.push(
        `${dayPlan.day} — ${dayPlan.focus}`,
        `Muskelgrupper: ${dayPlan.muscleGroups.join(', ')}`,
        'Övningar:'
      );

      dayPlan.exercises.forEach((exercise, idx) => {
        const tags = exercise.tags?.length ? ` [${exercise.tags.join(', ')}]` : '';
        const rest = exercise.rest ? ` | Vila: ${exercise.rest}` : '';
        const notes = exercise.notes ? ` | Anteckning: ${exercise.notes}` : '';
        lines.push(
          `${idx + 1}. ${exercise.name} — ${exercise.sets} set × ${exercise.reps}${rest}${tags}${notes}`
        );
      });

      lines.push(''); // tom rad mellan dagar
    });

    return lines.join('\n');
  };

  const formatDayPlan = (dayPlan: DayPlan) => {
    const lines: string[] = [
      `Program: ${program.name}`,
      `Dag: ${dayPlan.day}`,
      `Fokus: ${dayPlan.focus}`,
      `Muskelgrupper: ${dayPlan.muscleGroups.join(', ')}`,
      'Övningar:'
    ];

    dayPlan.exercises.forEach((exercise, idx) => {
      const tags = exercise.tags?.length ? ` [${exercise.tags.join(', ')}]` : '';
      const rest = exercise.rest ? ` | Vila: ${exercise.rest}` : '';
      const notes = exercise.notes ? ` | Anteckning: ${exercise.notes}` : '';
      lines.push(
        `${idx + 1}. ${exercise.name} — ${exercise.sets} set × ${exercise.reps}${rest}${tags}${notes}`
      );
    });

    return lines.join('\n');
  };

  const copyDayPlan = async () => {
    if (!selectedDayPlan) return;

    const text = formatDayPlan(selectedDayPlan);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      toast({
        title: 'Kopierat!',
        description: `${selectedDayPlan.day} har kopierats till urklipp.`,
      });
    } catch (error) {
      console.error('Kunde inte kopiera träningsschema:', error);
      toast({
        title: 'Kunde inte kopiera',
        description: 'Försök igen eller kopiera manuellt.',
        variant: 'destructive',
      });
    }
  };

  const copyProgramPlan = async () => {
    const text = formatProgramPlan();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      toast({
        title: 'Kopierat!',
        description: `${program.name} (hela veckan) har kopierats till urklipp.`,
      });
    } catch (error) {
      console.error('Kunde inte kopiera programschema:', error);
      toast({
        title: 'Kunde inte kopiera',
        description: 'Försök igen eller kopiera manuellt.',
        variant: 'destructive',
      });
    }
  };

  // Räkna set per muskelgrupp för info-displayen
  const calculateMuscleGroupSets = () => {
    const stats: { [key: string]: number } = {};
    
    program.weeklyPlan.forEach(day => {
      if (day.muscleGroups.includes('Rest')) return;
      
      day.exercises.forEach(exercise => {
        exercise.tags.forEach(muscle => {
          if (!stats[muscle]) stats[muscle] = 0;
          
          const setCount = exercise.sets.includes('-') ? 
            parseInt(exercise.sets.split('-')[1]) || parseInt(exercise.sets.split('-')[0]) || 3 :
            parseInt(exercise.sets) || 3;
          
          stats[muscle] += setCount;
        });
      });
    });
    
    return stats;
  };

  const muscleSetCounts = calculateMuscleGroupSets();

  return (
    <div className="w-full max-w-screen-sm mx-auto px-0 sm:px-2">

      {/* Programinfo */}
      <div className="mb-6 text-left space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">{program.name}</h1>
        <p className="text-sm text-muted-foreground">
          {program.goal} • {program.frequency.toLowerCase ? program.frequency.toLowerCase() : program.frequency} • {program.difficulty}
        </p>
        <p className="text-sm text-muted-foreground">{program.focus}</p>
        {program.description && (
          <p className="text-sm text-muted-foreground">{program.description}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          <Button 
            variant="outline" 
            className="border-border w-full sm:w-auto"
            onClick={copyProgramPlan}
          >
            Exportera schema
          </Button>
          {!showSetInfo && (
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setShowSetInfo(true)}
            >
              Information
            </Button>
          )}
        </div>
      </div>

      {/* Träningsdagar */}
      <div className="mb-10 space-y-3">
        {program.weeklyPlan.map((day) => (
          <Card 
            key={day.day} 
            ref={(el) => { dayCardRefs.current[day.day] = el; }}
            className={`w-full border-border shadow-none hover:shadow-sm transition-shadow cursor-pointer ${selectedDay === day.day ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                    {day.day} — {day.focus}
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
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="text-left">
                <div className="text-sm text-foreground font-medium">
                  {day.exercises.length} övningar
                </div>
                <div className="text-xs text-muted-foreground font-light">
                  Tryck för att {selectedDay === day.day ? 'dölja' : 'visa'} detaljer
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Information Button - Centrerad under träningskorten */}
      {/* Info Modal - Fixed position overlay */}
      {showSetInfo && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto border-border shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-light text-primary">Programinformation</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowSetInfo(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-foreground">Setfördelning per muskelgrupp (vecka)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(muscleSetCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([muscle, sets]) => (
                    <div key={muscle} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium text-sm text-foreground">{muscle}</span>
                      <Badge 
                        variant="secondary" 
                        className={`font-medium ${getMuscleGroupClass(muscle)} border-0`}
                      >
                        {sets} set
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="bg-muted/30 p-3 rounded-lg mt-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Vetenskaplig grund:</strong> Set-antalen är baserade på meta-analyser och Dr. Mike Israetels forskning 
                    om Maximum Adaptive Volume (MAV) för optimal hypertrofi utan överträning.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Day Workout View */}
      {selectedDayPlan && (
        <div className="mb-12" ref={dayWorkoutRef}>
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="text-xl font-light text-primary">Övningar för {selectedDayPlan.day}</h3>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="border-border"
                onClick={copyDayPlan}
              >
                Exportera dag
              </Button>
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground"
                onClick={handleCloseDay}
              >
                Stäng
              </Button>
            </div>
          </div>
          <Card className="border-border shadow-none">
            <CardContent className="pt-6">
              <DayWorkoutView dayPlan={selectedDayPlan} programName={program.name} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

