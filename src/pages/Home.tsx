import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { ChevronRight, Dumbbell, Zap, Trophy, MapPin } from 'lucide-react';
import type { GamificationState, XPEvent } from '@/types/gamification';

// Skeleton loading component
const HomeSkeleton = () => (
  <div className="min-h-screen bg-background pb-24">
    <div className="w-full max-w-screen-sm mx-auto px-4 pt-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-36 bg-white/10 rounded-lg" />
          <div className="h-4 w-24 bg-white/5 rounded-lg" />
        </div>
        <div className="w-10 h-10 rounded-full bg-white/10" />
      </div>
      {/* XP bar skeleton */}
      <div className="h-24 bg-white/5 rounded-2xl border border-white/10" />
      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 bg-white/5 rounded-2xl border border-white/10" />
        <div className="h-24 bg-white/5 rounded-2xl border border-white/10" />
      </div>
      {/* Today's workout skeleton */}
      <div>
        <div className="h-4 w-24 bg-white/10 rounded mb-3" />
        <div className="h-36 bg-white/5 rounded-2xl border border-white/10" />
      </div>
      {/* Program skeleton */}
      <div>
        <div className="h-4 w-28 bg-white/10 rounded mb-3" />
        <div className="h-16 bg-white/5 rounded-2xl border border-white/10" />
      </div>
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 bg-white/5 rounded-xl border border-white/10" />
        <div className="h-20 bg-white/5 rounded-xl border border-white/10" />
        <div className="h-20 bg-white/5 rounded-xl border border-white/10" />
      </div>
    </div>
  </div>
);

// Get greeting based on time of day
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 6) return 'God natt';
  if (hour < 10) return 'God morgon';
  if (hour < 13) return 'God förmiddag';
  if (hour < 17) return 'God eftermiddag';
  if (hour < 21) return 'God kväll';
  return 'God natt';
};

// Get today's day name in Swedish
const getTodayName = (): string => {
  const days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
  return days[new Date().getDay()];
};

const Home = () => {
  const navigate = useNavigate();
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

  // Check onboarding + load user data
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('gymquest-onboarding-complete');
    if (onboardingComplete !== 'true') {
      navigate('/onboarding', { replace: true });
      return;
    }

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
      } catch {
        // Silent fail - user will see default state
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  // Load gamification state
  useEffect(() => {
    setGamification(loadGamificationState());
  }, []);

  // Determine today's workout
  useEffect(() => {
    const today = getTodayName();
    const dayPlan = selectedProgram.weeklyPlan.find(d => d.day === today);
    setTodayWorkout(dayPlan || null);
  }, [selectedProgram]);

  // Check gym proximity (with 5-minute interval instead of 1-minute to save battery)
  const checkGymProximity = useCallback(async () => {
    const gyms = loadGymLocations();
    if (gyms.length === 0) {
      setNearGym(false);
      return;
    }

    setGeoLoading(true);
    try {
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
    } catch {
      setNearGym(false);
    } finally {
      setGeoLoading(false);
    }
  }, []);

  useEffect(() => {
    checkGymProximity();
    const interval = setInterval(checkGymProximity, 300000); // 5 minutes
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
  const hasGyms = useMemo(() => loadGymLocations().length > 0, [nearestGymId]);

  if (loading) return <HomeSkeleton />;

  const isRestDay = todayWorkout?.muscleGroups.includes('Rest');
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || '';

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

      <div className="w-full max-w-screen-sm mx-auto px-5 pt-8">
        {/* Header with greeting */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-muted-foreground mb-0.5">{getGreeting()}</p>
            <h1 className="text-2xl font-bold text-foreground">
              {userName ? `${userName}` : 'GymQuest'}
            </h1>
          </div>
          <Link to="/profile">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-sm">
                {levelInfo?.level || 1}
              </span>
            </div>
          </Link>
        </div>

        {/* XP Bar */}
        {levelInfo && (
          <div className="mb-8 animate-fade-in">
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

        {/* Streak & XP Row */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <StreakBadge
            streak={gamification?.currentStreak || 0}
            longestStreak={gamification?.longestStreak || 0}
          />
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-muted-foreground">Totalt XP</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {(gamification?.xp || 0).toLocaleString('sv-SE')}
            </p>
          </div>
        </div>

        {/* Today's Workout Card */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Dagens Pass
          </h2>
          {todayWorkout ? (
            <Link
              to={isRestDay ? '#' : `/workout/${getTodayName()}`}
              className="block group"
            >
              <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                isRestDay
                  ? 'border-white/10 bg-white/5'
                  : 'border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-600/10 group-hover:from-blue-500/20 group-hover:to-purple-600/20 group-hover:border-blue-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1.5">
                      {todayWorkout.focus}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {todayWorkout.muscleGroups.map((mg, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-blue-300 font-medium"
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
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
                      <ChevronRight className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                {!isRestDay && (
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">
                      +{100 + todayWorkout.exercises.length * 10} XP möjligt
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <Dumbbell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Inget pass schemalagt idag</p>
              <Link to="/workouts" className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block">
                Välj ett program
              </Link>
            </div>
          )}
        </section>

        {/* Current Program */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Aktivt Program
            </h2>
            <Link to="/workouts" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Byt program
            </Link>
          </div>
          <Link to="/workouts" className="block group">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 group-hover:bg-white/[0.08] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{selectedProgram.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedProgram.frequency.replace('/WEEK', ' dagar/vecka')} · {selectedProgram.goal}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </div>
          </Link>
        </section>

        {/* Gym Check-in */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Gym Check-in
          </h2>
          {hasGyms ? (
            <CheckInButton
              onCheckIn={handleCheckIn}
              isNearGym={nearGym}
              gymName={nearestGymName}
              distance={gymDistance}
              isCheckedIn={isCheckedIn}
              isLoading={geoLoading}
            />
          ) : (
            <Link to="/profile" className="block">
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-5 text-center hover:bg-white/[0.08] transition-colors">
                <MapPin className="h-6 w-6 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Inget gym sparat</p>
                <p className="text-xs text-blue-400 mt-1">Lägg till ditt gym i profilen →</p>
              </div>
            </Link>
          )}
        </section>

        {/* Quick Stats */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Statistik
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
              <Dumbbell className="h-4 w-4 text-blue-400 mx-auto mb-1.5" />
              <p className="text-xl font-bold text-foreground">{gamification?.totalWorkouts || 0}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Pass</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
              <Trophy className="h-4 w-4 text-amber-400 mx-auto mb-1.5" />
              <p className="text-xl font-bold text-foreground">
                {gamification?.achievements.filter(a => a.unlockedAt).length || 0}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Prestationer</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
              <Zap className="h-4 w-4 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-xl font-bold text-foreground">
                {gamification?.personalRecords.length || 0}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">PRs</p>
            </div>
          </div>
        </section>

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Senaste Prestationer
              </h2>
              <Link to="/progress" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Visa alla
              </Link>
            </div>
            <div className="space-y-2">
              {recentAchievements.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </section>
        )}

        {/* Week Overview */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Veckans Schema
          </h2>
          <div className="grid grid-cols-7 gap-1.5">
            {selectedProgram.weeklyPlan.map((day, i) => {
              const isToday = day.day === getTodayName();
              const isRest = day.muscleGroups.includes('Rest');
              return (
                <div
                  key={i}
                  className={`rounded-xl p-2 text-center transition-all ${
                    isToday
                      ? 'bg-blue-500/20 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                      : isRest
                        ? 'bg-white/[0.03] border border-white/5'
                        : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <p className={`text-[10px] font-semibold ${isToday ? 'text-blue-400' : 'text-muted-foreground'}`}>
                    {day.day.slice(0, 3)}
                  </p>
                  <p className={`text-[8px] mt-0.5 leading-tight ${isToday ? 'text-blue-300' : 'text-muted-foreground/60'}`}>
                    {isRest ? 'Vila' : day.muscleGroups.slice(0, 2).join(', ').slice(0, 10)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
