# GymQuest - Ultimate Gym App Redesign

## Vision
Transform the existing fitness app into **GymQuest** - a gamified gym companion that rewards consistency through geo-based check-ins, XP progression, achievements, and streaks. Inspired by Cal AI's clean, minimal dark design.

## Core Features

### 1. Geo-Based Gym Check-In (Pokemon Go Style)
- User saves their gym location(s) in settings
- When within ~100m of saved gym, a "Check In" button pulses
- Check-in awards XP and counts toward streak
- Uses browser Geolocation API (already a PWA)
- No continuous tracking - only checks on user action

### 2. XP & Leveling System
- **Check-in XP**: 50 XP per gym visit
- **Workout completion XP**: 100-300 XP based on volume
- **Streak bonus**: Multiplier (1.5x at 7 days, 2x at 30 days, 3x at 90 days)
- **PR bonus**: 200 XP for personal records
- **Levels**: 1-100, exponential curve (Level 1 = 0 XP, Level 100 = 1M XP)
- **Titles**: Beginner (1-10), Dedicated (11-25), Warrior (26-50), Legend (51-75), Mythic (76-100)

### 3. Achievements & Badges
Categories:
- **Consistency**: First Check-in, 7-Day Streak, 30-Day Streak, 100 Workouts
- **Strength**: First PR, 100kg Bench, 140kg Squat, 180kg Deadlift (configurable)
- **Volume**: 1000 Total Sets, 10000 Total Reps
- **Explorer**: Try 5 Different Programs, Complete All Exercises in a Program
- **Social**: Share a Workout (future)

### 4. Streak System
- Daily streak counter on home screen (prominent)
- Calendar heat map showing workout days (like GitHub contributions)
- Rest days don't break streaks if within program schedule
- Visual fire/flame animation for active streaks

### 5. Cal AI-Inspired Design Overhaul
- **Dark mode primary** with deep blacks and subtle grays
- **Accent color**: Electric blue (#3B82F6) with glow effects
- **Typography**: Clean, large headers, tight spacing
- **Cards**: Subtle glass-morphism, thin borders
- **Bottom navigation**: 4 tabs (Home, Workouts, Progress, Profile)
- **Home screen**: Today's workout front and center, XP bar, streak counter
- **Animations**: Subtle slide-ins, XP gain popups, level-up celebrations

### 6. Redesigned Home Screen
```
┌─────────────────────────┐
│  Level 23 - Warrior     │
│  ████████░░ 2,340/3,000 │
│  🔥 12 Day Streak       │
├─────────────────────────┤
│  TODAY'S WORKOUT        │
│  ┌───────────────────┐  │
│  │ Push Day           │  │
│  │ Chest, Shoulders,  │  │
│  │ Triceps            │  │
│  │ 8 exercises        │  │
│  │ [START WORKOUT →]  │  │
│  └───────────────────┘  │
├─────────────────────────┤
│  RECENT ACHIEVEMENTS    │
│  🏆 PR: Bench 100kg    │
│  ⚡ 10-Day Streak       │
├─────────────────────────┤
│  📍 Gym: 350m away     │
│  [CHECK IN]             │
└─────────────────────────┘
│ 🏠  💪  📊  👤 │
└─────────────────────────┘
```

### 7. Progress Dashboard
- Weight progression charts (existing, enhanced)
- PR tracking per exercise
- Volume over time
- Workout frequency calendar (heat map)
- Body measurements over time

## Data Model Extensions

### New Supabase Tables
```sql
-- User gamification state
user_gamification (
  user_id UUID PRIMARY KEY,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_workout_date DATE,
  total_workouts INTEGER DEFAULT 0,
  total_checkins INTEGER DEFAULT 0
)

-- Achievement unlocks
user_achievements (
  id UUID PRIMARY KEY,
  user_id UUID,
  achievement_id TEXT,
  unlocked_at TIMESTAMP
)

-- Gym locations
user_gyms (
  id UUID PRIMARY KEY,
  user_id UUID,
  name TEXT,
  latitude DOUBLE,
  longitude DOUBLE,
  radius INTEGER DEFAULT 100
)

-- Check-in history
gym_checkins (
  id UUID PRIMARY KEY,
  user_id UUID,
  gym_id UUID,
  checked_in_at TIMESTAMP,
  xp_earned INTEGER
)

-- Personal records
personal_records (
  id UUID PRIMARY KEY,
  user_id UUID,
  exercise_name TEXT,
  weight DOUBLE,
  reps INTEGER,
  recorded_at TIMESTAMP
)
```

### Local Storage Fallback
All gamification data also stored locally for offline support, synced when online.

## Technical Approach
- Keep existing React + Vite + Supabase + Tailwind stack
- Keep all 12 existing workout programs
- Add new programs (Arnold Split, PHUL, nSuns)
- Redesign UI components with new dark theme
- Add gamification as a new layer (non-breaking)
- Geolocation via browser API
- Animations via CSS transitions + keyframes (no extra deps)

## What Stays
- All 12 workout programs
- Exercise database (500+ exercises)
- Supabase auth (email + Google)
- Workout logging
- PWA support
- Swedish language

## What Changes
- Complete UI redesign (dark, minimal, Cal AI style)
- New home screen with gamification
- Bottom tab navigation
- New progress dashboard
- Streak and XP system throughout

## What's New
- Geo check-in system
- XP & leveling
- Achievements
- Streak tracking with heat map
- PR tracking
- 3 new workout programs
