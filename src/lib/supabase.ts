import { createClient } from '@supabase/supabase-js'

// Dessa värden kommer från din Supabase-projektinställningar
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Debug: Kontrollera att miljövariablerna laddas
console.log('🔧 Supabase config:', {
  url: supabaseUrl,
  keyPrefix: supabaseAnonKey.substring(0, 20) + '...',
  hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
  hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SavedWorkoutProgram {
  id: string;
  user_id: string;
  program_id: string;
  program_name: string;
  is_active: boolean;
  created_at: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  name: string;
  meals: any[];
  created_at: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  program_name: string;
  day: string;
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  program_name: string;
  day: string;
  date: string;
  completed: boolean;
  exercises: WorkoutLog[];
  created_at: string;
  updated_at: string;
}

export interface UserWorkoutCustomization {
  id: string;
  user_id: string;
  program_name: string;
  day: string;
  exercises: any[];
  created_at: string;
  updated_at: string;
} 