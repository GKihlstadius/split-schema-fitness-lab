-- Gym Janne Database Setup för Supabase (Kompatibel version)
-- Kör denna SQL i Supabase SQL Editor (https://app.supabase.com/project/fbyskrdytngsffllvwtk/sql)

-- 1. Skapa användarinställningar-tabell
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  settings JSONB DEFAULT '{}' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- 2. Skapa sparade träningsprogram-tabell
CREATE TABLE IF NOT EXISTS saved_workout_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  program_id TEXT NOT NULL,
  program_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Skapa måltidsplaner-tabell
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  meals JSONB DEFAULT '[]' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Skapa träningslogg-tabell
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  program_name TEXT NOT NULL,
  day TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  sets INTEGER NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  weight DECIMAL(5,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Aktivera Row Level Security (RLS) för alla tabeller
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- 6. Ta bort befintliga policies om de finns (ignorera fel)
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can delete own settings" ON user_settings;

DROP POLICY IF EXISTS "Users can view own workout programs" ON saved_workout_programs;
DROP POLICY IF EXISTS "Users can insert own workout programs" ON saved_workout_programs;
DROP POLICY IF EXISTS "Users can update own workout programs" ON saved_workout_programs;
DROP POLICY IF EXISTS "Users can delete own workout programs" ON saved_workout_programs;

DROP POLICY IF EXISTS "Users can view own meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Users can insert own meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Users can update own meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Users can delete own meal plans" ON meal_plans;

DROP POLICY IF EXISTS "Users can view own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can insert own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can update own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can delete own workout logs" ON workout_logs;

-- 7. Skapa RLS policies för user_settings
CREATE POLICY "Users can view own settings" 
ON user_settings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" 
ON user_settings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" 
ON user_settings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings" 
ON user_settings FOR DELETE 
USING (auth.uid() = user_id);

-- 8. Skapa RLS policies för saved_workout_programs
CREATE POLICY "Users can view own workout programs" 
ON saved_workout_programs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout programs" 
ON saved_workout_programs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout programs" 
ON saved_workout_programs FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout programs" 
ON saved_workout_programs FOR DELETE 
USING (auth.uid() = user_id);

-- 9. Skapa RLS policies för meal_plans
CREATE POLICY "Users can view own meal plans" 
ON meal_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans" 
ON meal_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans" 
ON meal_plans FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans" 
ON meal_plans FOR DELETE 
USING (auth.uid() = user_id);

-- 10. Skapa RLS policies för workout_logs
CREATE POLICY "Users can view own workout logs" 
ON workout_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout logs" 
ON workout_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout logs" 
ON workout_logs FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout logs" 
ON workout_logs FOR DELETE 
USING (auth.uid() = user_id);

-- 11. Skapa function för att automatiskt uppdatera updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. Ta bort befintliga triggers om de finns
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
DROP TRIGGER IF EXISTS update_workout_logs_updated_at ON workout_logs;

-- 13. Skapa triggers för updated_at
CREATE TRIGGER update_user_settings_updated_at 
BEFORE UPDATE ON user_settings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_logs_updated_at 
BEFORE UPDATE ON workout_logs 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. Skapa indexer för bättre prestanda
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_workout_programs_user_id ON saved_workout_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_workout_programs_is_active ON saved_workout_programs(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_created_at ON meal_plans(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_date ON workout_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_workout_logs_program_day ON workout_logs(user_id, program_name, day, date);

-- 15. Slutkörning: Visa tabeller som skapats
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename IN ('user_settings', 'saved_workout_programs', 'meal_plans', 'workout_logs')
ORDER BY tablename;

-- 16. Bekräfta att policies skapats
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('user_settings', 'saved_workout_programs', 'meal_plans', 'workout_logs')
ORDER BY tablename, policyname; 