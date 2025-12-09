import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutProgram, DayPlan } from '@/types/workout';
import { DayWorkoutView } from '@/components/DayWorkoutView';
import { ChevronDown, Info, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProgramDetailProps {
  program: WorkoutProgram;
}

export const ProgramDetail: React.FC<ProgramDetailProps> = ({ program }) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
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

  const ProgramDayCard = ({ day }: { day: DayPlan }) => (
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
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${selectedDay === day.day ? 'rotate-180' : ''}`}
          />
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
  );

  const formatFrequency = (freq: string) => {
    if (!freq) return '';
    return freq.replace('/WEEK', ' dagar/vecka').toLowerCase();
  };

  return (
    <div className="w-full max-w-screen-sm mx-auto px-0 sm:px-2">

      {/* Top row: only export icon (info removed) */}
      <div className="mb-4 flex items-center justify-center gap-2 max-w-md mx-auto">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full border-border"
          aria-label="Exportera schema"
          onClick={copyProgramPlan}
        >
          <Share className="h-4 w-4" />
        </Button>
      </div>

      {/* Träningsdagar */}
      <div className="mb-10 space-y-3">
        {program.weeklyPlan.map((day) => (
          <ProgramDayCard key={day.day} day={day} />
        ))}
      </div>

      {/* Selected Day Workout View */}
      {selectedDayPlan && (
        <div className="mb-12" ref={dayWorkoutRef}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-primary">Övningar för {selectedDayPlan.day}</h3>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-border text-sm px-3 py-2"
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
            <CardContent className="pt-4">
              <DayWorkoutView dayPlan={selectedDayPlan} programName={program.name} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

