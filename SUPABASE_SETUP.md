# Supabase Setup Guide för Gym Janne

## 1. Skapa Supabase-projekt

1. Gå till [Supabase](https://supabase.com) och skapa ett konto
2. Skapa ett nytt projekt
3. Vänta tills projektet är klart (detta kan ta några minuter)

## 2. Konfigurera miljövariabler

1. Kopiera `.env.example` till `.env`
2. Hämta dina Supabase-uppgifter från **Settings > API** i Supabase Dashboard
3. Fyll i `.env`-filen:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Skapa databastabeller

Kör följande SQL i Supabase SQL Editor:

```sql
-- Skapa användarinställningar-tabell
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Skapa sparade träningsprogram-tabell
CREATE TABLE saved_workout_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  program_id TEXT NOT NULL,
  program_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skapa måltidsplaner-tabell
CREATE TABLE meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  meals JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lägg till RLS (Row Level Security)
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Skapa policies för användarspecifik data
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own workout programs" ON saved_workout_programs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workout programs" ON saved_workout_programs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workout programs" ON saved_workout_programs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own meal plans" ON meal_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meal plans" ON meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meal plans" ON meal_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meal plans" ON meal_plans FOR DELETE USING (auth.uid() = user_id);
```

## 4. Konfigurera Google OAuth

1. Gå till **Authentication > Providers** i Supabase Dashboard
2. Aktivera Google Provider
3. Skapa ett Google OAuth-projekt:
   - Gå till [Google Cloud Console](https://console.cloud.google.com/)
   - Skapa ett nytt projekt eller välj ett befintligt
   - Aktivera Google+ API
   - Skapa OAuth 2.0-credentials
   - Lägg till din Supabase callback URL: `https://your-project-id.supabase.co/auth/v1/callback`
4. Kopiera Client ID och Client Secret till Supabase
5. Spara konfigurationen

## 5. Testa integrationen

1. Starta utvecklingsservern: `npm run dev`
2. Navigera till inloggningssidan
3. Klicka "Fortsätt med Google"
4. Logga in med ditt Google-konto
5. Du bör omdirigeras tillbaka till appen som inloggad

## 6. Fördelar med denna setup

✅ **Permanent datalagring** - All data sparas säkert i molnet
✅ **Synkronisering** - Data synkroniseras mellan alla enheter
✅ **Säkerhet** - Google OAuth + Row Level Security
✅ **Skalbarhet** - Supabase hanterar automatisk skalning
✅ **Backup** - Automatiska säkerhetskopior
✅ **Prestanda** - Snabb global CDN

## Troubleshooting

### Problem: "Invalid OAuth state"
- Kontrollera att callback URL:en är korrekt konfigurerad i Google Console
- Se till att Supabase URL:en i .env-filen är korrekt

### Problem: "CORS error"
- Lägg till din domän i Supabase Authentication Settings under "Site URL"

### Problem: "Database error"
- Kontrollera att alla tabeller är skapade korrekt
- Verifiera att RLS policies är aktiverade

## Support

För support, kontakta Supabase-dokumentationen eller skapa en issue i detta repo. 