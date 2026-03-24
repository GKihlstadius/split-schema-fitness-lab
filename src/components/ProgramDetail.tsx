import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkoutProgram, DayPlan } from '@/types/workout';
import { DayWorkoutView } from '@/components/DayWorkoutView';
import { ChevronDown, Copy } from 'lucide-react';
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
    return 'bg-secondary text-muted-foreground';
  };

  const selectedDayPlan = program.weeklyPlan.find(day => day.day === selectedDay);

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
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Kopierat!',
        description: `${selectedDayPlan.day} har kopierats till urklipp.`,
      });
    } catch {
      toast({
        title: 'Kunde inte kopiera',
        description: 'Försök igen.',
        variant: 'destructive',
      });
    }
  };

  const ProgramDayCard = ({ day }: { day: DayPlan }) => {
    const isRest = day.muscleGroups.includes('Rest');
    return (
      <div
        ref={(el) => { dayCardRefs.current[day.day] = el; }}
        className={`w-full rounded-2xl border transition-all duration-200 cursor-pointer ${
          selectedDay === day.day
            ? 'border-primary/30 bg-primary/10 ring-1 ring-primary/30'
            : 'border-border bg-card hover:bg-muted hover:border-border shadow-sm'
        }`}
        onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <h3 className="text-base font-semibold text-foreground leading-tight">
                {day.day} — {day.focus}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {day.muscleGroups.map((muscle, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className={`text-[10px] font-light border-0 rounded-full px-2 py-0.5 ${getMuscleGroupClass(muscle)}`}
                  >
                    {muscle}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {isRest ? 'Vila & återhämtning' : `${day.exercises.length} övningar`}
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 mt-1 ${
                selectedDay === day.day ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-screen-sm mx-auto">
      {/* Workout days */}
      <div className="mb-10 space-y-2">
        {program.weeklyPlan.map((day) => (
          <ProgramDayCard key={day.day} day={day} />
        ))}
      </div>

      {/* Selected Day Details */}
      {selectedDayPlan && (
        <div className="mb-12 animate-slide-up" ref={dayWorkoutRef}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-primary">
              Övningar — {selectedDayPlan.day}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border bg-card hover:bg-muted text-sm shadow-sm"
                onClick={copyDayPlan}
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Kopiera
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleCloseDay}
              >
                Stäng
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-sm p-4">
            <DayWorkoutView dayPlan={selectedDayPlan} programName={program.name} />
          </div>
        </div>
      )}
    </div>
  );
};
