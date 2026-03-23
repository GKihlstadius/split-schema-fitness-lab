import React, { useMemo } from 'react';
import {
  format,
  subDays,
  startOfWeek,
  getISOWeek,
  parseISO,
  isToday,
} from 'date-fns';
import { sv } from 'date-fns/locale';
import { Dumbbell, Flame, Zap, Trophy, Lock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { Achievement, PersonalRecord } from '@/types/gamification';
import {
  loadGamificationState,
  calculateLevel,
} from '@/utils/gamification';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WorkoutHistoryEntry {
  date: string; // YYYY-MM-DD
  exerciseCount: number;
}

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

function loadWorkoutHistory(): WorkoutHistoryEntry[] {
  try {
    const raw = localStorage.getItem('gymquest-workout-history');
    if (!raw) return [];
    return JSON.parse(raw) as WorkoutHistoryEntry[];
  } catch {
    return [];
  }
}

function getWorkoutIntensity(
  dateStr: string,
  historyMap: Map<string, number>,
): 'none' | 'light' | 'full' | 'double' {
  const count = historyMap.get(dateStr) ?? 0;
  if (count === 0) return 'none';
  if (count <= 3) return 'light';
  if (count <= 6) return 'full';
  return 'double';
}

const intensityColor: Record<string, string> = {
  none: 'bg-white/5',
  light: 'bg-blue-300',
  full: 'bg-blue-500',
  double: 'bg-blue-700',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Progress: React.FC = () => {
  const gamification = useMemo(() => loadGamificationState(), []);
  const levelInfo = useMemo(
    () => calculateLevel(gamification.xp),
    [gamification.xp],
  );
  const workoutHistory = useMemo(() => loadWorkoutHistory(), []);

  // Build a map date -> exerciseCount for quick lookup
  const historyMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const entry of workoutHistory) {
      m.set(entry.date, (m.get(entry.date) ?? 0) + entry.exerciseCount);
    }
    return m;
  }, [workoutHistory]);

  // ---- Calendar heat map data (last 12 weeks = 84 days) ----
  const calendarWeeks = useMemo(() => {
    const today = new Date();
    const weeks: { date: Date; dateStr: string }[][] = [];
    // Go back 83 days from today => 84 days total
    const startDate = subDays(today, 83);
    // Align to Monday
    const alignedStart = startOfWeek(startDate, { weekStartsOn: 1 });

    let current = alignedStart;
    let week: { date: Date; dateStr: string }[] = [];
    while (current <= today) {
      week.push({
        date: new Date(current),
        dateStr: format(current, 'yyyy-MM-dd'),
      });
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      current = new Date(current.getTime() + 86400000);
    }
    if (week.length > 0) {
      weeks.push(week);
    }
    return weeks;
  }, []);

  // ---- Weekly volume chart data (last 8 weeks) ----
  const volumeData = useMemo(() => {
    const today = new Date();
    const data: { week: string; sets: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = subDays(today, i * 7 + (today.getDay() || 7) - 1);
      const weekNum = getISOWeek(weekStart);
      let totalSets = 0;
      for (let d = 0; d < 7; d++) {
        const day = format(
          new Date(weekStart.getTime() + d * 86400000),
          'yyyy-MM-dd',
        );
        totalSets += historyMap.get(day) ?? 0;
      }
      data.push({ week: `V.${weekNum}`, sets: totalSets });
    }
    return data;
  }, [historyMap]);

  // ---- Achievements ----
  const unlockedCount = gamification.achievements.filter(
    (a) => a.unlockedAt !== null,
  ).length;

  // ---- Personal records sorted by most recent ----
  const sortedPRs = useMemo(
    () =>
      [...gamification.personalRecords].sort(
        (a, b) =>
          new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
      ),
    [gamification.personalRecords],
  );

  // ---- Day labels ----
  const dayLabels = ['M', '', 'O', '', 'F', '', ''];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-8 pb-28 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Framsteg</h1>

      {/* ----------------------------------------------------------------- */}
      {/* Stats Overview Cards                                              */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Dumbbell className="w-5 h-5 text-blue-400" />}
          value={gamification.totalWorkouts}
          label="Totala pass"
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-orange-400" />}
          value={gamification.currentStreak}
          label="Nuvarande streak"
        />
        <StatCard
          icon={<Zap className="w-5 h-5 text-yellow-400" />}
          value={gamification.xp}
          label="Total XP"
        />
        <StatCard
          icon={<Trophy className="w-5 h-5 text-purple-400" />}
          value={levelInfo.level}
          label={`Level — ${levelInfo.title}`}
        />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Workout Calendar Heat Map                                         */}
      {/* ----------------------------------------------------------------- */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Träningskalender</h2>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 overflow-x-auto">
          <div className="flex gap-[3px]">
            {/* Day-of-week labels */}
            <div className="flex flex-col gap-[3px] mr-1 text-[10px] text-gray-500 pt-0">
              {dayLabels.map((label, i) => (
                <div
                  key={i}
                  className="h-[14px] flex items-center justify-end pr-1 leading-none"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Weeks columns */}
            {calendarWeeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map(({ date, dateStr }) => {
                  const intensity = getWorkoutIntensity(dateStr, historyMap);
                  const current = isToday(date);
                  return (
                    <div
                      key={dateStr}
                      title={`${dateStr} — ${intensity}`}
                      className={`w-[14px] h-[14px] rounded-[3px] ${intensityColor[intensity]} ${
                        current ? 'ring-2 ring-blue-400' : ''
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-400">
            <span>Mindre</span>
            {(['none', 'light', 'full', 'double'] as const).map((level) => (
              <div
                key={level}
                className={`w-[12px] h-[12px] rounded-[2px] ${intensityColor[level]}`}
              />
            ))}
            <span>Mer</span>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Weekly Volume Chart                                               */}
      {/* ----------------------------------------------------------------- */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Veckans volym</h2>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="week"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(value: number) => [`${value} set`, 'Volym']}
              />
              <Bar
                dataKey="sets"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Personal Records                                                   */}
      {/* ----------------------------------------------------------------- */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Personliga rekord</h2>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
          {sortedPRs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              Inga personliga rekord ännu. Börja logga dina lyft!
            </p>
          ) : (
            <ul className="divide-y divide-white/5">
              {sortedPRs.map((pr) => (
                <li
                  key={pr.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-sm">{pr.exerciseName}</p>
                    <p className="text-xs text-gray-400">
                      {format(parseISO(pr.recordedAt), 'd MMM yyyy', {
                        locale: sv,
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-400">
                      {pr.weight} kg
                    </p>
                    <p className="text-xs text-gray-400">{pr.reps} reps</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Achievements                                                       */}
      {/* ----------------------------------------------------------------- */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Prestationer</h2>
          <span className="text-sm text-gray-400">
            {unlockedCount}/{gamification.achievements.length} upplåsta
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {gamification.achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 flex flex-col gap-1">
      {icon}
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const unlocked = achievement.unlockedAt !== null;

  return (
    <div
      className={`relative bg-white/5 backdrop-blur border rounded-2xl p-4 flex flex-col items-center text-center gap-1 transition ${
        unlocked
          ? 'border-blue-500/30'
          : 'border-white/5 opacity-50 grayscale'
      }`}
    >
      {!unlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-3.5 h-3.5 text-gray-500" />
        </div>
      )}
      <span className="text-2xl">{achievement.icon}</span>
      <p className="text-sm font-medium leading-tight">{achievement.name}</p>
      <p className="text-[11px] text-gray-400 leading-snug">
        {achievement.description}
      </p>
    </div>
  );
}

export default Progress;
