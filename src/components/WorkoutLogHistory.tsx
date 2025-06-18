import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Dumbbell, Clock } from 'lucide-react';
import { supabase, WorkoutLog } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface WorkoutLogHistoryProps {
  userId?: string;
}

interface GroupedLog {
  date: string;
  program_name: string;
  day: string;
  exercises: WorkoutLog[];
  totalExercises: number;
  totalSets: number;
  totalWeight: number;
}

export function WorkoutLogHistory({ userId }: WorkoutLogHistoryProps) {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [groupedLogs, setGroupedLogs] = useState<GroupedLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month');
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchWorkoutLogs();
    }
  }, [userId, selectedPeriod]);

  const fetchWorkoutLogs = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      // Filtrera baserat på vald period
      if (selectedPeriod === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('date', weekAgo.toISOString().split('T')[0]);
      } else if (selectedPeriod === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte('date', monthAgo.toISOString().split('T')[0]);
      }

      const { data, error } = await query;

      if (error) throw error;

      setWorkoutLogs(data || []);
      groupLogsBySession(data || []);
    } catch (error) {
      console.error('Error fetching workout logs:', error);
      toast({
        title: "Fel vid hämtning",
        description: "Kunde inte hämta träningsloggar",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const groupLogsBySession = (logs: WorkoutLog[]) => {
    const grouped = logs.reduce((acc, log) => {
      const key = `${log.date}-${log.program_name}-${log.day}`;
      
      if (!acc[key]) {
        acc[key] = {
          date: log.date,
          program_name: log.program_name,
          day: log.day,
          exercises: [],
          totalExercises: 0,
          totalSets: 0,
          totalWeight: 0
        };
      }
      
      acc[key].exercises.push(log);
      acc[key].totalSets += log.sets;
      acc[key].totalWeight += log.weight * log.reps * log.sets;
      
      return acc;
    }, {} as Record<string, GroupedLog>);

    const groupedArray = Object.values(grouped).map(group => ({
      ...group,
      totalExercises: group.exercises.length
    }));

    setGroupedLogs(groupedArray);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Idag';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Igår';
    } else {
      return date.toLocaleDateString('sv-SE', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getProgressTrend = (exerciseName: string) => {
    const exerciseLogs = workoutLogs
      .filter(log => log.exercise_name === exerciseName)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (exerciseLogs.length < 2) return null;

    const latest = exerciseLogs[exerciseLogs.length - 1];
    const previous = exerciseLogs[exerciseLogs.length - 2];

    const latestVolume = latest.weight * latest.reps * latest.sets;
    const previousVolume = previous.weight * previous.reps * previous.sets;

    return latestVolume > previousVolume ? 'up' : latestVolume < previousVolume ? 'down' : 'same';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Laddar träningsloggar...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Dumbbell className="h-6 w-6" />
          Träningslogg
        </h2>
        <div className="flex gap-2">
          {['week', 'month', 'all'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period as any)}
            >
              {period === 'week' ? 'Vecka' : period === 'month' ? 'Månad' : 'Alla'}
            </Button>
          ))}
        </div>
      </div>

      {groupedLogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Inga träningsloggar ännu</h3>
            <p className="text-muted-foreground">
              Börja logga dina träningspass för att se din progress här!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {groupedLogs.map((session, index) => (
            <Card key={index} className="border border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(session.date)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {session.program_name} - {session.day}
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{session.totalExercises} övningar</div>
                    <div>{session.totalSets} set totalt</div>
                    <div>{Math.round(session.totalWeight)}kg total volym</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.exercises.map((exercise, exerciseIndex) => {
                    const trend = getProgressTrend(exercise.exercise_name);
                    return (
                      <div 
                        key={exerciseIndex} 
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium">
                            {exercise.exercise_name}
                          </div>
                          {trend && (
                            <TrendingUp 
                              className={`h-4 w-4 ${
                                trend === 'up' ? 'text-green-500' : 
                                trend === 'down' ? 'text-red-500 rotate-180' : 
                                'text-gray-500'
                              }`} 
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="outline">
                            {exercise.sets} × {exercise.reps}
                          </Badge>
                          <Badge variant="outline">
                            {exercise.weight}kg
                          </Badge>
                          <span className="text-muted-foreground">
                            {Math.round(exercise.weight * exercise.reps * exercise.sets)}kg volym
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 