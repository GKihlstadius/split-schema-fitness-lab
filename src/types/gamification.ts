export interface GamificationState {
  xp: number;
  level: number;
  title: string;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  totalWorkouts: number;
  totalCheckins: number;
  achievements: Achievement[];
  personalRecords: PersonalRecord[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'consistency' | 'strength' | 'volume' | 'explorer';
  requirement: number;
  unlockedAt: string | null;
}

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  weight: number;
  reps: number;
  recordedAt: string;
}

export interface GymLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // meters
}

export interface CheckIn {
  id: string;
  gymId: string;
  checkedInAt: string;
  xpEarned: number;
}

export interface XPEvent {
  type: 'checkin' | 'workout' | 'streak_bonus' | 'pr' | 'achievement';
  amount: number;
  description: string;
  timestamp: string;
}
