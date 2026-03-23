import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { workoutPrograms } from '@/data/workoutPrograms';
import {
  getCurrentUser,
  getUserSetting,
} from '@/utils/supabaseAuth';
import {
  loadGamificationState,
  saveGamificationState,
  addXP,
  calculateLevel
} from '@/utils/gamification';
import {
  getCurrentPosition,
  loadGymLocations,
  isNearGym,
  canCheckIn,
  recordCheckIn
} from '@/utils/geolocation';
import { XPBar } from '@/components/XPBar';
import StreakBadge from '@/components/StreakBadge';
import CheckInButton from '@/components/CheckInButton';
import XPPopup from '@/components/XPPopup';
import AchievementCard from '@/components/AchievementCard';
import { ChevronRight, Dumbbell, Zap, Trophy } from 'lucide-react';
import type { GamificationState, XPEvent } from '@/types/gamification';

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gamification, setGamification] = useState<GamificationState | null>(null);
  const [selectedProgram, setSelectedProgram] = useState(workoutPrograms[0]);
  const [todayWorkout, setTodayWorkout] = useState<typeof workoutPrograms[0]['weeklyPlan'][0] | null>(null);

  // Geo state
  const [nearGym, setNearGym] = useState(false);
  const [nearestGymName, setNearestGymName] = useState<string | null>(null);
  const [gymDistance, setGymDistance] = useState<number | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [nearestGymId, setNearestGymId] = useState<string | null>(null);

  // XP popup
  const [xpPopup, setXpPopup] = useState<{ amount: number; description: string } | null>(null);

  // Get today's day name in Swedish
  const getTodayName = () => {
    const days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
    return days[new Date().getDay()];
  };

  // Load user data
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getCurrentUser();
        if (result.success && result.user) {
          setUser(result.user);
          const savedProgramId = await getUserSetting(result.user.id, 'selectedWorkoutProgram');
          if (savedProgramId) {
            const program = workoutPrograms.find(p => p.id === savedProgramId);
            if (program) setSelectedProgram(program);
          }
        }
      } catch (e) {
        console.error('Error loading user:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Load gamification state
  useEffect(() => {
    const state = loadGamificationState();
    setGamification(state);
  }, []);

  // Determine today's workout
  useEffect(() => {
    const today = getTodayName();
    const dayPlan = selectedProgram.weeklyPlan.find(d => d.day === today);
    setTodayWorkout(dayPlan || null);
  }, [selectedProgram]);

  // Check gym proximity
  const checkGymProximity = useCallback(async () => {
    setGeoLoading(true);
    try {
      const gyms = loadGymLocations();
      if (gyms.length === 0) {
        setNearGym(false);
        setGeoLoading(false);
        return;
      }

      const position = await getCurrentPosition();
      const result = isNearGym(
        position.coords.latitude,
        position.coords.longitude,
        gyms
      );

      setNearGym(result.isNear);
      setNearestGymName(result.nearestGym?.name || null);
      setGymDistance(Math.round(result.distance));
      setNearestGymId(result.nearestGym?.id || null);

      if (result.nearestGym) {
        setIsCheckedIn(!canCheckIn(result.nearestGym.id));
      }
    } catch (e) {
      console.error('Geo error:', e);
      setNearGym(false);
    } finally {
      setGeoLoading(false);
    }
  }, []);

  useEffect(() => {
    checkGymProximity();
    const interval = setInterval(checkGymProximity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkGymProximity]);

  // Handle check-in
  const handleCheckIn = () => {
    if (!nearestGymId || !gamification) return;

    const xpAmount = 50;
    recordCheckIn(nearestGymId, xpAmount);
    setIsCheckedIn(true);

    const event: XPEvent = {
      type: 'checkin',
      amount: xpAmount,
      description: `Incheckad på ${nearestGymName}`,
      timestamp: new Date().toISOString(),
    };

    const newState = addXP(gamification, event);
    setGamification(newState);
    saveGamificationState(newState);
    setXpPopup({ amount: xpAmount, description: event.description });
  };

  // Recent achievements (last 3 unlocked)
  const recentAchievements = gamification?.achievements
    .filter(a => a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 3) || [];

  const levelInfo = gamification ? calculateLevel(gamification.xp) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <Dumbbell className="h-12 w-12 text-blue-500" />
          <p className="text-muted-foreground text-sm">Laddar GymQuest...</p>
        </div>
      </div>
    );
  }

  const isRestDay = todayWorkout?.muscleGroups.includes('Rest');

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* XP Popup */}
      {xpPopup && (
        <XPPopup
          amount={xpPopup.amount}
          description={xpPopup.description}
          onComplete={() => setXpPopup(null)}
        />
      )}

      <div className="w-full max-w-screen-sm mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">GymQuest</h1>
            <p className="text-sm text-muted-foreground">
              {getTodayName()} {new Date().toLocaleDateString('sv-SE')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {levelInfo?.level || 1}
              </span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        {levelInfo && (
          <div className="mb-6">
            <XPBar
              xp={gamification?.xp || 0}
              level={levelInfo.level}
              title={levelInfo.title}
              currentXP={levelInfo.currentXP}
              nextLevelXP={levelInfo.nextLevelXP}
              progress={levelInfo.progress}
            />
          </div>
        )}

        {/* Streak & Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StreakBadge
            streak={gamification?.currentStreak || 0}
            longestStreak={gamification?.longestStreak || 0}
          />
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Totalt XP</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {(gamification?.xp || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Today's Workout Card */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Dagens Pass
          </h2>
          {todayWorkout ? (
            <Link
              to={isRestDay ? '#' : `/workout/${getTodayName()}`}
              className="block"
            >
              <div className={`relative overflow-hidden rounded-2xl border border-white/10 p-5 ${
                isRestDay
                  ? 'bg-white/5'
                  : 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30'
              } transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {todayWorkout.focus}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {todayWorkout.muscleGroups.map((mg, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-blue-300"
                        >
                          {mg}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isRestDay ? 'Vila & återhämtning' : `${todayWorkout.exercises.length} övningar`}
                    </p>
                  </div>
                  {!isRestDay && (
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                        <ChevronRight className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                {!isRestDay && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-xs text-green-400">
                      +{100 + todayWorkout.exercises.length * 10} XP möjligt
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-muted-foreground">Inget pass schemalagt idag</p>
            </div>
          )}
        </div>

        {/* Current Program */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Aktivt Program
            </h2>
            <Link to="/workouts" className="text-xs text-blue-400 hover:text-blue-300">
              Byt program
            </Link>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{selectedProgram.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedProgram.frequency.replace('/WEEK', ' dagar/vecka')} &middot; {selectedProgram.goal}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Gym Check-in */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Gym Check-in
          </h2>
          <CheckInButton
            onCheckIn={handleCheckIn}
            isNearGym={nearGym}
            gymName={nearestGymName}
            distance={gymDistance}
            isCheckedIn={isCheckedIn}
            isLoading={geoLoading}
          />
        </div>

        {/* Quick Stats */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Statistik
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <Dumbbell className="h-4 w-4 text-blue-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{gamification?.totalWorkouts || 0}</p>
              <p className="text-[10px] text-muted-foreground">Pass</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <Trophy className="h-4 w-4 text-amber-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">
                {gamification?.achievements.filter(a => a.unlockedAt).length || 0}
              </p>
              <p className="text-[10px] text-muted-foreground">Prestationer</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <Zap className="h-4 w-4 text-green-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">
                {gamification?.personalRecords.length || 0}
              </p>
              <p className="text-[10px] text-muted-foreground">PRs</p>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Senaste Prestationer
              </h2>
              <Link to="/progress" className="text-xs text-blue-400 hover:text-blue-300">
                Visa alla
              </Link>
            </div>
            <div className="space-y-2">
              {recentAchievements.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        {/* Week Overview */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Veckans Schema
          </h2>
          <div className="grid grid-cols-7 gap-1.5">
            {selectedProgram.weeklyPlan.map((day, i) => {
              const isToday = day.day === getTodayName();
              const isRest = day.muscleGroups.includes('Rest');
              return (
                <div
                  key={i}
                  className={`rounded-xl p-2 text-center ${
                    isToday
                      ? 'bg-blue-500/20 border border-blue-500/50 ring-1 ring-blue-500/30'
                      : isRest
                        ? 'bg-white/5 border border-white/5'
                        : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <p className={`text-[10px] font-medium ${isToday ? 'text-blue-400' : 'text-muted-foreground'}`}>
                    {day.day.slice(0, 3)}
                  </p>
                  <p className={`text-[9px] mt-0.5 ${isToday ? 'text-blue-300' : 'text-muted-foreground/70'}`}>
                    {isRest ? 'Vila' : day.muscleGroups.slice(0, 2).join(', ').slice(0, 8)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
