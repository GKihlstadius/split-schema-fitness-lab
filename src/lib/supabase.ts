import { createClient } from '@supabase/supabase-js'

// Dessa värden kommer från din Supabase-projektinställningar
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL och API-nyckel måste vara definierade i .env-filen');
}



// Hjälpfunktion för att få rätt redirect URL baserat på miljö
export const getRedirectUrl = (path: string): string => {
  // Hämta base URL från window.location
  const baseUrl = window.location.origin;
  
  // Returnera fullständig URL
  return `${baseUrl}${path}`;
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

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