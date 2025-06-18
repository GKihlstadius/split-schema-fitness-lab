import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface UserData {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  settings: Record<string, any>;
  savedPrograms: string[];
  mealPlans: any[];
}

// Logga in med Google
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
  
  return data;
};

// Registrera med e-post
export const signUpWithEmail = async (email: string, password: string) => {
  console.log('🔄 Supabase signup - börjar registrering för:', email);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log('📊 Supabase signup response:', { data, error });

    if (error) {
      console.error('❌ Supabase signup error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Supabase signup success:', data);
    return { success: true, data };
  } catch (networkError) {
    console.error('🌐 Network error under signup:', networkError);
    return { success: false, error: `Nätverksfel: ${networkError.message}` };
  }
};

// Logga in med e-post
export const signInWithEmail = async (email: string, password: string) => {
  console.log('🔄 Supabase signin - börjar inloggning för:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('📊 Supabase signin response:', { data, error });

    if (error) {
      console.error('❌ Supabase signin error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Supabase signin success:', data);
    return { success: true, data };
  } catch (networkError) {
    console.error('🌐 Network error under signin:', networkError);
    return { success: false, error: `Nätverksfel: ${networkError.message}` };
  }
};

// Logga ut
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Hämta nuvarande användare
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Kontrollera om användaren är inloggad
export const isLoggedIn = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Lyssna på auth state changes
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Hämta användarinställningar från Supabase
export const getUserSettings = async (userId: string): Promise<Record<string, any>> => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('settings')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching user settings:', error);
    return {};
  }

  return data?.settings || {};
};

// Spara användarinställningar till Supabase
export const saveUserSettings = async (userId: string, settings: Record<string, any>) => {
  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      settings,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
};

// Spara användarspecifik inställning
export const saveUserSetting = async (userId: string, key: string, value: any) => {
  const currentSettings = await getUserSettings(userId);
  const newSettings = { ...currentSettings, [key]: value };
  await saveUserSettings(userId, newSettings);
};

// Hämta användarspecifik inställning
export const getUserSetting = async (userId: string, key: string, defaultValue?: any): Promise<any> => {
  const settings = await getUserSettings(userId);
  return settings[key] ?? defaultValue;
};

// Spara träningsprogram
export const saveWorkoutProgram = async (userId: string, programId: string, programName: string) => {
  const { error } = await supabase
    .from('saved_workout_programs')
    .upsert({
      user_id: userId,
      program_id: programId,
      program_name: programName,
      is_active: true
    });

  if (error) {
    console.error('Error saving workout program:', error);
    throw error;
  }
};

// Hämta sparade träningsprogram
export const getSavedWorkoutPrograms = async (userId: string) => {
  const { data, error } = await supabase
    .from('saved_workout_programs')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching saved workout programs:', error);
    return [];
  }

  return data || [];
};

// Spara måltidsplan
export const saveMealPlan = async (userId: string, name: string, meals: any[]) => {
  const { error } = await supabase
    .from('meal_plans')
    .insert({
      user_id: userId,
      name,
      meals
    });

  if (error) {
    console.error('Error saving meal plan:', error);
    throw error;
  }
};

// Hämta sparade måltidsplaner
export const getSavedMealPlans = async (userId: string) => {
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching saved meal plans:', error);
    return [];
  }

  return data || [];
}; 