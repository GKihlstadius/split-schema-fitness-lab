import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Trash2, Copy, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { FoodItem, loadFoodDatabase, getFoodsByCategory } from '@/data/livsmedelsDatabase';

interface MealItem {
  id: string;
  foodId: string;
  grams: number;
}

interface MealNutrition {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

interface MealCalculatorWithLivsmedelsDBProps {
  targetKcal?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  onNutritionChange?: (nutrition: MealNutrition) => void;
}

export const MealCalculatorWithLivsmedelsDB: React.FC<MealCalculatorWithLivsmedelsDBProps> = ({
  targetKcal = 0,
  targetProtein = 0,
  targetCarbs = 0,
  targetFat = 0,
  onNutritionChange
}) => {
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodsByCategory, setFoodsByCategory] = useState<Record<string, FoodItem[]>>({});
  const [totals, setTotals] = useState<MealNutrition>({ kcal: 0, protein: 0, carbs: 0, fat: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Läs in livsmedelsdatabasen när komponenten laddas
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const foodItems = await loadFoodDatabase();
        setFoods(foodItems);
        setFoodsByCategory(getFoodsByCategory(foodItems));
        setLoading(false);
      } catch (err) {
        console.error('Fel vid inläsning av livsmedelsdatabas:', err);
        setError('Kunde inte läsa in livsmedelsdatabasen. Vänligen försök igen senare.');
        setLoading(false);
      }
    };
    
    fetchFoods();
  }, []);
  
  // Lägg till ett tomt livsmedel när komponenten laddas
  useEffect(() => {
    if (mealItems.length === 0 && !loading && foods.length > 0) {
      addNewItem();
    }
  }, [mealItems.length, loading, foods.length]);
  
  // Uppdatera useEffect för att anropa onNutritionChange
  useEffect(() => {
    // Beräkna totala näringsvärden
    const newTotals: MealNutrition = {
      kcal: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };

    mealItems.forEach(item => {
      const food = foods.find(f => f.id === item.foodId);
      if (food) {
        const multiplier = item.grams / 100; // Omvandla till multiplikator baserat på gram
        newTotals.kcal += food.kcal * multiplier;
        newTotals.protein += food.protein * multiplier;
        newTotals.carbs += food.carbs * multiplier;
        newTotals.fat += food.fat * multiplier;
      }
    });

    // Avrunda alla värden till en decimal
    Object.keys(newTotals).forEach(key => {
      newTotals[key as keyof MealNutrition] = Math.round(newTotals[key as keyof MealNutrition] * 10) / 10;
    });
    
    setTotals(newTotals);
    
    // Anropa callback om den finns
    if (onNutritionChange) {
      onNutritionChange(newTotals);
    }
  }, [mealItems, foods, onNutritionChange]);
  
  // Generera ett unikt ID för varje måltidsrad
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
  
  // Lägg till ett nytt livsmedel
  const addNewItem = () => {
    setMealItems(prev => [
      ...prev, 
      { id: generateId(), foodId: '', grams: 100 }
    ]);
  };
  
  // Ta bort ett livsmedel
  const removeItem = (id: string) => {
    setMealItems(prev => prev.filter(item => item.id !== id));
  };
  
  // Uppdatera ett livsmedel
  const updateItem = (id: string, field: 'foodId' | 'grams', value: string | number) => {
    setMealItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, [field]: value } 
          : item
      )
    );
  };
  
  // Beräkna näringsvärden för ett livsmedel
  const calculateItemNutrition = (item: MealItem): MealNutrition => {
    if (!item.foodId || item.grams <= 0) {
      return { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    }
    
    const food = foods.find(f => f.id === item.foodId);
    if (!food) {
      return { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    }
    
    const multiplier = item.grams / 100;
    return {
      kcal: Math.round(food.kcal * multiplier),
      protein: Math.round(food.protein * multiplier * 10) / 10,
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
      fat: Math.round(food.fat * multiplier * 10) / 10
    };
  };
  
  // Beräkna procent av mål
  const calculatePercentage = (value: number, target: number) => {
    if (target <= 0) return 0;
    return Math.min(100, Math.round((value / target) * 100));
  };
  
  // Kopiera resultatet till urklipp
  const copyToClipboard = () => {
    const text = `
Måltid näringsvärden:
Kalorier: ${totals.kcal} kcal${targetKcal > 0 ? ` (${calculatePercentage(totals.kcal, targetKcal)}% av mål)` : ''}
Protein: ${totals.protein}g${targetProtein > 0 ? ` (${calculatePercentage(totals.protein, targetProtein)}% av mål)` : ''}
Kolhydrater: ${totals.carbs}g${targetCarbs > 0 ? ` (${calculatePercentage(totals.carbs, targetCarbs)}% av mål)` : ''}
Fett: ${totals.fat}g${targetFat > 0 ? ` (${calculatePercentage(totals.fat, targetFat)}% av mål)` : ''}

Livsmedel:
${mealItems
  .filter(item => item.foodId && item.grams > 0)
  .map(item => {
    const food = foods.find(f => f.id === item.foodId);
    if (!food) return '';
    const nutrition = calculateItemNutrition(item);
    return `- ${food.name} (${item.grams}g): ${nutrition.kcal} kcal, ${nutrition.protein}g protein, ${nutrition.carbs}g kolhydrater, ${nutrition.fat}g fett`;
  })
  .join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(text);
  };

  // Uppdatera beräkningen av procentandel
  const caloriePercentage = targetKcal > 0 ? Math.min((totals.kcal / targetKcal) * 100, 100) : 0;
  const proteinPercentage = targetProtein > 0 ? Math.min((totals.protein / targetProtein) * 100, 100) : 0;
  const carbsPercentage = targetCarbs > 0 ? Math.min((totals.carbs / targetCarbs) * 100, 100) : 0;
  const fatPercentage = targetFat > 0 ? Math.min((totals.fat / targetFat) * 100, 100) : 0;

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          Laddar livsmedelsdatabas...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Livsmedel */}
          <div className="space-y-4">
            {mealItems.map(item => {
              const food = foods.find(f => f.id === item.foodId);
              const nutrition = calculateItemNutrition(item);
              
              return (
                <div key={item.id} className="flex flex-col gap-2 pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="flex-grow">
                      <Select 
                        value={item.foodId} 
                        onValueChange={(value) => updateItem(item.id, 'foodId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Välj livsmedel" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(foodsByCategory).map(category => (
                            <SelectGroup key={category}>
                              <SelectLabel>{category}</SelectLabel>
                              {foodsByCategory[category].map(food => (
                                <SelectItem key={food.id} value={food.id}>
                                  {food.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-24">
                      <Input
                        type="number"
                        value={item.grams}
                        onChange={(e) => updateItem(item.id, 'grams', parseInt(e.target.value) || 0)}
                        min={0}
                        placeholder="Gram"
                      />
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={mealItems.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  
                  {food && (
                    <div className="text-sm text-muted-foreground grid grid-cols-4 gap-2">
                      <div>
                        <span className="font-medium">{nutrition.kcal}</span> kcal
                      </div>
                      <div>
                        <span className="font-medium">{nutrition.protein}</span>g protein
                      </div>
                      <div>
                        <span className="font-medium">{nutrition.carbs}</span>g kolh
                      </div>
                      <div>
                        <span className="font-medium">{nutrition.fat}</span>g fett
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={addNewItem}
            >
              <Plus className="mr-2 h-4 w-4" />
              Lägg till livsmedel
            </Button>
          </div>
          
          {/* Totaler och mål */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-medium text-lg">Totalt</h3>
            
            {/* Kalorier */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Kalorier:</span>
                <span className="font-medium">{totals.kcal} kcal {targetKcal > 0 && `av ${targetKcal} kcal`}</span>
              </div>
              {targetKcal > 0 && <Progress value={caloriePercentage} className="h-2" />}
            </div>
            
            {/* Protein */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Protein:</span>
                <span className="font-medium">{totals.protein}g {targetProtein > 0 && `av ${targetProtein}g`}</span>
              </div>
              {targetProtein > 0 && <Progress value={proteinPercentage} className="h-2" />}
            </div>
            
            {/* Kolhydrater */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Kolhydrater:</span>
                <span className="font-medium">{totals.carbs}g {targetCarbs > 0 && `av ${targetCarbs}g`}</span>
              </div>
              {targetCarbs > 0 && <Progress value={carbsPercentage} className="h-2" />}
            </div>
            
            {/* Fett */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Fett:</span>
                <span className="font-medium">{totals.fat}g {targetFat > 0 && `av ${targetFat}g`}</span>
              </div>
              {targetFat > 0 && <Progress value={fatPercentage} className="h-2" />}
            </div>
            
            <Button 
              className="w-full mt-4 flex items-center justify-center gap-2" 
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
              Kopiera resultat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 