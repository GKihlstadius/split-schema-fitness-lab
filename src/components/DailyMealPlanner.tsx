import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Copy, Plus, Trash2, Save, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FoodItem, getFoodsByCategory, getFoodCategories, loadFoodDatabase } from '@/data/livsmedelsDatabase';
import { SavedMealPlans } from './SavedMealPlans';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { saveMealPlan, MealNutrition, MealItem, Meal, SavedMealPlan } from '@/utils/localStorage';
import { toast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

interface DailyMealPlannerProps {
  targetKcal?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  onCurrentMealChange?: (meal: Meal | undefined) => void; // Callback för att rapportera aktuell måltid
}

interface DailyMealPlannerRef {
  addCompleteMeal: (meal: Meal) => void;
}

export const DailyMealPlanner = forwardRef<DailyMealPlannerRef, DailyMealPlannerProps>(({
  targetKcal = 0,
  targetProtein = 0,
  targetCarbs = 0,
  targetFat = 0,
  onCurrentMealChange
}, ref) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [newMealName, setNewMealName] = useState<string>('');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodsByCategory, setFoodsByCategory] = useState<Record<string, FoodItem[]>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [planName, setPlanName] = useState<string>('');
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
  
  // Totala näringsvärden för hela dagen
  const [totals, setTotals] = useState<MealNutrition>({
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  
  // För måltidsredigeraren
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFoodId, setSelectedFoodId] = useState<string>('');
  const [amount, setAmount] = useState<number>(100);
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  
  // Ladda livsmedel vid start
  useEffect(() => {
    const loadFoods = async () => {
      setLoading(true);
      try {
        // Hämta data från Livsmedelsverket eller fallback
        const foods = await loadFoodDatabase();
        setFoods(foods);
        setFoodsByCategory(getFoodsByCategory(foods));
        setCategories(getFoodCategories(foods));
      } catch (error) {
        console.error('Fel vid inläsning av livsmedel:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFoods();
  }, []);
  
  // Uppdatera mealItems när selectedMealId ändras
  useEffect(() => {
    if (selectedMealId) {
      const meal = meals.find(m => m.id === selectedMealId);
      if (meal) {
        setMealItems(meal.items);
        onCurrentMealChange?.(meal); // Rapportera aktuell måltid
      } else {
        setMealItems([]);
        onCurrentMealChange?.(undefined);
      }
    } else {
      setMealItems([]);
      onCurrentMealChange?.(undefined);
    }
  }, [selectedMealId, meals, onCurrentMealChange]);
  
  // Beräkna totala näringsvärden när måltider ändras
  useEffect(() => {
    const newTotals: MealNutrition = {
      kcal: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
    
    meals.forEach(meal => {
      newTotals.kcal += meal.nutrition.kcal;
      newTotals.protein += meal.nutrition.protein;
      newTotals.carbs += meal.nutrition.carbs;
      newTotals.fat += meal.nutrition.fat;
    });
    
    // Avrunda värdena till en decimal
    newTotals.kcal = Math.round(newTotals.kcal);
    newTotals.protein = Math.round(newTotals.protein * 10) / 10;
    newTotals.carbs = Math.round(newTotals.carbs * 10) / 10;
    newTotals.fat = Math.round(newTotals.fat * 10) / 10;
    
    setTotals(newTotals);
  }, [meals]);
  
  // Beräkna näringsvärden för en måltid baserat på dess livsmedel
  const calculateMealNutrition = (items: MealItem[]): MealNutrition => {
    const nutrition: MealNutrition = {
      kcal: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
    
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
    
    // Avrunda värdena till en decimal
    nutrition.kcal = Math.round(nutrition.kcal);
    nutrition.protein = Math.round(nutrition.protein * 10) / 10;
    nutrition.carbs = Math.round(nutrition.carbs * 10) / 10;
    nutrition.fat = Math.round(nutrition.fat * 10) / 10;
    
    return nutrition;
  };
  
  // Lägg till en ny måltid
  const addMeal = () => {
    if (!newMealName.trim()) return;
    
    const newMeal: Meal = {
      id: uuidv4(),
      name: newMealName,
      items: [],
      nutrition: {
        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    };
    
    setMeals([...meals, newMeal]);
    setNewMealName('');
    setActiveTab(newMeal.id);
    setSelectedMealId(newMeal.id);
  };

  // Lägg till en komplett måltid från QuickMeals
  const addCompleteMeal = (meal: Meal) => {
    const newMeal: Meal = {
      ...meal,
      id: uuidv4() // Ge den ett nytt ID
    };
    
    setMeals([...meals, newMeal]);
    
    toast({
      title: "Måltid tillagd!",
      description: `"${meal.name}" har lagts till i din dagliga plan.`
    });
  };

  // Exponera funktioner via ref
  useImperativeHandle(ref, () => ({
    addCompleteMeal
  }));
  
  // Ta bort en måltid
  const removeMeal = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id));
    if (activeTab === id) {
      setActiveTab('overview');
    }
    if (selectedMealId === id) {
      setSelectedMealId(null);
    }
  };
  
  // Lägg till livsmedel till en måltid
  const addFoodToMeal = () => {
    if (!selectedMealId || !selectedFoodId || amount <= 0) return;
    
    const newItem: MealItem = {
      id: uuidv4(),
      foodId: selectedFoodId,
      grams: amount
    };
    
    // Hitta måltiden och uppdatera den
    const updatedMeals = meals.map(meal => {
      if (meal.id === selectedMealId) {
        const updatedItems = [...meal.items, newItem];
        return {
          ...meal,
          items: updatedItems,
          nutrition: calculateMealNutrition(updatedItems)
        };
      }
      return meal;
    });
    
    setMeals(updatedMeals);
    setMealItems([...mealItems, newItem]);
    setSelectedFoodId('');
    setAmount(100);
  };
  
  // Ta bort livsmedel från en måltid
  const removeFoodFromMeal = (itemId: string) => {
    if (!selectedMealId) return;
    
    // Hitta måltiden och uppdatera den
    const updatedMeals = meals.map(meal => {
      if (meal.id === selectedMealId) {
        const updatedItems = meal.items.filter(item => item.id !== itemId);
        return {
          ...meal,
          items: updatedItems,
          nutrition: calculateMealNutrition(updatedItems)
        };
      }
      return meal;
    });
    
    setMeals(updatedMeals);
    setMealItems(mealItems.filter(item => item.id !== itemId));
  };
  
  // Uppdatera mängden av ett livsmedel
  const updateFoodAmount = (itemId: string, newAmount: number) => {
    if (!selectedMealId || newAmount <= 0) return;
    
    // Hitta måltiden och uppdatera den
    const updatedMeals = meals.map(meal => {
      if (meal.id === selectedMealId) {
        const updatedItems = meal.items.map(item => 
          item.id === itemId ? { ...item, grams: newAmount } : item
        );
        return {
          ...meal,
          items: updatedItems,
          nutrition: calculateMealNutrition(updatedItems)
        };
      }
      return meal;
    });
    
    setMeals(updatedMeals);
    setMealItems(mealItems.map(item => 
      item.id === itemId ? { ...item, grams: newAmount } : item
    ));
  };
  
  // Kopiera måltidsplanen till urklipp
  const copyMealPlan = () => {
    const text = `
MÅLTIDSPLAN
===========
Mål: ${targetKcal} kcal, ${targetProtein}g protein, ${targetCarbs}g kolhydrater, ${targetFat}g fett

${meals.map(meal => `
${meal.name}:
${meal.items.map(item => {
  const food = foods.find(f => f.id === item.foodId);
  return food ? `- ${food.name}: ${item.grams}g (${Math.round(food.kcal * item.grams / 100)} kcal, ${Math.round(food.protein * item.grams / 100)}g protein)` : '';
}).join('\n')}
Totalt: ${meal.nutrition.kcal} kcal, ${meal.nutrition.protein}g protein, ${meal.nutrition.carbs}g kolhydrater, ${meal.nutrition.fat}g fett
`).join('\n')}

TOTALT FÖR DAGEN:
${totals.kcal} kcal, ${totals.protein}g protein, ${totals.carbs}g kolhydrater, ${totals.fat}g fett
    `.trim();
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopierad!",
      description: "Måltidsplanen har kopierats till urklipp.",
      duration: 3000
    });
  };

  // Spara måltidsplanen
  const handleSavePlan = () => {
    if (!planName.trim()) {
      toast({
        title: "Namnge din plan",
        description: "Du måste ange ett namn för måltidsplanen.",
        variant: "destructive"
      });
      return;
    }

    const mealPlan: SavedMealPlan = {
      id: uuidv4(),
      date: new Date().toISOString(),
      name: planName,
      meals: [...meals],
      totals,
      targetKcal,
      targetProtein,
      targetCarbs,
      targetFat
    };

    saveMealPlan(mealPlan);
    setIsSaveDialogOpen(false);
    setPlanName('');
    
    toast({
      title: "Sparad!",
      description: "Din måltidsplan har sparats.",
      duration: 3000
    });
  };

  // Ladda en sparad måltidsplan
  const handleLoadPlan = (plan: SavedMealPlan) => {
    setMeals(plan.meals);
    setActiveTab('overview');
    setSelectedMealId(null);
    
    toast({
      title: "Plan laddad",
      description: `Måltidsplanen "${plan.name}" har laddats.`,
      action: <ToastAction altText="Ångra">Ångra</ToastAction>,
      duration: 5000
    });
  };
  
  // Beräkna procentandel av målen
  const caloriePercentage = targetKcal > 0 ? Math.min((totals.kcal / targetKcal) * 100, 100) : 0;
  const proteinPercentage = targetProtein > 0 ? Math.min((totals.protein / targetProtein) * 100, 100) : 0;
  const carbsPercentage = targetCarbs > 0 ? Math.min((totals.carbs / targetCarbs) * 100, 100) : 0;
  const fatPercentage = targetFat > 0 ? Math.min((totals.fat / targetFat) * 100, 100) : 0;
  
  // Rendera måltidsfliken
  const renderMealTab = (meal: Meal) => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">{meal.name}</h3>
          <Button variant="outline" size="sm" onClick={() => removeMeal(meal.id)}>
            Ta bort måltid
          </Button>
        </div>
        
        {/* Livsmedelsväljare */}
        <Card>
          <CardHeader>
            <CardTitle>Lägg till livsmedel</CardTitle>
            <CardDescription>Välj livsmedel och mängd</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="food">Livsmedel</Label>
                  <Select 
                    value={selectedFoodId} 
                    onValueChange={setSelectedFoodId}
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Välj livsmedel" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory && foodsByCategory[selectedCategory]?.map(food => (
                        <SelectItem key={food.id} value={food.id}>
                          {food.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="amount">Mängd (g)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={1}
                  />
                </div>
                <Button 
                  onClick={addFoodToMeal} 
                  disabled={!selectedFoodId || amount <= 0}
                  className="flex-shrink-0"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Lägg till
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Lista över tillagda livsmedel */}
        {mealItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tillagda livsmedel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mealItems.map(item => {
                  const food = foods.find(f => f.id === item.foodId);
                  if (!food) return null;
                  
                  const multiplier = item.grams / 100;
                  
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{food.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.grams}g • {Math.round(food.kcal * multiplier)} kcal • 
                          {Math.round(food.protein * multiplier)}g protein • 
                          {Math.round(food.carbs * multiplier)}g kolh • 
                          {Math.round(food.fat * multiplier)}g fett
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={item.grams}
                          onChange={(e) => updateFoodAmount(item.id, Number(e.target.value))}
                          className="w-20"
                          min={1}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeFoodFromMeal(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Näringsvärden för måltiden */}
        <Card>
          <CardHeader>
            <CardTitle>Näringsvärden för måltiden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Kalorier:</span>
                  <span className="font-medium">{meal.nutrition.kcal} kcal {targetKcal > 0 && `av ${targetKcal} kcal`}</span>
                </div>
                {targetKcal > 0 && <Progress value={(meal.nutrition.kcal / targetKcal) * 100} className="h-2" />}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Protein:</span>
                  <span className="font-medium">{meal.nutrition.protein}g {targetProtein > 0 && `av ${targetProtein}g`}</span>
                </div>
                {targetProtein > 0 && <Progress value={(meal.nutrition.protein / targetProtein) * 100} className="h-2" />}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Kolhydrater:</span>
                  <span className="font-medium">{meal.nutrition.carbs}g {targetCarbs > 0 && `av ${targetCarbs}g`}</span>
                </div>
                {targetCarbs > 0 && <Progress value={(meal.nutrition.carbs / targetCarbs) * 100} className="h-2" />}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Fett:</span>
                  <span className="font-medium">{meal.nutrition.fat}g {targetFat > 0 && `av ${targetFat}g`}</span>
                </div>
                {targetFat > 0 && <Progress value={(meal.nutrition.fat / targetFat) * 100} className="h-2" />}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Måltidsplanering</CardTitle>
        <CardDescription>
          Skapa din måltidsplan för dagen och håll koll på näringsvärden
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center">
            <p>Laddar livsmedelsdata...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lägg till ny måltid */}
            <div className="flex gap-2">
              <Input
                placeholder="Ange namn på måltid"
                value={newMealName}
                onChange={(e) => setNewMealName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addMeal} disabled={!newMealName.trim()}>
                Lägg till måltid
              </Button>
            </div>
            
            {/* Måltidsflikar */}
            {meals.length > 0 ? (
              <Tabs value={activeTab} onValueChange={(value) => {
                setActiveTab(value);
                setSelectedMealId(value === 'overview' ? null : value);
              }}>
                <TabsList className="w-full overflow-x-auto">
                  <TabsTrigger value="overview">Översikt</TabsTrigger>
                  {meals.map(meal => (
                    <TabsTrigger key={meal.id} value={meal.id}>
                      {meal.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Daglig översikt</CardTitle>
                      <CardDescription>
                        Sammanställning av alla måltider och näringsvärden
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Lista över måltider */}
                        <div className="space-y-4">
                          {meals.map(meal => (
                            <div key={meal.id} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">{meal.name}</h3>
                                <span className="text-sm text-muted-foreground">
                                  {meal.nutrition.kcal} kcal
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {meal.nutrition.protein}g protein • {meal.nutrition.carbs}g kolh • {meal.nutrition.fat}g fett
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Totala näringsvärden */}
                        <div className="pt-4 border-t space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Totalt kalorier:</span>
                              <span className="font-medium">{totals.kcal} kcal {targetKcal > 0 && `av ${targetKcal} kcal`}</span>
                            </div>
                            {targetKcal > 0 && <Progress value={caloriePercentage} className="h-2" />}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Totalt protein:</span>
                              <span className="font-medium">{totals.protein}g {targetProtein > 0 && `av ${targetProtein}g`}</span>
                            </div>
                            {targetProtein > 0 && <Progress value={proteinPercentage} className="h-2" />}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Totalt kolhydrater:</span>
                              <span className="font-medium">{totals.carbs}g {targetCarbs > 0 && `av ${targetCarbs}g`}</span>
                            </div>
                            {targetCarbs > 0 && <Progress value={carbsPercentage} className="h-2" />}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Totalt fett:</span>
                              <span className="font-medium">{totals.fat}g {targetFat > 0 && `av ${targetFat}g`}</span>
                            </div>
                            {targetFat > 0 && <Progress value={fatPercentage} className="h-2" />}
                          </div>
                        </div>
                        
                        {/* Knappar för att hantera måltidsplanen */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            className="flex items-center justify-center gap-2"
                            onClick={copyMealPlan}
                          >
                            <Copy className="h-4 w-4" />
                            Kopiera måltidsplan
                          </Button>
                          
                          <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="flex items-center justify-center gap-2"
                                disabled={meals.length === 0}
                              >
                                <Save className="h-4 w-4" />
                                Spara måltidsplan
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Spara måltidsplan</DialogTitle>
                                <DialogDescription>
                                  Ge din måltidsplan ett namn för att spara den.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="plan-name">Namn på måltidsplan</Label>
                                  <Input
                                    id="plan-name"
                                    placeholder="t.ex. Min måltidsplan"
                                    value={planName}
                                    onChange={(e) => setPlanName(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>Avbryt</Button>
                                <Button onClick={handleSavePlan}>Spara</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        
                        {/* Visa sparade måltidsplaner */}
                        <SavedMealPlans onLoadPlan={handleLoadPlan} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {meals.map(meal => (
                  <TabsContent key={meal.id} value={meal.id} className="mt-6">
                    {renderMealTab(meal)}
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="py-12 text-center border rounded-lg">
                <p className="text-muted-foreground">
                  Inga måltider tillagda än. Lägg till din första måltid för att komma igång.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}); 