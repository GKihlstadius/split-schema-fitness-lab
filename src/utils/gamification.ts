import { isToday, isYesterday, parseISO } from 'date-fns';
import type {
  Achievement,
  GamificationState,
  XPEvent,
} from '../types/gamification';

// ---------------------------------------------------------------------------
// XP & Leveling
// ---------------------------------------------------------------------------

const TITLES: [number, string][] = [
  [76, 'Mytisk'],
  [51, 'Legend'],
  [26, 'Krigare'],
  [11, 'Dedikerad'],
  [1, 'Nybörjare'],
];

function getTitle(level: number): string {
  for (const [min, title] of TITLES) {
    if (level >= min) return title;
  }
  return 'Nybörjare';
}

export function calculateLevel(xp: number): {
  level: number;
  title: string;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
} {
  const rawLevel = Math.floor(Math.sqrt(xp / 100));
  const level = Math.min(rawLevel, 100);
  const title = getTitle(level);
  const currentLevelXP = level * level * 100;
  const nextLevelXP = (level + 1) * (level + 1) * 100;
  const progress =
    nextLevelXP === currentLevelXP
      ? 1
      : (xp - currentLevelXP) / (nextLevelXP - currentLevelXP);

  return { level, title, currentXP: xp, nextLevelXP, progress };
}

// ---------------------------------------------------------------------------
// XP Awards
// ---------------------------------------------------------------------------

export function getCheckinXP(): number {
  return 50;
}

export function getWorkoutXP(exerciseCount: number, totalSets: number): number {
  const raw = 100 + 10 * exerciseCount + 5 * totalSets;
  return Math.min(raw, 300);
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 90) return 3.0;
  if (streak >= 30) return 2.0;
  if (streak >= 7) return 1.5;
  return 1.0;
}

export function getPRXP(): number {
  return 200;
}

// ---------------------------------------------------------------------------
// Streak Management
// ---------------------------------------------------------------------------

export function updateStreak(lastWorkoutDate: string | null): {
  currentStreak: number;
  isNewDay: boolean;
} {
  if (!lastWorkoutDate) {
    return { currentStreak: 1, isNewDay: true };
  }

  const last = parseISO(lastWorkoutDate);

  if (isToday(last)) {
    return { currentStreak: 0, isNewDay: false }; // 0 signals "no change"
  }

  if (isYesterday(last)) {
    return { currentStreak: 1, isNewDay: true }; // +1 to existing streak
  }

  // Gap larger than one day – reset
  return { currentStreak: 1, isNewDay: true };
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export function getDefaultAchievements(): Achievement[] {
  return [
    {
      id: 'first_workout',
      name: 'Första Passet',
      description: 'Genomför ditt första träningspass',
      icon: '🏋️',
      category: 'consistency',
      requirement: 1,
      unlockedAt: null,
    },
    {
      id: 'week_warrior',
      name: 'Veckokrigar',
      description: 'Håll en streak i 7 dagar',
      icon: '🔥',
      category: 'consistency',
      requirement: 7,
      unlockedAt: null,
    },
    {
      id: 'month_monster',
      name: 'Månadsmonster',
      description: 'Håll en streak i 30 dagar',
      icon: '👹',
      category: 'consistency',
      requirement: 30,
      unlockedAt: null,
    },
    {
      id: 'hundred_club',
      name: 'Hundraklubben',
      description: 'Genomför 100 träningspass totalt',
      icon: '💯',
      category: 'consistency',
      requirement: 100,
      unlockedAt: null,
    },
    {
      id: 'pr_hunter',
      name: 'PR Jägare',
      description: 'Sätt ditt första personliga rekord',
      icon: '🎯',
      category: 'strength',
      requirement: 1,
      unlockedAt: null,
    },
    {
      id: 'fifteen_prs',
      name: 'Femton PR',
      description: 'Sätt 15 personliga rekord',
      icon: '🏆',
      category: 'strength',
      requirement: 15,
      unlockedAt: null,
    },
    {
      id: 'volume_king',
      name: 'Volymkung',
      description: 'Logga 1000 set totalt',
      icon: '👑',
      category: 'volume',
      requirement: 1000,
      unlockedAt: null,
    },
    {
      id: 'explorer',
      name: 'Utforskare',
      description: 'Prova 5 olika program',
      icon: '🧭',
      category: 'explorer',
      requirement: 5,
      unlockedAt: null,
    },
    {
      id: 'unstoppable',
      name: 'Ostoppbar',
      description: 'Håll en streak i 90 dagar',
      icon: '⚡',
      category: 'consistency',
      requirement: 90,
      unlockedAt: null,
    },
    {
      id: 'legendary',
      name: 'Legendarisk',
      description: 'Nå level 50',
      icon: '🌟',
      category: 'consistency',
      requirement: 50,
      unlockedAt: null,
    },
  ];
}

export function checkAchievements(state: GamificationState): Achievement[] {
  const now = new Date().toISOString();
  const newly: Achievement[] = [];

  for (const achievement of state.achievements) {
    if (achievement.unlockedAt) continue;

    let earned = false;

    switch (achievement.id) {
      case 'first_workout':
        earned = state.totalWorkouts >= achievement.requirement;
        break;
      case 'week_warrior':
        earned = state.currentStreak >= achievement.requirement;
        break;
      case 'month_monster':
        earned = state.currentStreak >= achievement.requirement;
        break;
      case 'hundred_club':
        earned = state.totalWorkouts >= achievement.requirement;
        break;
      case 'pr_hunter':
        earned = state.personalRecords.length >= achievement.requirement;
        break;
      case 'fifteen_prs':
        earned = state.personalRecords.length >= achievement.requirement;
        break;
      case 'volume_king':
        // Checked externally; requirement tracked via totalSets passed in state
        // For now we skip auto-detection (needs external data)
        break;
      case 'explorer':
        // Checked externally; requirement tracked via unique programs
        break;
      case 'unstoppable':
        earned = state.currentStreak >= achievement.requirement;
        break;
      case 'legendary':
        earned = state.level >= achievement.requirement;
        break;
    }

    if (earned) {
      achievement.unlockedAt = now;
      newly.push({ ...achievement });
    }
  }

  return newly;
}

// ---------------------------------------------------------------------------
// Local Storage
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'gymquest-gamification';

function createDefaultState(): GamificationState {
  return {
    xp: 0,
    level: 0,
    title: 'Nybörjare',
    currentStreak: 0,
    longestStreak: 0,
    lastWorkoutDate: null,
    totalWorkouts: 0,
    totalCheckins: 0,
    achievements: getDefaultAchievements(),
    personalRecords: [],
  };
}

export function loadGamificationState(): GamificationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    return JSON.parse(raw) as GamificationState;
  } catch {
    return createDefaultState();
  }
}

export function saveGamificationState(state: GamificationState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addXP(
  state: GamificationState,
  event: XPEvent,
): GamificationState {
  const newXP = state.xp + event.amount;
  const { level, title } = calculateLevel(newXP);

  const updated: GamificationState = {
    ...state,
    xp: newXP,
    level,
    title,
  };

  // Check for newly unlocked achievements after XP/level update
  checkAchievements(updated);

  saveGamificationState(updated);
  return updated;
}
