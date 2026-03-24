import { supabase, getRedirectUrl } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

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
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    // Om registrering lyckades
    if (data.user) {
      return {
        success: true,
        user: data.user,
      };
    }

    return { success: false, error: 'Okänt fel vid registrering' };
  } catch (error) {
    console.error('Unexpected error in signUpWithEmail:', error);
    return {
      success: false,
      error: error.message || 'Ett oväntat fel uppstod'
    };
  }
};

// Logga in med e-post
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }

    if (data.user && data.session) {
      return { 
        success: true, 
        user: data.user, 
        session: data.session 
      };
    }

    return { success: false, error: 'Okänt fel vid inloggning' };
  } catch (error) {
    console.error('Unexpected error in signInWithEmail:', error);
    return { 
      success: false, 
      error: error.message || 'Ett oväntat fel uppstod' 
    };
  }
};



// Återställ lösenord
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Error resetting password:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in resetPassword:', error);
    return { 
      success: false, 
      error: error.message || 'Ett oväntat fel uppstod' 
    };
  }
};

// Uppdatera lösenord (använd efter reset)
export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('Error updating password:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (networkError) {
    console.error('Network error during password update:', networkError);
    return { success: false, error: `Nätverksfel: ${networkError.message}` };
  }
};

// Logga ut
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in signOut:', error);
    return { 
      success: false, 
      error: error.message || 'Ett oväntat fel uppstod' 
    };
  }
};

// Hämta nuvarande användare
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error fetching user:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Unexpected error in getCurrentUser:', error);
    return { 
      success: false, 
      error: error.message || 'Ett oväntat fel uppstod' 
    };
  }
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
      console.error('Error saving user settings:', error);
      
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
  } catch (networkError: any) {
    console.error('Network error saving user settings:', networkError);
    
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