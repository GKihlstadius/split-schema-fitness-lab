import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutProgram } from '@/types/workout';
import { DayWorkoutView } from '@/components/DayWorkoutView';
import { CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface ProgramDetailProps {
  program: WorkoutProgram;
}

// RP (Renaissance Periodization) rekommendationer för hypertrofi
const rpRecommendations = {
  'Chest': { sets: '9-15', frequency: 3, days: '3 (Mån, Tor, ev. Lör)' },
  'Triceps': { sets: '9-12', frequency: 3, days: '3 (Mån, Tor, ev. Ons)' },
  'Shoulders': { sets: '9-12', frequency: 3, days: '3 (Mån, Tor, Lör)' },
  'Biceps': { sets: '9-12', frequency: 3, days: '3 (Mån, Ons, Tor, Lör)' },
  'Back': { sets: '9-12', frequency: 3, days: '3 (Ons, Lör, ev. Mån)' },
  'Hamstrings': { sets: '6-10', frequency: 2, days: '2 (Tis, Fre)' },
  'Quads': { sets: '6-10', frequency: 2, days: '2 (Tis, Fre)' },
  'Glutes': { sets: '3-4', frequency: 1, days: '1 (Fre)' },
  'Calves': { sets: '6-10', frequency: 2, days: '2 (Mån, Tor)' },
  'Forearms': { sets: '4-6', frequency: 2, days: '2 (Ons, Lör)' },
  'Core': { sets: '0-16', frequency: 3, days: '3 (valfritt)' },
  'Abs': { sets: '0-16', frequency: 3, days: '3 (valfritt)' }
};

export const ProgramDetail: React.FC<ProgramDetailProps> = ({ program }) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const dayWorkoutRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const dayCardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
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

  // Räkna träningsfrekvens och set per muskelgrupp
  const calculateMuscleGroupStats = () => {
    const stats: { [key: string]: { frequency: number; sets: number; days: string[] } } = {};
    
    program.weeklyPlan.forEach(day => {
      if (day.muscleGroups.includes('Rest')) return;
      
      day.muscleGroups.forEach(muscle => {
        if (!stats[muscle]) {
          stats[muscle] = { frequency: 0, sets: 0, days: [] };
        }
        
        if (!stats[muscle].days.includes(day.day)) {
          stats[muscle].frequency++;
          stats[muscle].days.push(day.day);
        }
        
        // Räkna set för denna muskelgrupp denna dag
        const muscleSets = day.exercises
          .filter(exercise => exercise.tags.includes(muscle))
          .reduce((total, exercise) => {
            const setCount = exercise.sets.includes('-') ? 
              parseInt(exercise.sets.split('-')[1]) || parseInt(exercise.sets.split('-')[0]) || 3 :
              parseInt(exercise.sets) || 3;
            return total + setCount;
          }, 0);
        
        stats[muscle].sets += muscleSets;
      });
    });
    
    return stats;
  };

  const muscleStats = calculateMuscleGroupStats();

  // Kontrollera om schemat matchar RP-rekommendationer
  const checkRPCompliance = (muscle: string, actualSets: number, actualFreq: number) => {
    const rp = rpRecommendations[muscle as keyof typeof rpRecommendations];
    if (!rp) return false;
    
    const [minSets, maxSets] = rp.sets.split('-').map(s => parseInt(s));
    const frequencyOk = actualFreq >= rp.frequency;
    const setsOk = actualSets >= minSets && actualSets <= maxSets;
    
    return frequencyOk && setsOk;
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
              ref={(el) => { dayCardRefs.current[day.day] = el; }}
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

      {/* Training Analysis Toggle Button */}
      <div className="mb-12" ref={analysisRef}>
        <Button
          variant="outline"
          onClick={() => {
            setShowAnalysis(!showAnalysis);
            if (!showAnalysis && analysisRef.current) {
              setTimeout(() => {
                analysisRef.current?.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'start' 
                });
              }, 100);
            }
          }}
          className="w-full md:w-auto flex items-center gap-2 border-border hover:bg-muted/50"
        >
          <Info className="h-4 w-4 text-blue-500" />
          <span>Träningsanalys (enligt RP)</span>
          {showAnalysis ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {/* Science-baserad analys - Collapsible */}
        {showAnalysis && (
          <Card className="border-border shadow-none mt-4">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-light">Muskelgrupp</th>
                      <th className="text-left py-2 font-light">Träningsdagar</th>
                      <th className="text-left py-2 font-light">Rek. set (RP)</th>
                      <th className="text-left py-2 font-light">Ditt schema</th>
                      <th className="text-left py-2 font-light">Matchar?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(muscleStats)
                      .filter(([muscle]) => muscle !== 'Rest')
                      .map(([muscle, stats]) => {
                        const rp = rpRecommendations[muscle as keyof typeof rpRecommendations];
                        const isCompliant = checkRPCompliance(muscle, stats.sets, stats.frequency);
                        
                        return (
                          <tr key={muscle} className="border-b border-border/50">
                            <td className="py-3">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs font-light border-0 ${getMuscleGroupClass(muscle)}`}
                              >
                                {muscle}
                              </Badge>
                            </td>
                            <td className="py-3 text-muted-foreground">
                              {rp ? rp.days : `${stats.frequency} (${stats.days.slice(0, 3).join(', ')})`}
                            </td>
                            <td className="py-3 text-muted-foreground">
                              {rp ? `${rp.sets} set` : 'N/A'}
                            </td>
                            <td className="py-3 font-medium">
                              {stats.sets} set
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-1">
                                <CheckCircle 
                                  className={`h-4 w-4 ${isCompliant ? 'text-green-500' : 'text-orange-500'}`} 
                                />
                                <span className={`text-xs font-medium ${isCompliant ? 'text-green-600' : 'text-orange-600'}`}>
                                  {isCompliant ? 'Ja' : 'Behöver justering'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <p><strong>RP:</strong> Renaissance Periodization rekommendationer för hypertrofi</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Day Workout View */}
      {selectedDayPlan && (
        <div className="mb-12" ref={dayWorkoutRef}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-light text-primary">Övningar för {selectedDayPlan.day}</h3>
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground"
              onClick={handleCloseDay}
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
    </div>
  );
};
