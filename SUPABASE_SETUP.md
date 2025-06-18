# 🔧 Supabase Setup & Molnsynkronisering

## Problem: "Profil sparad lokalt (molnsynk kommer senare)"

Om du ser meddelanden som **"Profil sparad lokalt"** eller **"Sparad lokalt ⚠️"** betyder det att molnsynkroniseringen inte fungerar och all data sparas bara lokalt i din webbläsare.

## 🎯 Snabb Fix

### 1. Skapa Supabase-projekt
1. Gå till [supabase.com](https://supabase.com)
2. Skapa gratis konto
3. Klicka "New Project"
4. Välj organisation och namnge projektet (t.ex. "fitness-lab")
5. Vänta 2-3 minuter medan projektet skapas

### 2. Hämta API-nycklar
1. Gå till ditt projekt på Supabase
2. Klicka **Settings** → **API**
3. Kopiera:
   - **Project URL** (ser ut som: `https://abc123def.supabase.co`)
   - **anon/public key** (lång sträng som börjar med `eyJ...`)

### 3. Konfigurera applikationen

Skapa en `.env` fil i projektets rot-mapp med:

```env
# Ersätt med dina riktiga värden från Supabase
VITE_SUPABASE_URL=https://ditt-projekt-id.supabase.co
VITE_SUPABASE_ANON_KEY=ditt-anon-key-här
```

### 4. Skapa databastabeller

Kör detta SQL i Supabase SQL Editor:

1. Öppna filen `database-setup.sql` i ditt projekt
2. Kopiera allt innehåll 
3. Gå till ditt Supabase projekt → SQL Editor
4. Klistra in och kör SQL-koden
5. Bekräfta att alla 9 tabeller skapats

**Viktigt:** Om du redan har kört en äldre version av setup och saknar vissa tabeller (som `workout_logs`), kör då den uppdaterade `database-setup.sql` filen igen. Den är designad för att säkert lägga till saknade tabeller utan att påverka befintlig data.

**Snabb alternativ:** Du kan använda `supabase-setup-fixed.sql` för enkel setup med de mest kritiska tabellerna.

### 5. Starta om utvecklingsservern

```bash
npm run dev
```

## ✅ Verifiering

När allt fungerar ska du se:
- **"Profil uppdaterad i molnet! ✅"** när du sparar profilen
- **"Ändringar sparade! ✅"** när du sparar träningsändringar

## 🆘 Felsökning

### Problemet kvarstår?

1. **Kontrollera .env-filen** - Den måste heta exakt `.env` (inte `.env.txt`)
2. **Starta om servern** - Ctrl+C och kör `npm run dev` igen
3. **Kontrollera URL:en** - Den ska vara din riktiga Supabase URL
4. **Kontrollera nyckeln** - Den ska vara din riktiga anon key
5. **Kolla konsolen** - Öppna F12 och se om det finns fler felmeddelanden

### Vanliga fel:

**❌ "Invalid API key"**
- Din VITE_SUPABASE_ANON_KEY är fel eller saknas

**❌ "Failed to fetch"** 
- Din VITE_SUPABASE_URL är fel eller saknas

**❌ "Table doesn't exist"** eller **"Tabellen user_settings existerar inte"**
- Du har inte kört database-setup.sql än
- Eller du kör en gammal databas som saknar vissa tabeller

**❌ "Databasen saknar nödvändiga tabeller"**
- Kör den uppdaterade database-setup.sql filen igen

**❌ "duplicate key value violates unique constraint"**
- Det finns dublettdata i databasen
- Kör `fix-user-settings-duplicates.sql` i Supabase SQL Editor

### Kontakta support

Om problem kvarstår, inkludera detta i din buggrapport:
1. Meddelandet du ser när du sparar
2. Eventuella fel i utvecklarkonsolen (F12)
3. Om .env-filen existerar och har rätt format

## 🔐 Säkerhet

- Lägg **aldrig** till .env-filen i Git
- Använd bara anon/public nyckeln (inte service role key)
- Supabase Row Level Security (RLS) skyddar användardata automatiskt

---

**💡 Tips:** Applikationen fungerar fullt ut även utan molnsynkronisering - all data sparas säkert i din webbläsare. Molnsynkronisering är bara en bonus för att komma åt data från flera enheter. 