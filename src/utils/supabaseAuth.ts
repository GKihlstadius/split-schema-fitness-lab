import { supabase, getRedirectUrl } from '@/lib/supabase';
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
      redirectTo: getRedirectUrl('/auth/callback')
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

// Återställ lösenord
export const resetPassword = async (email: string) => {
  console.log('🔄 Supabase password reset - skickar mail till:', email);
  
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getRedirectUrl('/auth/reset-password')
    });

    console.log('📊 Supabase reset password response:', { data, error });

    if (error) {
      console.error('❌ Supabase reset password error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Supabase reset password mail skickat');
    return { success: true, data };
  } catch (networkError) {
    console.error('🌐 Network error under password reset:', networkError);
    return { success: false, error: `Nätverksfel: ${networkError.message}` };
  }
};

// Uppdatera lösenord (använd efter reset)
export const updatePassword = async (newPassword: string) => {
  console.log('🔄 Supabase update password');
  
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    console.log('📊 Supabase update password response:', { data, error });

    if (error) {
      console.error('❌ Supabase update password error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Supabase lösenord uppdaterat');
    return { success: true, data };
  } catch (networkError) {
    console.error('🌐 Network error under password update:', networkError);
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
  console.log('🔄 Försöker spara användarinställningar till Supabase för user:', userId);
  
  try {
    // Först försök upsert (create or update)
    let { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        settings,
        updated_at: new Date().toISOString()
      });

    // Om det är duplicate key constraint fel, försök bara uppdatera istället
    if (error && error.code === '23505') {
      console.log('🔄 Duplicate key constraint, försöker bara uppdatera befintlig rad...');
      
      const updateResult = await supabase
        .from('user_settings')
        .update({
          settings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
        
      error = updateResult.error;
    }

    if (error) {
      console.error('❌ Supabase fel vid sparning av användarinställningar:', error);
      console.error('📊 Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // Specifika felmeddelanden baserat på felkod
      if (error.code === '42P01') {
        throw new Error('Tabellen user_settings existerar inte i databasen. Databasen behöver konfigureras.');
      } else if (error.code === 'PGRST301') {
        throw new Error('Åtkomst nekad till user_settings tabellen. Kontrollera RLS policies.');
      } else if (error.code === '23505') {
        throw new Error('Dublettsparning problem. Försök igen eller kontakta admin.');
      } else if (error.message.includes('JWT')) {
        throw new Error('Autentisering misslyckades. Logga in igen.');
      } else {
        throw new Error(`Databasfel: ${error.message}`);
      }
    }
    
    console.log('✅ Användarinställningar sparade till Supabase!');
  } catch (networkError: any) {
    console.error('🌐 Nätverksfel vid sparning av användarinställningar:', networkError);
    
    if (networkError.message?.includes('user_settings') || networkError.message?.includes('Databasfel')) {
      // Re-throw specifika felmeddelanden
      throw networkError;
    } else {
      throw new Error(`Anslutningsfel till molnet: ${networkError.message}`);
    }
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