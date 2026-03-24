import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Target, Save, Star, Clock, BarChart3, Utensils, Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { FoodItem, loadFoodDatabase, getFoodsByCategory, getFoodCategories } from '@/data/livsmedelsDatabase';
import { getQuickMeals, saveQuickMeal, QuickMeal, Meal, MealItem, MealNutrition, saveDailyPlan, loadDailyPlan, saveDailyGoals, loadDailyGoals, DailyGoals } from '@/utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

interface SimplifiedMealPlannerProps {
  targetKcal?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
}

// Harmozi-presets för enkel målsättning
const harmoziPresets = [
  { name: "Viktminskning - Aggressiv (8x)", multiplier: 8, description: "Snabb viktminskning" },
  { name: "Viktminskning - Måttlig (10x)", multiplier: 10, description: "Balanserad viktminskning" },
  { name: "Viktminskning - Lätt (12x)", multiplier: 12, description: "Långsam viktminskning" },
  { name: "Underhåll (14x)", multiplier: 14, description: "Behålla vikten" },
  { name: "Muskelökning - Lätt (16x)", multiplier: 16, description: "Ren muskelökning" },
  { name: "Muskelökning - Måttlig (18x)", multiplier: 18, description: "Balanserad muskelökning" },
  { name: "Muskelökning - Aggressiv (20x)", multiplier: 20, description: "Snabb muskelökning" },
];

export const SimplifiedMealPlanner: React.FC<SimplifiedMealPlannerProps> = ({
  targetKcal: propTargetKcal = 0,
  targetProtein: propTargetProtein = 0,
  targetCarbs: propTargetCarbs = 0,
  targetFat: propTargetFat = 0
}) => {
  // State för mål
  const [weight, setWeight] = useState<number | ''>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [targetKcal, setTargetKcal] = useState<number>(propTargetKcal);
  const [targetProtein, setTargetProtein] = useState<number>(propTargetProtein);
  const [targetCarbs, setTargetCarbs] = useState<number>(propTargetCarbs);
  const [targetFat, setTargetFat] = useState<number>(propTargetFat);

  // State för måltider
  const [dailyMeals, setDailyMeals] = useState<Meal[]>([]);
  const [currentMeal, setCurrentMeal] = useState<Meal>({
    id: uuidv4(),
    name: '',
    items: [],
    nutrition: { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  });

  // State för livsmedel
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodsByCategory, setFoodsByCategory] = useState<Record<string, FoodItem[]>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFoodId, setSelectedFoodId] = useState<string>('');
  const [amount, setAmount] = useState<number>(100);

  // State för snabbmåltider
  const [quickMeals, setQuickMeals] = useState<QuickMeal[]>([]);
  const [activeTab, setActiveTab] = useState<string>('create');

  // Ladda data
  useEffect(() => {
    const loadData = async () => {
      try {
        const foodData = await loadFoodDatabase();
        setFoods(foodData);
        setFoodsByCategory(getFoodsByCategory(foodData));
        setCategories(getFoodCategories(foodData));
        setQuickMeals(getQuickMeals());
        
        // Ladda sparad dagens plan
        const savedDailyPlan = loadDailyPlan();
        if (savedDailyPlan.length > 0) {
          setDailyMeals(savedDailyPlan);
        }
        
        // Ladda sparade mål
        const savedGoals = loadDailyGoals();
        if (savedGoals) {
          setTargetKcal(savedGoals.targetKcal);
          setTargetProtein(savedGoals.targetProtein);
          setTargetCarbs(savedGoals.targetCarbs);
          setTargetFat(savedGoals.targetFat);
          if (savedGoals.weight) setWeight(savedGoals.weight);
          if (savedGoals.selectedPreset) setSelectedPreset(savedGoals.selectedPreset);
        }
      } catch (error) {
        console.error('Fel vid laddning av data:', error);
      }
    };
    loadData();
  }, []);

  // Beräkna mål baserat på preset
  const calculateTargetsFromPreset = () => {
    if (!selectedPreset || typeof weight !== 'number' || weight <= 0) return;

    const preset = harmoziPresets.find(p => p.name === selectedPreset);
    if (!preset) return;

    const weightInPounds = weight * 2.20462;
    const calories = Math.round(weightInPounds * preset.multiplier);
    const protein = Math.round(weightInPounds * 1); // 1g per pound
    const fat = Math.round(weightInPounds * 0.3); // 0.3g per pound
    const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);

    setTargetKcal(calories);
    setTargetProtein(protein);
    setTargetCarbs(Math.max(0, carbs));
    setTargetFat(fat);

    // Spara målen automatiskt
    const goals: DailyGoals = {
      targetKcal: calories,
      targetProtein: protein,
      targetCarbs: Math.max(0, carbs),
      targetFat: fat,
      weight: weight,
      selectedPreset: selectedPreset
    };
    saveDailyGoals(goals);

    toast({
      title: "Mål beräknade och sparade!",
      description: `${calories} kcal baserat på ${preset.name}`
    });
  };

  // Beräkna totala näringsvärden för dagen
  const calculateDailyTotals = (): MealNutrition => {
    const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    
    dailyMeals.forEach(meal => {
      totals.kcal += meal.nutrition.kcal;
      totals.protein += meal.nutrition.protein;
      totals.carbs += meal.nutrition.carbs;
      totals.fat += meal.nutrition.fat;
    });

    return {
      kcal: Math.round(totals.kcal),
      protein: Math.round(totals.protein * 10) / 10,
      carbs: Math.round(totals.carbs * 10) / 10,
      fat: Math.round(totals.fat * 10) / 10
    };
  };

  // Beräkna näringsvärden för en måltid
  const calculateNutrition = (items: MealItem[]): MealNutrition => {
    const nutrition: MealNutrition = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    
    items.forEach(item => {
      const food = foods.find(f => f.id === item.foodId);
      if (food) {
        const multiplier = item.grams / 100;
        nutrition.kcal += food.kcal * multiplier;
        nutrition.protein += food.protein * multiplier;
        nutrition.carbs += food.carbs * multiplier;
        nutrition.fat += food.fat * multiplier;
      }
    });

    return {
      kcal: Math.round(nutrition.kcal),
      protein: Math.round(nutrition.protein * 10) / 10,
      carbs: Math.round(nutrition.carbs * 10) / 10,
      fat: Math.round(nutrition.fat * 10) / 10
    };
  };

  // Lägg till livsmedel
  const addFood = () => {
    if (!selectedFoodId || amount <= 0) return;

    const newItem: MealItem = {
      id: uuidv4(),
      foodId: selectedFoodId,
      grams: amount
    };

    const updatedItems = [...currentMeal.items, newItem];
    const updatedMeal = {
      ...currentMeal,
      items: updatedItems,
      nutrition: calculateNutrition(updatedItems)
    };

    setCurrentMeal(updatedMeal);
    setSelectedFoodId('');
    setAmount(100);
  };

  // Ta bort livsmedel
  const removeFood = (itemId: string) => {
    const updatedItems = currentMeal.items.filter(item => item.id !== itemId);
    const updatedMeal = {
      ...currentMeal,
      items: updatedItems,
      nutrition: calculateNutrition(updatedItems)
    };
    setCurrentMeal(updatedMeal);
  };

  // Uppdatera mängd
  const updateAmount = (itemId: string, newAmount: number) => {
    const updatedItems = currentMeal.items.map(item =>
      item.id === itemId ? { ...item, grams: newAmount } : item
    );
    const updatedMeal = {
      ...currentMeal,
      items: updatedItems,
      nutrition: calculateNutrition(updatedItems)
    };
    setCurrentMeal(updatedMeal);
  };

  // Lägg till måltid till dagens plan
  const addMealToDaily = () => {
    if (currentMeal.items.length === 0 || !currentMeal.name.trim()) {
      toast({
        title: "Kan inte lägga till",
        description: "Lägg till livsmedel och ange ett namn först.",
        variant: "destructive"
      });
      return;
    }

    const mealToAdd = { ...currentMeal, id: uuidv4() };
    const updatedDailyMeals = [...dailyMeals, mealToAdd];
    setDailyMeals(updatedDailyMeals);
    
    // Spara dagens plan automatiskt
    saveDailyPlan(updatedDailyMeals);
    
    // Rensa aktuell måltid
    setCurrentMeal({
      id: uuidv4(),
      name: '',
      items: [],
      nutrition: { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    });

    toast({
      title: "Måltid tillagd och sparad!",
      description: `"${mealToAdd.name}" har lagts till i dagens plan.`
    });
  };

  // Ta bort måltid från dagens plan
  const removeMealFromDaily = (mealId: string) => {
    const updatedDailyMeals = dailyMeals.filter(meal => meal.id !== mealId);
    setDailyMeals(updatedDailyMeals);
    
    // Spara dagens plan automatiskt
    saveDailyPlan(updatedDailyMeals);
    
    toast({
      title: "Måltid borttagen och sparad",
      description: "Måltiden har tagits bort från dagens plan."
    });
  };

  // Kopiera måltid till redigeraren
  const editMeal = (meal: Meal) => {
    setCurrentMeal({ ...meal, id: uuidv4() });
    setActiveTab('create');
    toast({
      title: "Måltid kopierad",
      description: "Måltiden har kopierats till redigeraren."
    });
  };

  // Spara som snabbmåltid
  const saveAsQuickMeal = () => {
    if (currentMeal.items.length === 0 || !currentMeal.name.trim()) {
      toast({
        title: "Kan inte spara",
        description: "Lägg till livsmedel och ange ett namn först.",
        variant: "destructive"
      });
      return;
    }

    const quickMeal: QuickMeal = {
      id: uuidv4(),
      name: currentMeal.name,
      items: currentMeal.items,
      nutrition: currentMeal.nutrition,
      category: 'Egen',
      prepTime: 15,
      difficulty: 'easy',
      tags: [],
      createdAt: new Date().toISOString(),
      usageCount: 0
    };

    saveQuickMeal(quickMeal);
    setQuickMeals([...quickMeals, quickMeal]);

    toast({
      title: "Sparad!",
      description: `"${currentMeal.name}" har sparats som snabbmåltid.`
    });
  };

  // Ladda snabbmåltid
  const loadQuickMeal = (quickMeal: QuickMeal) => {
    setCurrentMeal({
      id: uuidv4(),
      name: quickMeal.name,
      items: quickMeal.items,
      nutrition: quickMeal.nutrition,
      category: quickMeal.category
    });
    setActiveTab('create');

    toast({
      title: "Laddad!",
      description: `"${quickMeal.name}" har laddats.`
    });
  };

  // Lägg till snabbmåltid direkt till dagens plan
  const addQuickMealToDaily = (quickMeal: QuickMeal) => {
    const mealToAdd: Meal = {
      id: uuidv4(),
      name: quickMeal.name,
      items: quickMeal.items,
      nutrition: quickMeal.nutrition,
      category: quickMeal.category
    };

    const updatedDailyMeals = [...dailyMeals, mealToAdd];
    setDailyMeals(updatedDailyMeals);
    
    // Spara dagens plan automatiskt
    saveDailyPlan(updatedDailyMeals);

    toast({
      title: "Måltid tillagd och sparad!",
      description: `"${quickMeal.name}" har lagts till i dagens plan.`
    });
  };

  // Rensa måltid
  const clearMeal = () => {
    setCurrentMeal({
      id: uuidv4(),
      name: '',
      items: [],
      nutrition: { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    });
  };

  // Rensa dagens plan
  const clearDailyPlan = () => {
    setDailyMeals([]);
    
    // Spara den tomma planen
    saveDailyPlan([]);
    
    toast({
      title: "Plan rensad och sparad",
      description: "Alla måltider har tagits bort från dagens plan."
    });
  };

  // Beräkna procent av mål
  const getProgress = (current: number, target: number) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  };

  const dailyTotals = calculateDailyTotals();

  return (
    <div className="max-w-7xl px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-8 sm:mb-12">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-light text-primary mb-3">Komplett måltidsplanering</h2>
          <p className="text-muted-foreground font-light text-base sm:text-lg">Enkelt verktyg för att planera dina måltider enligt Harmozi-modellen</p>
        </div>
      </div>

      <Card className="border-white/10 bg-white/5 rounded-2xl">
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1">
            <TabsTrigger value="goals" className="text-xs sm:text-sm py-2 sm:py-1.5">Mål</TabsTrigger>
            <TabsTrigger value="create" className="text-xs sm:text-sm py-2 sm:py-1.5">Skapa måltid</TabsTrigger>
            <TabsTrigger value="daily" className="text-xs sm:text-sm py-2 sm:py-1.5">Dagens plan ({dailyMeals.length})</TabsTrigger>
            <TabsTrigger value="saved" className="text-xs sm:text-sm py-2 sm:py-1.5">Sparade ({quickMeals.length})</TabsTrigger>
          </TabsList>

          {/* Mål-flik */}
          <TabsContent value="goals" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <div className="space-y-4 p-4 sm:p-6 border border-white/10 rounded-xl bg-white/5">
              <h3 className="font-light text-base sm:text-lg text-primary">Snabb målsättning (Harmozi-metoden)</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm sm:text-base">Din vikt (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="t.ex. 75"
                    min={1}
                    className="h-11 sm:h-10 text-base sm:text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preset" className="text-sm sm:text-base">Välj mål</Label>
                  <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                    <SelectTrigger className="h-11 sm:h-10 text-base sm:text-sm">
                      <SelectValue placeholder="Välj ditt mål" />
                    </SelectTrigger>
                    <SelectContent>
                      {harmoziPresets.map(preset => (
                        <SelectItem key={preset.name} value={preset.name} className="text-sm">
                          {preset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={calculateTargetsFromPreset}
                disabled={!selectedPreset || typeof weight !== 'number' || weight <= 0}
                className="w-full h-11 sm:h-10 text-base sm:text-sm"
              >
                Beräkna mål
              </Button>
            </div>

            {/* Visa beräknade mål */}
            {targetKcal > 0 && (
              <div className="space-y-4 p-4 sm:p-6 border border-white/10 rounded-xl bg-white/5">
                <h3 className="font-light text-base sm:text-lg text-primary">Dina dagliga mål</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                  <div className="p-3 sm:p-0">
                    <div className="text-xl sm:text-2xl font-bold text-green-400">{targetKcal}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Kalorier</div>
                  </div>
                  <div className="p-3 sm:p-0">
                    <div className="text-xl sm:text-2xl font-bold text-blue-400">{targetProtein}g</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Protein</div>
                  </div>
                  <div className="p-3 sm:p-0">
                    <div className="text-xl sm:text-2xl font-bold text-orange-400">{targetCarbs}g</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Kolhydrater</div>
                  </div>
                  <div className="p-3 sm:p-0">
                    <div className="text-xl sm:text-2xl font-bold text-purple-400">{targetFat}g</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Fett</div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Skapa måltid-flik */}
          <TabsContent value="create" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            {/* Måltidsnamn */}
            <div className="space-y-2">
              <Label htmlFor="mealName" className="text-sm sm:text-base">Måltidsnamn</Label>
              <Input
                id="mealName"
                value={currentMeal.name}
                onChange={(e) => setCurrentMeal({ ...currentMeal, name: e.target.value })}
                placeholder="t.ex. Frukost, Lunch, Middag..."
                className="h-11 sm:h-10 text-base sm:text-sm"
              />
            </div>

            {/* Lägg till livsmedel */}
            <div className="space-y-4 p-4 sm:p-6 border border-white/10 rounded-xl bg-white/5">
              <h3 className="font-light text-base sm:text-lg text-primary">Lägg till livsmedel</h3>
              
              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                <div className="space-y-2">
                  <Label className="text-sm block sm:hidden">Kategori</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-11 sm:h-10 text-base sm:text-sm">
                      <SelectValue placeholder="Välj kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category} className="text-sm">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm block sm:hidden">Livsmedel</Label>
                  <Select 
                    value={selectedFoodId} 
                    onValueChange={setSelectedFoodId}
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger className="h-11 sm:h-10 text-base sm:text-sm">
                      <SelectValue placeholder="Välj livsmedel" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory && foodsByCategory[selectedCategory]?.map(food => (
                        <SelectItem key={food.id} value={food.id} className="text-sm">
                          {food.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm block sm:hidden">Gram</Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="Gram"
                      min={1}
                      className="h-11 sm:h-10 text-base sm:text-sm"
                    />
                  </div>
                  <Button 
                    onClick={addFood} 
                    disabled={!selectedFoodId || amount <= 0}
                    className="h-11 sm:h-10 px-3 sm:px-4 text-base sm:text-sm mt-6 sm:mt-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Aktuella livsmedel */}
            {currentMeal.items.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-light text-base sm:text-lg text-primary">Livsmedel i måltiden</h3>
                  <Button variant="outline" size="sm" onClick={clearMeal} className="h-9 text-sm">
                    Rensa allt
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {currentMeal.items.map(item => {
                    const food = foods.find(f => f.id === item.foodId);
                    if (!food) return null;

                    const multiplier = item.grams / 100;
                    return (
                      <div key={item.id} className="p-4 border border-white/10 rounded-xl bg-white/5">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm sm:text-base truncate">{food.name}</div>
                              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                                <div>{Math.round(food.kcal * multiplier)} kcal</div>
                                <div className="flex gap-2 mt-1">
                                  <span>{Math.round(food.protein * multiplier)}g protein</span>
                                  <span>{Math.round(food.carbs * multiplier)}g kolh</span>
                                  <span>{Math.round(food.fat * multiplier)}g fett</span>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFood(item.id)}
                              className="flex-shrink-0 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={item.grams}
                              onChange={(e) => updateAmount(item.id, Number(e.target.value))}
                              className="w-20 h-9 text-sm"
                              min={1}
                            />
                            <span className="text-sm text-muted-foreground">g</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Måltidssammanfattning */}
                <div className="p-4 sm:p-6 border border-white/10 rounded-xl bg-white/5">
                  <h4 className="font-light text-base sm:text-lg text-primary mb-3">Måltidssammanfattning</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center text-sm">
                    <div className="p-2 sm:p-0">
                      <div className="font-medium text-base sm:text-lg">{currentMeal.nutrition.kcal}</div>
                      <div className="text-muted-foreground text-xs sm:text-sm">kcal</div>
                    </div>
                    <div className="p-2 sm:p-0">
                      <div className="font-medium text-base sm:text-lg">{currentMeal.nutrition.protein}g</div>
                      <div className="text-muted-foreground text-xs sm:text-sm">protein</div>
                    </div>
                    <div className="p-2 sm:p-0">
                      <div className="font-medium text-base sm:text-lg">{currentMeal.nutrition.carbs}g</div>
                      <div className="text-muted-foreground text-xs sm:text-sm">kolh</div>
                    </div>
                    <div className="p-2 sm:p-0">
                      <div className="font-medium text-base sm:text-lg">{currentMeal.nutrition.fat}g</div>
                      <div className="text-muted-foreground text-xs sm:text-sm">fett</div>
                    </div>
                  </div>
                </div>

                {/* Knappar */}
                <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
                  <Button 
                    onClick={addMealToDaily} 
                    disabled={!currentMeal.name.trim()}
                    className="w-full h-11 sm:h-10 text-base sm:text-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Lägg till i dagens plan
                  </Button>
                  <Button 
                    onClick={saveAsQuickMeal} 
                    variant="outline"
                    disabled={!currentMeal.name.trim()}
                    className="w-full h-11 sm:h-10 text-base sm:text-sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Spara som snabbmåltid
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Dagens plan-flik */}
          <TabsContent value="daily" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            {/* Snabb tillägg av sparade måltider */}
            {quickMeals.length > 0 && (
              <div className="space-y-4 p-4 sm:p-6 border border-white/10 rounded-xl bg-white/5">
                <h3 className="font-light text-base sm:text-lg text-primary flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Lägg till sparad måltid
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {quickMeals.slice(0, 6).map(meal => (
                    <div key={meal.id} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{meal.name}</h4>
                          <div className="text-xs text-muted-foreground">
                            {meal.nutrition.kcal} kcal • {meal.nutrition.protein}g protein
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addQuickMealToDaily(meal)}
                          className="h-8 px-2 flex-shrink-0 ml-2"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {quickMeals.length > 6 && (
                  <div className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setActiveTab('saved')}
                      className="text-sm"
                    >
                      Visa alla {quickMeals.length} sparade måltider →
                    </Button>
                  </div>
                )}
              </div>
            )}

            {dailyMeals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">Inga måltider i dagens plan än.</p>
                <p className="text-xs sm:text-sm">Skapa måltider eller lägg till sparade måltider i din dagliga plan!</p>
              </div>
            ) : (
              <>
                {/* Daglig sammanfattning */}
                <div className="space-y-4 p-4 sm:p-6 border border-white/10 rounded-xl bg-white/5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-light text-base sm:text-lg text-primary flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Daglig sammanfattning vs Mål
                    </h3>
                    <Button variant="outline" size="sm" onClick={clearDailyPlan} className="h-8 text-xs sm:text-sm">
                      Rensa allt
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2 p-3 sm:p-0 border border-white/10 sm:border-0 rounded-xl sm:rounded-none">
                      <div className="flex justify-between text-sm">
                        <span>Kalorier</span>
                        <span className="font-medium">
                          {dailyTotals.kcal}{targetKcal > 0 && ` / ${targetKcal}`}
                        </span>
                      </div>
                      {targetKcal > 0 && (
                        <Progress 
                          value={getProgress(dailyTotals.kcal, targetKcal)} 
                          className="h-2"
                        />
                      )}
                      {targetKcal > 0 && (
                        <div className="text-xs text-center text-muted-foreground">
                          {Math.round(getProgress(dailyTotals.kcal, targetKcal))}%
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 p-3 sm:p-0 border border-white/10 sm:border-0 rounded-xl sm:rounded-none">
                      <div className="flex justify-between text-sm">
                        <span>Protein</span>
                        <span className="font-medium">
                          {dailyTotals.protein}g{targetProtein > 0 && ` / ${targetProtein}g`}
                        </span>
                      </div>
                      {targetProtein > 0 && (
                        <Progress 
                          value={getProgress(dailyTotals.protein, targetProtein)} 
                          className="h-2"
                        />
                      )}
                      {targetProtein > 0 && (
                        <div className="text-xs text-center text-muted-foreground">
                          {Math.round(getProgress(dailyTotals.protein, targetProtein))}%
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 p-3 sm:p-0 border border-white/10 sm:border-0 rounded-xl sm:rounded-none">
                      <div className="flex justify-between text-sm">
                        <span>Kolhydrater</span>
                        <span className="font-medium">
                          {dailyTotals.carbs}g{targetCarbs > 0 && ` / ${targetCarbs}g`}
                        </span>
                      </div>
                      {targetCarbs > 0 && (
                        <Progress 
                          value={getProgress(dailyTotals.carbs, targetCarbs)} 
                          className="h-2"
                        />
                      )}
                      {targetCarbs > 0 && (
                        <div className="text-xs text-center text-muted-foreground">
                          {Math.round(getProgress(dailyTotals.carbs, targetCarbs))}%
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 p-3 sm:p-0 border border-white/10 sm:border-0 rounded-xl sm:rounded-none">
                      <div className="flex justify-between text-sm">
                        <span>Fett</span>
                        <span className="font-medium">
                          {dailyTotals.fat}g{targetFat > 0 && ` / ${targetFat}g`}
                        </span>
                      </div>
                      {targetFat > 0 && (
                        <Progress 
                          value={getProgress(dailyTotals.fat, targetFat)} 
                          className="h-2"
                        />
                      )}
                      {targetFat > 0 && (
                        <div className="text-xs text-center text-muted-foreground">
                          {Math.round(getProgress(dailyTotals.fat, targetFat))}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lista över måltider */}
                <div className="space-y-3">
                  <h3 className="font-light text-base sm:text-lg text-primary">Måltider för dagen</h3>
                  {dailyMeals.map((meal, index) => (
                    <Card key={meal.id} className="border-white/10 bg-white/5 rounded-2xl">
                      <CardContent className="p-4 sm:p-6">
                        <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-between sm:items-start sm:mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-light text-base sm:text-lg text-foreground truncate">{meal.name}</h4>
                            <Badge variant="secondary" className="text-xs font-light border-0 mt-1">
                              Måltid {index + 1}
                            </Badge>
                          </div>
                          <div className="flex gap-1 justify-end sm:justify-start">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editMeal(meal)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMealFromDaily(meal.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center text-sm mt-3">
                          <div className="p-2 sm:p-0">
                            <div className="font-medium text-base sm:text-lg">{meal.nutrition.kcal}</div>
                            <div className="text-muted-foreground text-xs sm:text-sm">kcal</div>
                          </div>
                          <div className="p-2 sm:p-0">
                            <div className="font-medium text-base sm:text-lg">{meal.nutrition.protein}g</div>
                            <div className="text-muted-foreground text-xs sm:text-sm">protein</div>
                          </div>
                          <div className="p-2 sm:p-0">
                            <div className="font-medium text-base sm:text-lg">{meal.nutrition.carbs}g</div>
                            <div className="text-muted-foreground text-xs sm:text-sm">kolh</div>
                          </div>
                          <div className="p-2 sm:p-0">
                            <div className="font-medium text-base sm:text-lg">{meal.nutrition.fat}g</div>
                            <div className="text-muted-foreground text-xs sm:text-sm">fett</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Sparade måltider-flik */}
          <TabsContent value="saved" className="space-y-4 mt-4 sm:mt-6">
            {quickMeals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">Inga sparade måltider än.</p>
                <p className="text-xs sm:text-sm">Skapa en måltid och spara den för framtida användning!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {quickMeals.map(meal => (
                  <Card key={meal.id} className="border-white/10 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg font-light text-foreground truncate">{meal.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs font-light border-0 mt-1">
                            {meal.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0 ml-2">
                          <Clock className="h-3 w-3" />
                          <span>{meal.prepTime}min</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                          <div className="text-center p-2 sm:p-0">
                            <div className="font-medium">{meal.nutrition.kcal}</div>
                            <div className="text-xs text-muted-foreground">kcal</div>
                          </div>
                          <div className="text-center p-2 sm:p-0">
                            <div className="font-medium">{meal.nutrition.protein}g</div>
                            <div className="text-xs text-muted-foreground">protein</div>
                          </div>
                          <div className="text-center p-2 sm:p-0">
                            <div className="font-medium">{meal.nutrition.carbs}g</div>
                            <div className="text-xs text-muted-foreground">kolh</div>
                          </div>
                          <div className="text-center p-2 sm:p-0">
                            <div className="font-medium">{meal.nutrition.fat}g</div>
                            <div className="text-xs text-muted-foreground">fett</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-2">
                          <Button 
                            onClick={() => loadQuickMeal(meal)}
                            variant="outline"
                            className="w-full h-10 text-sm"
                          >
                            Redigera
                          </Button>
                          <Button 
                            onClick={() => addQuickMealToDaily(meal)}
                            className="w-full h-10 text-sm"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Till dagens plan
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 