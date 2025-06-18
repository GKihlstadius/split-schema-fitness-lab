-- Gym Janne Database Setup för Supabase
-- Kör denna SQL i Supabase SQL Editor

-- ========================================
-- 1. SKAPA TABELLER
-- ========================================

-- Användarinställningar-tabell
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  settings JSONB DEFAULT '{}' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Sparade träningsprogram-tabell
CREATE TABLE IF NOT EXISTS saved_workout_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  program_id TEXT NOT NULL,
  program_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Måltidsplaner-tabell
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  meals JSONB DEFAULT '[]' NOT NULL,
  calories_per_day INTEGER,
  protein_per_day INTEGER,
  carbs_per_day INTEGER,
  fat_per_day INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Träningshistorik-tabell
CREATE TABLE IF NOT EXISTS workout_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  program_id TEXT NOT NULL,
  program_name TEXT NOT NULL,
  exercises JSONB DEFAULT '[]' NOT NULL,
  duration_minutes INTEGER,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Måltidshistorik-tabell
CREATE TABLE IF NOT EXISTS meal_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_name TEXT NOT NULL,
  foods JSONB DEFAULT '[]' NOT NULL,
  total_calories INTEGER,
  total_protein DECIMAL(10,2),
  total_carbs DECIMAL(10,2),
  total_fat DECIMAL(10,2),
  meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  consumed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Viktspårning-tabell
CREATE TABLE IF NOT EXISTS weight_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight_kg DECIMAL(5,2) NOT NULL,
  body_fat_percentage DECIMAL(4,1),
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Mål och framsteg-tabell
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_type VARCHAR(30) NOT NULL CHECK (goal_type IN ('weight_loss', 'weight_gain', 'muscle_gain', 'strength', 'endurance', 'general_fitness')),
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2),
  unit VARCHAR(10),
  target_date DATE,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Användaranpassningar av träningsprogram-tabell
CREATE TABLE IF NOT EXISTS user_workout_customizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  program_name TEXT NOT NULL,
  day TEXT NOT NULL,
  exercises JSONB DEFAULT '[]' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, program_name, day)
);

-- Träningslogg-tabell
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

-- ========================================
-- 2. AKTIVERA ROW LEVEL SECURITY (RLS)
-- ========================================

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workout_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 3. TA BORT BEFINTLIGA POLICIES
-- ========================================

-- user_settings policies
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can delete own settings" ON user_settings;

-- saved_workout_programs policies
DROP POLICY IF EXISTS "Users can view own workout programs" ON saved_workout_programs;
DROP POLICY IF EXISTS "Users can insert own workout programs" ON saved_workout_programs;
DROP POLICY IF EXISTS "Users can update own workout programs" ON saved_workout_programs;
DROP POLICY IF EXISTS "Users can delete own workout programs" ON saved_workout_programs;

-- meal_plans policies
DROP POLICY IF EXISTS "Users can view own meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Users can insert own meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Users can update own meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Users can delete own meal plans" ON meal_plans;

-- workout_history policies
DROP POLICY IF EXISTS "Users can view own workout history" ON workout_history;
DROP POLICY IF EXISTS "Users can insert own workout history" ON workout_history;
DROP POLICY IF EXISTS "Users can update own workout history" ON workout_history;
DROP POLICY IF EXISTS "Users can delete own workout history" ON workout_history;

-- meal_history policies
DROP POLICY IF EXISTS "Users can view own meal history" ON meal_history;
DROP POLICY IF EXISTS "Users can insert own meal history" ON meal_history;
DROP POLICY IF EXISTS "Users can update own meal history" ON meal_history;
DROP POLICY IF EXISTS "Users can delete own meal history" ON meal_history;

-- weight_tracking policies
DROP POLICY IF EXISTS "Users can view own weight tracking" ON weight_tracking;
DROP POLICY IF EXISTS "Users can insert own weight tracking" ON weight_tracking;
DROP POLICY IF EXISTS "Users can update own weight tracking" ON weight_tracking;
DROP POLICY IF EXISTS "Users can delete own weight tracking" ON weight_tracking;

-- user_goals policies
DROP POLICY IF EXISTS "Users can view own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can update own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON user_goals;

-- user_workout_customizations policies
DROP POLICY IF EXISTS "Users can view own workout customizations" ON user_workout_customizations;
DROP POLICY IF EXISTS "Users can insert own workout customizations" ON user_workout_customizations;
DROP POLICY IF EXISTS "Users can update own workout customizations" ON user_workout_customizations;
DROP POLICY IF EXISTS "Users can delete own workout customizations" ON user_workout_customizations;

-- workout_logs policies
DROP POLICY IF EXISTS "Users can view own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can insert own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can update own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can delete own workout logs" ON workout_logs;

-- ========================================
-- 4. SKAPA RLS POLICIES
-- ========================================

-- user_settings policies
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

-- saved_workout_programs policies
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

-- meal_plans policies
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

-- workout_history policies
CREATE POLICY "Users can view own workout history" 
ON workout_history FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout history" 
ON workout_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout history" 
ON workout_history FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout history" 
ON workout_history FOR DELETE 
USING (auth.uid() = user_id);

-- meal_history policies
CREATE POLICY "Users can view own meal history" 
ON meal_history FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal history" 
ON meal_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal history" 
ON meal_history FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal history" 
ON meal_history FOR DELETE 
USING (auth.uid() = user_id);

-- weight_tracking policies
CREATE POLICY "Users can view own weight tracking" 
ON weight_tracking FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight tracking" 
ON weight_tracking FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight tracking" 
ON weight_tracking FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight tracking" 
ON weight_tracking FOR DELETE 
USING (auth.uid() = user_id);

-- user_goals policies
CREATE POLICY "Users can view own goals" 
ON user_goals FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" 
ON user_goals FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" 
ON user_goals FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" 
ON user_goals FOR DELETE 
USING (auth.uid() = user_id);

-- user_workout_customizations policies
CREATE POLICY "Users can view own workout customizations" 
ON user_workout_customizations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout customizations" 
ON user_workout_customizations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout customizations" 
ON user_workout_customizations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout customizations" 
ON user_workout_customizations FOR DELETE 
USING (auth.uid() = user_id);

-- workout_logs policies
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

-- ========================================
-- 5. SKAPA FUNCTIONS OCH TRIGGERS
-- ========================================

-- Function för att automatiskt uppdatera updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ta bort befintliga triggers
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
DROP TRIGGER IF EXISTS update_saved_workout_programs_updated_at ON saved_workout_programs;
DROP TRIGGER IF EXISTS update_meal_plans_updated_at ON meal_plans;
DROP TRIGGER IF EXISTS update_user_goals_updated_at ON user_goals;
DROP TRIGGER IF EXISTS update_user_workout_customizations_updated_at ON user_workout_customizations;
DROP TRIGGER IF EXISTS update_workout_logs_updated_at ON workout_logs;

-- Skapa triggers för updated_at
CREATE TRIGGER update_user_settings_updated_at 
BEFORE UPDATE ON user_settings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_workout_programs_updated_at 
BEFORE UPDATE ON saved_workout_programs 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at 
BEFORE UPDATE ON meal_plans 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at 
BEFORE UPDATE ON user_goals 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_workout_customizations_updated_at 
BEFORE UPDATE ON user_workout_customizations 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_logs_updated_at 
BEFORE UPDATE ON workout_logs 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 6. SKAPA INDEXER FÖR PRESTANDA
-- ========================================

-- user_settings indexer
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- saved_workout_programs indexer
CREATE INDEX IF NOT EXISTS idx_saved_workout_programs_user_id ON saved_workout_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_workout_programs_is_active ON saved_workout_programs(user_id, is_active);

-- meal_plans indexer
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_created_at ON meal_plans(user_id, created_at);

-- workout_history indexer
CREATE INDEX IF NOT EXISTS idx_workout_history_user_id ON workout_history(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_history_completed_at ON workout_history(user_id, completed_at);

-- meal_history indexer
CREATE INDEX IF NOT EXISTS idx_meal_history_user_id ON meal_history(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_history_consumed_at ON meal_history(user_id, consumed_at);
CREATE INDEX IF NOT EXISTS idx_meal_history_meal_type ON meal_history(user_id, meal_type);

-- weight_tracking indexer
CREATE INDEX IF NOT EXISTS idx_weight_tracking_user_id ON weight_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_tracking_recorded_at ON weight_tracking(user_id, recorded_at);

-- user_goals indexer
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_is_active ON user_goals(user_id, is_active);

-- user_workout_customizations indexer
CREATE INDEX IF NOT EXISTS idx_user_workout_customizations_user_id ON user_workout_customizations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workout_customizations_program_day ON user_workout_customizations(user_id, program_name, day);

-- workout_logs indexer
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_date ON workout_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_workout_logs_program_day ON workout_logs(user_id, program_name, day, date);

-- ========================================
-- 7. VERIFIERING
-- ========================================

-- Visa alla skapade tabeller
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename IN (
    'user_settings', 
    'saved_workout_programs', 
    'meal_plans', 
    'workout_history', 
    'meal_history', 
    'weight_tracking', 
    'user_goals',
    'user_workout_customizations',
    'workout_logs'
)
ORDER BY tablename;

-- Visa alla RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN (
    'user_settings', 
    'saved_workout_programs', 
    'meal_plans', 
    'workout_history', 
    'meal_history', 
    'weight_tracking', 
    'user_goals',
    'user_workout_customizations',
    'workout_logs'
)
ORDER BY tablename, policyname;

-- Bekräftelsemeddelande
DO $$
BEGIN
    RAISE NOTICE '✅ Gym Janne databas-setup komplett!';
    RAISE NOTICE '📊 Skapade tabeller: 9';
    RAISE NOTICE '🔒 RLS aktiverat på alla tabeller';
    RAISE NOTICE '🛡️ Policies skapade för alla tabeller';
    RAISE NOTICE '⚡ Indexer skapade för prestanda';
    RAISE NOTICE '🔄 Auto-update triggers aktiverade';
END $$; 