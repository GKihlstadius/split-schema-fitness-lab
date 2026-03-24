import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  getCurrentUser,
  getUserSettings,
  saveUserSettings,
  signOut
} from '@/utils/supabaseAuth';
import {
  User,
  Mail,
  Calendar,
  Users,
  Settings,
  Trash2,
  Target,
  Activity,
  Heart,
  TrendingUp,
  Scale,
  Utensils,
  Dumbbell,
  Award,
  Calculator,
  MapPin,
  Plus,
  Loader2,
  LogOut
} from 'lucide-react';
import { loadGymLocations, removeGymLocation, saveCurrentLocationAsGym } from '@/utils/geolocation';
import type { GymLocation } from '@/types/gamification';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { WorkoutLogHistory } from '@/components/WorkoutLogHistory';

// Typer för personlig data
interface PersonalInfo {
  age?: number;
  height?: number;
  weight?: number;
  bodyFat?: number;
  activityLevel?: string;
  fitnessLevel?: string;
}

interface FitnessGoals {
  primaryGoal?: string;
  targetWeight?: number;
  targetBodyFat?: number;
  weeklyWorkouts?: number;
  preferredWorkoutTypes?: string[];
}

interface NutritionGoals {
  dailyCalories?: number;
  dailyProtein?: number;
  dailyCarbs?: number;
  dailyFat?: number;
  dietType?: string;
  allergies?: string[];
  dislikes?: string[];
}

interface Preferences {
  workoutReminders?: boolean;
  mealReminders?: boolean;
  progressTracking?: boolean;
  publicProfile?: boolean;
}

// Gym Location Manager sub-component
const GymLocationManager = () => {
  const [gyms, setGyms] = useState<GymLocation[]>([]);
  const [newGymName, setNewGymName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setGyms(loadGymLocations());
  }, []);

  const handleAddCurrentLocation = async () => {
    if (!newGymName.trim()) return;
    setSaving(true);
    try {
      const gym = await saveCurrentLocationAsGym(newGymName.trim());
      setGyms(prev => [...prev, gym]);
      setNewGymName('');
    } catch (err: any) {
      // Silently handle gym location save errors
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveGym = (id: string) => {
    removeGymLocation(id);
    setGyms(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-4">
      <Card className="border-white/10 bg-white/5 rounded-2xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="h-5 w-5 text-blue-400" />
            Mina Gym
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Spara ditt gyms position för att kunna checka in och tjäna XP när du är där.
          </p>

          {/* Add gym form */}
          <div className="flex gap-2">
            <Input
              placeholder="Gymmets namn, t.ex. 'Nordic Wellness'"
              value={newGymName}
              onChange={(e) => setNewGymName(e.target.value)}
              className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleAddCurrentLocation}
              disabled={saving || !newGymName.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap rounded-xl"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
              {saving ? 'Sparar...' : 'Spara position'}
            </Button>
          </div>

          {/* Saved gyms list */}
          {gyms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Inga gym sparade ännu</p>
              <p className="text-xs mt-1">Gå till ditt gym och spara positionen här</p>
            </div>
          ) : (
            <div className="space-y-2">
              {gyms.map(gym => (
                <div key={gym.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{gym.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Radie: {gym.radius}m
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveGym(gym.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('account');

  // Formulärdata för olika sektioner
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({});
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoals>({});
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>({});
  const [preferences, setPreferences] = useState<Preferences>({});

  const navigate = useNavigate();

  // Aktivitetsnivåer och andra alternativ
  const activityLevels = {
    sedentary: "Stillasittande (kontorsarbete, lite motion)",
    light: "Lätt aktiv (lätt träning 1-3 dagar/vecka)",
    moderate: "Måttligt aktiv (måttlig träning 3-5 dagar/vecka)",
    active: "Mycket aktiv (intensiv träning 6-7 dagar/vecka)",
    veryActive: "Extremt aktiv (fysiskt krävande jobb + träning)"
  };

  const fitnessLevels = {
    beginner: "Nybörjare (0-6 månader träning)",
    intermediate: "Medel (6 månader - 2 år)",
    advanced: "Avancerad (2+ år regelbunden träning)"
  };

  const primaryGoals = {
    lose_weight: "Gå ner i vikt",
    gain_weight: "Gå upp i vikt",
    build_muscle: "Bygga muskler",
    get_stronger: "Bli starkare",
    improve_endurance: "Förbättra kondition",
    maintain: "Behålla nuvarande form",
    general_fitness: "Allmän hälsa och välmående"
  };

  const dietTypes = {
    standard: "Standard",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    keto: "Ketogen",
    paleo: "Paleo",
    mediterranean: "Medelhavsdieten",
    intermittent_fasting: "Intermittent fasting",
    custom: "Anpassad"
  };

  const workoutTypes = [
    "Styrketräning",
    "Kardio",
    "HIIT",
    "Yoga",
    "Löpning",
    "Cykling",
    "Simning",
    "Crossfit",
    "Boxning",
    "Dans"
  ];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const result = await getCurrentUser();

        if (!result.success || !result.user) {
          navigate('/login');
          return;
        }

        setCurrentUser(result.user);

        let settings: any = {};

        try {
          settings = await getUserSettings(result.user.id);
        } catch (supabaseError) {
          const localData = localStorage.getItem(`profile_${result.user.id}`);
          if (localData) {
            settings = JSON.parse(localData);
          }
        }

        setPersonalInfo(settings.personalInfo || {});
        setFitnessGoals(settings.fitnessGoals || {});
        setNutritionGoals(settings.nutritionGoals || {});
        setPreferences(settings.preferences || {
          workoutReminders: true,
          mealReminders: true,
          progressTracking: true,
          publicProfile: false
        });
      } catch (error) {
        setError('Kunde inte ladda användardata');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  // Beräkna BMI
  const calculateBMI = (): number | null => {
    if (personalInfo.height && personalInfo.weight) {
      const heightInM = personalInfo.height / 100;
      return Number((personalInfo.weight / (heightInM * heightInM)).toFixed(1));
    }
    return null;
  };

  // Beräkna BMR (Basal Metabolic Rate) med Hormozi-baserad formel
  const calculateBMR = (): number | null => {
    if (personalInfo.weight) {
      const weightInPounds = personalInfo.weight * 2.20462;
      return Math.round(weightInPounds * 12);
    }
    return null;
  };

  // Beräkna rekommenderade dagliga kalorier baserat på Hormozi-modellen
  const calculateHormoziCalories = (): number | null => {
    if (!personalInfo.weight || !personalInfo.activityLevel) return null;

    const weightInPounds = personalInfo.weight * 2.20462;
    const multipliers = {
      sedentary: 12,
      light: 13,
      moderate: 14,
      active: 15,
      veryActive: 16
    };

    const multiplier = multipliers[personalInfo.activityLevel as keyof typeof multipliers] || 14;
    return Math.round(weightInPounds * multiplier);
  };

  // Synka med kalorieuträknaren
  const syncWithCalorieCalculator = () => {
    const hormoziCalories = calculateHormoziCalories();
    if (hormoziCalories && personalInfo.weight) {
      const weightInPounds = personalInfo.weight * 2.20462;
      const protein = Math.round(weightInPounds * 1);
      const fat = Math.round(weightInPounds * 0.3);
      const carbs = Math.round((hormoziCalories - (protein * 4) - (fat * 9)) / 4);

      setNutritionGoals(prev => ({
        ...prev,
        dailyCalories: hormoziCalories,
        dailyProtein: protein,
        dailyCarbs: Math.max(0, carbs),
        dailyFat: fat
      }));

      setMessage('Näringsvärden synkade med Hormozi-kalorieuträknaren!');
    }
  };

  const handleSave = async () => {
    setError('');
    setMessage('');

    try {
      if (!currentUser) {
        setError('Ingen användare inloggad');
        return;
      }

      const allSettings = {
        personalInfo,
        fitnessGoals,
        nutritionGoals,
        preferences
      };

      try {
        await saveUserSettings(currentUser.id, allSettings);
        setMessage('Profil uppdaterad i molnet!');
      } catch (supabaseError: any) {
        localStorage.setItem(`profile_${currentUser.id}`, JSON.stringify(allSettings));

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        let errorMessage = '';

        if (!supabaseUrl || supabaseUrl.includes('your-project') || !supabaseKey || supabaseKey.includes('your-anon-key')) {
          errorMessage = 'Profil sparad lokalt. Molnsynkronisering är inte konfigurerad än. Kontakta admin för att aktivera molnsparning.';
        } else if (supabaseError.message?.includes('user_settings existerar inte')) {
          errorMessage = 'Profil sparad lokalt. Databasen saknar nödvändiga tabeller. Kontakta admin för att köra databas-setup.';
        } else if (supabaseError.message?.includes('Åtkomst nekad')) {
          errorMessage = 'Profil sparad lokalt. Säkerhetsinställningar blockerar molnsparning. Kontakta admin.';
        } else if (supabaseError.message?.includes('Autentisering misslyckades')) {
          errorMessage = 'Profil sparad lokalt. Din inloggning har gått ut. Logga in igen för molnsparning.';
        } else if (supabaseError.message?.includes('Dublettsparning problem')) {
          errorMessage = 'Profil sparad lokalt. Molndatabasen har dublettdata. Försök igen eller kontakta admin.';
        } else {
          errorMessage = `Profil sparad lokalt. Molnfel: ${supabaseError.message}`;
        }

        setMessage(errorMessage);
      }
    } catch (error) {
      setError('Kunde inte spara profilen. Försök igen.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        navigate('/login');
      } else {
        setError('Kunde inte logga ut. Försök igen.');
      }
    } catch (error) {
      setError('Kunde inte logga ut. Försök igen.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Beräkna framsteg mot mål
  const calculateGoalProgress = () => {
    if (!personalInfo.weight || !fitnessGoals.targetWeight) return 0;

    const currentWeight = personalInfo.weight;
    const targetWeight = fitnessGoals.targetWeight;
    const startWeight = currentWeight;

    if (fitnessGoals.primaryGoal === 'lose_weight') {
      const totalToLose = Math.abs(startWeight - targetWeight);
      const lost = Math.abs(startWeight - currentWeight);
      return Math.min(100, Math.round((lost / totalToLose) * 100));
    } else if (fitnessGoals.primaryGoal === 'gain_weight') {
      const totalToGain = Math.abs(targetWeight - startWeight);
      const gained = Math.abs(currentWeight - startWeight);
      return Math.min(100, Math.round((gained / totalToGain) * 100));
    }

    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] pb-24">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-muted-foreground">Laddar profil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] pb-24">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">Ingen användare inloggad</p>
            <p className="text-sm text-muted-foreground">Du omdirigeras till inloggningssidan...</p>
          </div>
        </div>
      </div>
    );
  }

  const bmi = calculateBMI();
  const bmr = calculateBMR();
  const hormoziCalories = calculateHormoziCalories();
  const goalProgress = calculateGoalProgress();

  // Get user initial for avatar
  const userInitial = currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-24">
      <div className="flex flex-col items-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-6xl space-y-6">

          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
              {userInitial}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Min Profil</h1>
              <p className="text-sm text-muted-foreground">Hantera dina inställningar och spåra dina framsteg</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white/5 border border-white/10 rounded-2xl p-1 grid w-full grid-cols-3 sm:grid-cols-6 gap-1 h-auto">
              <TabsTrigger value="account" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 text-muted-foreground text-xs sm:text-sm py-2">
                <User className="w-4 h-4 mr-1.5" />
                Konto
              </TabsTrigger>
              <TabsTrigger value="personal" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 text-muted-foreground text-xs sm:text-sm py-2">
                <Heart className="w-4 h-4 mr-1.5" />
                Personligt
              </TabsTrigger>
              <TabsTrigger value="fitness" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 text-muted-foreground text-xs sm:text-sm py-2">
                <Dumbbell className="w-4 h-4 mr-1.5" />
                Träning
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 text-muted-foreground text-xs sm:text-sm py-2">
                <Utensils className="w-4 h-4 mr-1.5" />
                Kost
              </TabsTrigger>
              <TabsTrigger value="stats" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 text-muted-foreground text-xs sm:text-sm py-2">
                <TrendingUp className="w-4 h-4 mr-1.5" />
                Statistik
              </TabsTrigger>
              <TabsTrigger value="gym" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 text-muted-foreground text-xs sm:text-sm py-2">
                <MapPin className="w-4 h-4 mr-1.5" />
                Gym
              </TabsTrigger>
            </TabsList>

            {/* Konto-tab */}
            <TabsContent value="account" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Grundlaggande kontoinformation */}
                <Card className="border-white/10 bg-white/5 rounded-2xl backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <User className="h-5 w-5 text-blue-400" />
                      Kontoinformation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wider">E-post</Label>
                      <div className="flex items-center gap-2 text-foreground">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{currentUser.email}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wider">Medlem sedan</Label>
                      <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(currentUser.created_at)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wider">Användar-ID</Label>
                      <div className="text-sm text-muted-foreground font-mono bg-white/5 px-3 py-1.5 rounded-lg inline-block">
                        {currentUser.id.substring(0, 8)}...
                      </div>
                    </div>

                    {message && (
                      <Alert className="border-green-500/20 bg-green-500/10 text-green-400 rounded-xl">
                        <AlertDescription>{message}</AlertDescription>
                      </Alert>
                    )}

                    {error && (
                      <Alert className="border-red-500/20 bg-red-500/10 text-red-400 rounded-xl">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Kontostatus */}
                <Card className="border-white/10 bg-white/5 rounded-2xl backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Award className="h-5 w-5 text-blue-400" />
                      Kontostatus
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">Aktiv</Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Autentiseringsmetod</span>
                        <span className="font-medium text-foreground">
                          {currentUser.app_metadata?.provider === 'google' ? 'Google' : 'E-post'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-xl">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logga ut
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#0A0A0F] border-white/10 rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-foreground">Logga ut?</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground">
                              Du kommer att loggas ut fran din session. All data sparas sakert i molnet.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/5 border-white/10 text-foreground hover:bg-white/10 rounded-xl">Avbryt</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-500 hover:bg-red-600 text-white rounded-xl">
                              Logga ut
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Personlig information tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="border-white/10 bg-white/5 rounded-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Heart className="h-5 w-5 text-blue-400" />
                    Personlig Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-muted-foreground text-xs uppercase tracking-wider">Ålder</Label>
                      <Input
                        id="age"
                        type="number"
                        value={personalInfo.age || ''}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
                        placeholder="t.ex. 25"
                        className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-muted-foreground text-xs uppercase tracking-wider">Längd (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={personalInfo.height || ''}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, height: parseInt(e.target.value) || undefined }))}
                        placeholder="t.ex. 175"
                        className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-muted-foreground text-xs uppercase tracking-wider">Vikt (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={personalInfo.weight || ''}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, weight: parseInt(e.target.value) || undefined }))}
                        placeholder="t.ex. 70"
                        className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bodyFat" className="text-muted-foreground text-xs uppercase tracking-wider">Kroppsfett (%)</Label>
                      <Input
                        id="bodyFat"
                        type="number"
                        value={personalInfo.bodyFat || ''}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, bodyFat: parseInt(e.target.value) || undefined }))}
                        placeholder="t.ex. 15"
                        className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activityLevel" className="text-muted-foreground text-xs uppercase tracking-wider">Aktivitetsnivå</Label>
                      <Select
                        value={personalInfo.activityLevel || ''}
                        onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, activityLevel: value }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl text-foreground">
                          <SelectValue placeholder="Välj aktivitetsnivå" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A2F] border-white/10 rounded-xl">
                          {Object.entries(activityLevels).map(([key, label]) => (
                            <SelectItem key={key} value={key} className="text-foreground hover:bg-white/10 focus:bg-white/10 focus:text-foreground">{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fitnessLevel" className="text-muted-foreground text-xs uppercase tracking-wider">Träningsnivå</Label>
                      <Select
                        value={personalInfo.fitnessLevel || ''}
                        onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, fitnessLevel: value }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl text-foreground">
                          <SelectValue placeholder="Välj träningsnivå" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A2F] border-white/10 rounded-xl">
                          {Object.entries(fitnessLevels).map(([key, label]) => (
                            <SelectItem key={key} value={key} className="text-foreground hover:bg-white/10 focus:bg-white/10 focus:text-foreground">{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Hälsoindikatorer */}
                  {(bmi || bmr || hormoziCalories) && (
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="font-medium mb-3 text-foreground">Hälsoindikatorer (Hormozi-modellen)</h4>
                      <div className="grid gap-3 md:grid-cols-4">
                        {bmi && (
                          <div className="text-center p-3 bg-white/5 border border-white/10 rounded-xl">
                            <div className="text-2xl font-bold text-blue-400">{bmi}</div>
                            <div className="text-sm text-muted-foreground">BMI</div>
                          </div>
                        )}
                        {bmr && (
                          <div className="text-center p-3 bg-white/5 border border-white/10 rounded-xl">
                            <div className="text-2xl font-bold text-blue-400">{bmr}</div>
                            <div className="text-sm text-muted-foreground">BMR (12x)</div>
                          </div>
                        )}
                        {hormoziCalories && (
                          <div className="text-center p-3 bg-white/5 border border-white/10 rounded-xl">
                            <div className="text-2xl font-bold text-blue-400">{hormoziCalories}</div>
                            <div className="text-sm text-muted-foreground">Rekommenderat</div>
                          </div>
                        )}
                        {personalInfo.weight && (
                          <div className="text-center p-3 bg-white/5 border border-white/10 rounded-xl">
                            <div className="text-2xl font-bold text-blue-400">{personalInfo.weight}</div>
                            <div className="text-sm text-muted-foreground">Vikt (kg)</div>
                          </div>
                        )}
                      </div>

                      {personalInfo.weight && personalInfo.activityLevel && (
                        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                          <div className="text-sm text-blue-400">
                            <strong>Hormozi-formel:</strong> {Math.round(personalInfo.weight * 2.20462)} lbs x {
                              personalInfo.activityLevel === 'sedentary' ? '12' :
                              personalInfo.activityLevel === 'light' ? '13' :
                              personalInfo.activityLevel === 'moderate' ? '14' :
                              personalInfo.activityLevel === 'active' ? '15' :
                              personalInfo.activityLevel === 'veryActive' ? '16' : '14'
                            } = {hormoziCalories} kalorier/dag
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Button onClick={handleSave} className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                    Spara personlig information
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Träningsmål tab */}
            <TabsContent value="fitness" className="space-y-6">
              <Card className="border-white/10 bg-white/5 rounded-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Target className="h-5 w-5 text-blue-400" />
                    Träningsmaal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="primaryGoal" className="text-muted-foreground text-xs uppercase tracking-wider">Primärt mål</Label>
                      <Select
                        value={fitnessGoals.primaryGoal || ''}
                        onValueChange={(value) => setFitnessGoals(prev => ({ ...prev, primaryGoal: value }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl text-foreground">
                          <SelectValue placeholder="Välj ditt primära mål" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A2F] border-white/10 rounded-xl">
                          {Object.entries(primaryGoals).map(([key, label]) => (
                            <SelectItem key={key} value={key} className="text-foreground hover:bg-white/10 focus:bg-white/10 focus:text-foreground">{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetWeight" className="text-muted-foreground text-xs uppercase tracking-wider">Målvikt (kg)</Label>
                      <Input
                        id="targetWeight"
                        type="number"
                        value={fitnessGoals.targetWeight || ''}
                        onChange={(e) => setFitnessGoals(prev => ({ ...prev, targetWeight: parseInt(e.target.value) || undefined }))}
                        placeholder="t.ex. 75"
                        className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetBodyFat" className="text-muted-foreground text-xs uppercase tracking-wider">Mal kroppsfett (%)</Label>
                      <Input
                        id="targetBodyFat"
                        type="number"
                        value={fitnessGoals.targetBodyFat || ''}
                        onChange={(e) => setFitnessGoals(prev => ({ ...prev, targetBodyFat: parseInt(e.target.value) || undefined }))}
                        placeholder="t.ex. 12"
                        className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weeklyWorkouts" className="text-muted-foreground text-xs uppercase tracking-wider">Traningar per vecka</Label>
                      <Input
                        id="weeklyWorkouts"
                        type="number"
                        value={fitnessGoals.weeklyWorkouts || ''}
                        onChange={(e) => setFitnessGoals(prev => ({ ...prev, weeklyWorkouts: parseInt(e.target.value) || undefined }))}
                        placeholder="t.ex. 4"
                        className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  {/* Föredragna träningstyper */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Föredragna träningstyper</Label>
                    <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
                      {workoutTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={type}
                            checked={fitnessGoals.preferredWorkoutTypes?.includes(type) || false}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFitnessGoals(prev => ({
                                  ...prev,
                                  preferredWorkoutTypes: [...(prev.preferredWorkoutTypes || []), type]
                                }));
                              } else {
                                setFitnessGoals(prev => ({
                                  ...prev,
                                  preferredWorkoutTypes: prev.preferredWorkoutTypes?.filter(t => t !== type) || []
                                }));
                              }
                            }}
                            className="rounded accent-blue-500"
                          />
                          <Label htmlFor={type} className="text-sm text-foreground">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Framsteg mot mal */}
                  {goalProgress > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-muted-foreground">Framsteg mot viktmål</Label>
                        <span className="text-sm font-medium text-foreground">{goalProgress}%</span>
                      </div>
                      <Progress value={goalProgress} className="h-3" />
                    </div>
                  )}

                  <Button onClick={handleSave} className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                    Spara traningsmaal
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Kostmål tab */}
            <TabsContent value="nutrition" className="space-y-6">
              <Card className="border-white/10 bg-white/5 rounded-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Utensils className="h-5 w-5 text-blue-400" />
                    Kostmål
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dailyCalories" className="text-muted-foreground text-xs uppercase tracking-wider">Dagliga kalorier</Label>
                      <Input
                        id="dailyCalories"
                        type="number"
                        value={nutritionGoals.dailyCalories || ''}
                        onChange={(e) => setNutritionGoals(prev => ({ ...prev, dailyCalories: parseInt(e.target.value) || undefined }))}
                        placeholder="t.ex. 2000"
                        className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dailyProtein" className="text-muted-foreground text-xs uppercase tracking-wider">Dagligt protein (g)</Label>
                      <Input
                        id="dailyProtein"
                        type="number"
                        value={nutritionGoals.dailyProtein || ''}
                        onChange={(e) => setNutritionGoals(prev => ({ ...prev, dailyProtein: parseInt(e.target.value) || undefined }))}
                        placeholder="t.ex. 150"
                        className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dailyCarbs" className="text-muted-foreground text-xs uppercase tracking-wider">Dagliga kolhydrater (g)</Label>
                      <Input
                        id="dailyCarbs"
                        type="number"
                        value={nutritionGoals.dailyCarbs || ''}
                        onChange={(e) => setNutritionGoals(prev => ({ ...prev, dailyCarbs: parseInt(e.target.value) || undefined }))}
                        placeholder="t.ex. 200"
                        className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dailyFat" className="text-muted-foreground text-xs uppercase tracking-wider">Dagligt fett (g)</Label>
                      <Input
                        id="dailyFat"
                        type="number"
                        value={nutritionGoals.dailyFat || ''}
                        onChange={(e) => setNutritionGoals(prev => ({ ...prev, dailyFat: parseInt(e.target.value) || undefined }))}
                        placeholder="t.ex. 70"
                        className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dietType" className="text-muted-foreground text-xs uppercase tracking-wider">Kosttyp</Label>
                      <Select
                        value={nutritionGoals.dietType || ''}
                        onValueChange={(value) => setNutritionGoals(prev => ({ ...prev, dietType: value }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl text-foreground">
                          <SelectValue placeholder="Valj kosttyp" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A2F] border-white/10 rounded-xl">
                          {Object.entries(dietTypes).map(([key, label]) => (
                            <SelectItem key={key} value={key} className="text-foreground hover:bg-white/10 focus:bg-white/10 focus:text-foreground">{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Synka med kalorieutraknaren */}
                  {personalInfo.weight && personalInfo.activityLevel && (
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-foreground">Hormozi Kalorieutraknare</h4>
                          <p className="text-sm text-muted-foreground">
                            Synka dina kostmål med kalorieutraknaren baserat pa din vikt och aktivitetsniva
                          </p>
                        </div>
                        <Button onClick={syncWithCalorieCalculator} variant="outline" className="bg-white/5 border-white/10 text-foreground hover:bg-white/10 rounded-xl">
                          <Calculator className="w-4 h-4 mr-2" />
                          Synka
                        </Button>
                      </div>
                      {hormoziCalories && (
                        <div className="text-sm text-muted-foreground">
                          Rekommenderat: {hormoziCalories} kalorier/dag
                        </div>
                      )}
                    </div>
                  )}

                  <Button onClick={handleSave} className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                    Spara kostmål
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistik tab */}
            <TabsContent value="stats" className="space-y-6">
              {/* Traningslogg sektion */}
              <WorkoutLogHistory userId={currentUser?.id} />

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-white/10 bg-white/5 rounded-2xl backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      Framsteg & Statistik
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Senaste vikt</span>
                        <span className="font-medium text-foreground">{personalInfo.weight || '-'} kg</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Målvikt</span>
                        <span className="font-medium text-foreground">{fitnessGoals.targetWeight || '-'} kg</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">BMI</span>
                        <span className="font-medium text-foreground">{bmi || '-'}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">BMR</span>
                        <span className="font-medium text-foreground">{bmr || '-'} kcal</span>
                      </div>
                    </div>

                    {goalProgress > 0 && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Framsteg mot mal</span>
                          <span className="font-medium text-foreground">{goalProgress}%</span>
                        </div>
                        <Progress value={goalProgress} className="h-3" />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 rounded-2xl backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Activity className="h-5 w-5 text-blue-400" />
                      Aktivitetsoversikt
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Planerade traningar/vecka</span>
                        <span className="font-medium text-foreground">{fitnessGoals.weeklyWorkouts || 0}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Dagligt kalorimal</span>
                        <span className="font-medium text-foreground">{nutritionGoals.dailyCalories || 0} kcal</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Proteinmal</span>
                        <span className="font-medium text-foreground">{nutritionGoals.dailyProtein || 0}g</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Föredragna träningstyper</span>
                        <span className="font-medium text-foreground">{fitnessGoals.preferredWorkoutTypes?.length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Gym-tab */}
            <TabsContent value="gym" className="space-y-6">
              <GymLocationManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
