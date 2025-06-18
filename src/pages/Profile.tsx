import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
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
  Calculator
} from 'lucide-react';
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
        console.log('🔍 Profile: Laddar användardata...');
        const result = await getCurrentUser();
        console.log('📊 Profile: getCurrentUser result:', result);
        
        if (!result.success || !result.user) {
          console.log('❌ Profile: Ingen användare inloggad, omdirigerar till login');
          navigate('/login');
          return;
        }

        console.log('✅ Profile: Användardata laddad:', result.user.email);
        setCurrentUser(result.user);
        
        let settings: any = {};
        
        try {
          // Försök ladda från Supabase först
          console.log('🔄 Profile: Laddar användarinställningar från Supabase...');
          settings = await getUserSettings(result.user.id);
          console.log('📊 Profile: Inställningar laddade:', Object.keys(settings));
        } catch (supabaseError) {
          console.warn('Supabase laddning misslyckades, försöker localStorage backup:', supabaseError);
          // Backup: Försök ladda från localStorage
          const localData = localStorage.getItem(`profile_${result.user.id}`);
          if (localData) {
            settings = JSON.parse(localData);
            console.log('📦 Profile: Använde localStorage backup');
          }
        }
        
        console.log('📝 Profile: Sätter formulärdata...');
        setPersonalInfo(settings.personalInfo || {});
        setFitnessGoals(settings.fitnessGoals || {});
        setNutritionGoals(settings.nutritionGoals || {});
        setPreferences(settings.preferences || {
          workoutReminders: true,
          mealReminders: true,
          progressTracking: true,
          publicProfile: false
        });
        console.log('✅ Profile: Allt data laddat och klart!');
      } catch (error) {
        console.error('💥 Profile: Error loading user data:', error);
        setError('Kunde inte ladda användardata');
      } finally {
        console.log('🔄 Profile: Avslutar laddning...');
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
      // Använd Hormozi-formeln för grundmetabolism (12x för stillasittande)
      const weightInPounds = personalInfo.weight * 2.20462;
      return Math.round(weightInPounds * 12); // 12x för grundläggande BMR
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
      const protein = Math.round(weightInPounds * 1); // 1g per pound
      const fat = Math.round(weightInPounds * 0.3); // 0.3g per pound
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

      // Spara alla inställningar till Supabase med localStorage backup
      const allSettings = {
        personalInfo,
        fitnessGoals,
        nutritionGoals,
        preferences
      };

      try {
        // Försök spara till Supabase först
        await saveUserSettings(currentUser.id, allSettings);
        setMessage('Profil uppdaterad i molnet! ✅');
      } catch (supabaseError: any) {
        console.warn('Supabase sparande misslyckades, använder localStorage som backup:', supabaseError);
        
        // Backup: Spara till localStorage
        localStorage.setItem(`profile_${currentUser.id}`, JSON.stringify(allSettings));
        
        // Kontrollera om det är konfigurationsproblem
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        let errorMessage = '';
        
        if (!supabaseUrl || supabaseUrl.includes('your-project') || !supabaseKey || supabaseKey.includes('your-anon-key')) {
          errorMessage = '⚠️ Profil sparad lokalt. Molnsynkronisering är inte konfigurerad än. Kontakta admin för att aktivera molnsparning.';
        } else if (supabaseError.message?.includes('user_settings existerar inte')) {
          errorMessage = '⚠️ Profil sparad lokalt. Databasen saknar nödvändiga tabeller. Kontakta admin för att köra databas-setup.';
        } else if (supabaseError.message?.includes('Åtkomst nekad')) {
          errorMessage = '⚠️ Profil sparad lokalt. Säkerhetsinställningar blockerar molnsparning. Kontakta admin.';
        } else if (supabaseError.message?.includes('Autentisering misslyckades')) {
          errorMessage = '⚠️ Profil sparad lokalt. Din inloggning har gått ut. Logga in igen för molnsparning.';
        } else if (supabaseError.message?.includes('Dublettsparning problem')) {
          errorMessage = '⚠️ Profil sparad lokalt. Molndatabasen har dublettdata. Försök igen eller kontakta admin.';
        } else {
          errorMessage = `⚠️ Profil sparad lokalt. Molnfel: ${supabaseError.message}`;
        }
        
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Kunde inte spara profilen. Försök igen.');
    }
  };

  const handleDeleteAccount = async () => {
    // För Supabase måste kontoborttagning hanteras på backend
    // Här loggar vi bara ut användaren
    try {
      const result = await signOut();
      if (result.success) {
        navigate('/login');
      } else {
        console.error('Error signing out:', result.error);
        setError('Kunde inte logga ut. Försök igen.');
      }
    } catch (error) {
      console.error('Error signing out:', error);
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
    const startWeight = currentWeight; // Detta skulle kunna komma från historisk data
    
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Laddar profil...</p>
            <p className="text-xs text-muted-foreground">Kontrollera konsolen för debug-info</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p>Ingen användare inloggad</p>
        </div>
      </div>
    );
  }

  const bmi = calculateBMI();
  const bmr = calculateBMR();
  const hormoziCalories = calculateHormoziCalories();
  const goalProgress = calculateGoalProgress();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Min Profil</h1>
          <p className="text-muted-foreground">Hantera dina inställningar och spåra dina framsteg</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="account">
              <User className="w-4 h-4 mr-2" />
              Konto
            </TabsTrigger>
            <TabsTrigger value="personal">
              <Heart className="w-4 h-4 mr-2" />
              Personligt
            </TabsTrigger>
            <TabsTrigger value="fitness">
              <Dumbbell className="w-4 h-4 mr-2" />
              Träningsmål
            </TabsTrigger>
            <TabsTrigger value="nutrition">
              <Utensils className="w-4 h-4 mr-2" />
              Kostmål
            </TabsTrigger>
            <TabsTrigger value="stats">
              <TrendingUp className="w-4 h-4 mr-2" />
              Statistik
            </TabsTrigger>
          </TabsList>

          {/* Konto-tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Grundläggande kontoinformation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Kontoinformation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>E-post</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{currentUser.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Medlem sedan</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(currentUser.created_at)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Användar-ID</Label>
                    <div className="text-sm text-muted-foreground font-mono">
                      {currentUser.id.substring(0, 8)}...
                    </div>
                  </div>

                  {message && (
                    <Alert className="border-green-200 bg-green-50 text-green-800">
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Kontostatus */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Kontostatus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="default">Aktiv</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Autentiseringsmetod</span>
                      <span className="font-medium">
                        {currentUser.app_metadata?.provider === 'google' ? 'Google' : 'E-post'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Logga ut
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Logga ut?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Du kommer att loggas ut från din session. All data sparas säkert i molnet.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Avbryt</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount}>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Personlig Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="age">Ålder</Label>
                    <Input
                      id="age"
                      type="number"
                      value={personalInfo.age || ''}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
                      placeholder="t.ex. 25"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Längd (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={personalInfo.height || ''}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, height: parseInt(e.target.value) || undefined }))}
                      placeholder="t.ex. 175"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Vikt (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={personalInfo.weight || ''}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, weight: parseInt(e.target.value) || undefined }))}
                      placeholder="t.ex. 70"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyFat">Kroppsfett (%)</Label>
                    <Input
                      id="bodyFat"
                      type="number"
                      value={personalInfo.bodyFat || ''}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, bodyFat: parseInt(e.target.value) || undefined }))}
                      placeholder="t.ex. 15"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activityLevel">Aktivitetsnivå</Label>
                    <Select
                      value={personalInfo.activityLevel || ''}
                      onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, activityLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Välj aktivitetsnivå" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(activityLevels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fitnessLevel">Träningsnivå</Label>
                    <Select
                      value={personalInfo.fitnessLevel || ''}
                      onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, fitnessLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Välj träningsnivå" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(fitnessLevels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Hälsoindikatorer */}
                {(bmi || bmr || hormoziCalories) && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Hälsoindikatorer (Hormozi-modellen)</h4>
                    <div className="grid gap-3 md:grid-cols-4">
                      {bmi && (
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">{bmi}</div>
                          <div className="text-sm text-muted-foreground">BMI</div>
                        </div>
                      )}
                      {bmr && (
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">{bmr}</div>
                          <div className="text-sm text-muted-foreground">BMR (12x)</div>
                        </div>
                      )}
                      {hormoziCalories && (
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">{hormoziCalories}</div>
                          <div className="text-sm text-muted-foreground">Rekommenderat</div>
                        </div>
                      )}
                      {personalInfo.weight && (
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">{personalInfo.weight}</div>
                          <div className="text-sm text-muted-foreground">Vikt (kg)</div>
                        </div>
                      )}
                    </div>
                    
                    {personalInfo.weight && personalInfo.activityLevel && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm text-blue-800">
                          <strong>Hormozi-formel:</strong> {Math.round(personalInfo.weight * 2.20462)} lbs × {
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

                <Button onClick={handleSave} className="w-full">
                  Spara personlig information
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Träningsmål tab */}
          <TabsContent value="fitness" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Träningsmål
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryGoal">Primärt mål</Label>
                    <Select
                      value={fitnessGoals.primaryGoal || ''}
                      onValueChange={(value) => setFitnessGoals(prev => ({ ...prev, primaryGoal: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Välj ditt primära mål" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(primaryGoals).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetWeight">Målvikt (kg)</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      value={fitnessGoals.targetWeight || ''}
                      onChange={(e) => setFitnessGoals(prev => ({ ...prev, targetWeight: parseInt(e.target.value) || undefined }))}
                      placeholder="t.ex. 75"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetBodyFat">Mål kroppsfett (%)</Label>
                    <Input
                      id="targetBodyFat"
                      type="number"
                      value={fitnessGoals.targetBodyFat || ''}
                      onChange={(e) => setFitnessGoals(prev => ({ ...prev, targetBodyFat: parseInt(e.target.value) || undefined }))}
                      placeholder="t.ex. 12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weeklyWorkouts">Träningar per vecka</Label>
                    <Input
                      id="weeklyWorkouts"
                      type="number"
                      value={fitnessGoals.weeklyWorkouts || ''}
                      onChange={(e) => setFitnessGoals(prev => ({ ...prev, weeklyWorkouts: parseInt(e.target.value) || undefined }))}
                      placeholder="t.ex. 4"
                    />
                  </div>
                </div>

                {/* Föredragna träningstyper */}
                <div className="space-y-2">
                  <Label>Föredragna träningstyper</Label>
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
                          className="rounded"
                        />
                        <Label htmlFor={type} className="text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Framsteg mot mål */}
                {goalProgress > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Framsteg mot viktmål</Label>
                      <span className="text-sm font-medium">{goalProgress}%</span>
                    </div>
                    <Progress value={goalProgress} className="h-3" />
                  </div>
                )}

                <Button onClick={handleSave} className="w-full">
                  Spara träningsmål
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kostmål tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Kostmål
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dailyCalories">Dagliga kalorier</Label>
                    <Input
                      id="dailyCalories"
                      type="number"
                      value={nutritionGoals.dailyCalories || ''}
                      onChange={(e) => setNutritionGoals(prev => ({ ...prev, dailyCalories: parseInt(e.target.value) || undefined }))}
                      placeholder="t.ex. 2000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyProtein">Dagligt protein (g)</Label>
                    <Input
                      id="dailyProtein"
                      type="number"
                      value={nutritionGoals.dailyProtein || ''}
                      onChange={(e) => setNutritionGoals(prev => ({ ...prev, dailyProtein: parseInt(e.target.value) || undefined }))}
                      placeholder="t.ex. 150"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyCarbs">Dagliga kolhydrater (g)</Label>
                    <Input
                      id="dailyCarbs"
                      type="number"
                      value={nutritionGoals.dailyCarbs || ''}
                      onChange={(e) => setNutritionGoals(prev => ({ ...prev, dailyCarbs: parseInt(e.target.value) || undefined }))}
                      placeholder="t.ex. 200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyFat">Dagligt fett (g)</Label>
                    <Input
                      id="dailyFat"
                      type="number"
                      value={nutritionGoals.dailyFat || ''}
                      onChange={(e) => setNutritionGoals(prev => ({ ...prev, dailyFat: parseInt(e.target.value) || undefined }))}
                      placeholder="t.ex. 70"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dietType">Kosttyp</Label>
                    <Select
                      value={nutritionGoals.dietType || ''}
                      onValueChange={(value) => setNutritionGoals(prev => ({ ...prev, dietType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Välj kosttyp" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(dietTypes).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Synka med kalorieuträknaren */}
                {personalInfo.weight && personalInfo.activityLevel && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Hormozi Kalorieuträknare</h4>
                        <p className="text-sm text-muted-foreground">
                          Synka dina kostmål med kalorieuträknaren baserat på din vikt och aktivitetsnivå
                        </p>
                      </div>
                      <Button onClick={syncWithCalorieCalculator} variant="outline">
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

                <Button onClick={handleSave} className="w-full">
                  Spara kostmål
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistik tab */}
          <TabsContent value="stats" className="space-y-6">
            {/* Träningslogg sektion */}
            <WorkoutLogHistory userId={currentUser?.id} />
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Framsteg & Statistik
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Senaste vikt</span>
                      <span className="font-medium">{personalInfo.weight || '-'} kg</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Målvikt</span>
                      <span className="font-medium">{fitnessGoals.targetWeight || '-'} kg</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">BMI</span>
                      <span className="font-medium">{bmi || '-'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">BMR</span>
                      <span className="font-medium">{bmr || '-'} kcal</span>
                    </div>
                  </div>

                  {goalProgress > 0 && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Framsteg mot mål</span>
                        <span className="font-medium">{goalProgress}%</span>
                      </div>
                      <Progress value={goalProgress} className="h-3" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Aktivitetsöversikt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Planerade träningar/vecka</span>
                      <span className="font-medium">{fitnessGoals.weeklyWorkouts || 0}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Dagligt kalorimål</span>
                      <span className="font-medium">{nutritionGoals.dailyCalories || 0} kcal</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Proteinmål</span>
                      <span className="font-medium">{nutritionGoals.dailyProtein || 0}g</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Föredragna träningstyper</span>
                      <span className="font-medium">{fitnessGoals.preferredWorkoutTypes?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile; 