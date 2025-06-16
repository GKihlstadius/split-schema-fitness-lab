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
import { FoodItem, foodDatabase, getFoodsByCategory } from '@/data/foodDatabase';

interface MealItem {
  id: string;
  foodKey: string;
  grams: number;
}

interface MealNutrition {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealCalculatorProps {
  targetKcal?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
}

export function MealCalculator({
  targetKcal = 0,
  targetProtein = 0,
  targetCarbs = 0,
  targetFat = 0
}: MealCalculatorProps) {
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [foodsByCategory] = useState(getFoodsByCategory());
  const [totals, setTotals] = useState<MealNutrition>({ kcal: 0, protein: 0, carbs: 0, fat: 0 });
  
  // Lägg till ett tomt livsmedel när komponenten laddas
  useEffect(() => {
    if (mealItems.length === 0) {
      addNewItem();
    }
  }, []);
  
  // Beräkna näringsvärden när mealItems ändras
  useEffect(() => {
    const newTotals: MealNutrition = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    
    mealItems.forEach(item => {
      if (item.foodKey && item.grams > 0) {
        const food = foodDatabase[item.foodKey];
        if (food) {
          const multiplier = item.grams / 100;
          newTotals.kcal += food.kcal * multiplier;
          newTotals.protein += food.protein * multiplier;
          newTotals.carbs += food.carbs * multiplier;
          newTotals.fat += food.fat * multiplier;
        }
      }
    });
    
    // Avrunda värdena till en decimal
    newTotals.kcal = Math.round(newTotals.kcal);
    newTotals.protein = Math.round(newTotals.protein * 10) / 10;
    newTotals.carbs = Math.round(newTotals.carbs * 10) / 10;
    newTotals.fat = Math.round(newTotals.fat * 10) / 10;
    
    setTotals(newTotals);
  }, [mealItems]);
  
  // Generera ett unikt ID för varje måltidsrad
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
  
  // Lägg till ett nytt livsmedel
  const addNewItem = () => {
    setMealItems(prev => [
      ...prev, 
      { id: generateId(), foodKey: '', grams: 100 }
    ]);
  };
  
  // Ta bort ett livsmedel
  const removeItem = (id: string) => {
    setMealItems(prev => prev.filter(item => item.id !== id));
  };
  
  // Uppdatera ett livsmedel
  const updateItem = (id: string, field: 'foodKey' | 'grams', value: string | number) => {
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
    if (!item.foodKey || item.grams <= 0) {
      return { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    }
    
    const food = foodDatabase[item.foodKey];
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
  .filter(item => item.foodKey && item.grams > 0)
  .map(item => {
    const food = foodDatabase[item.foodKey];
    const nutrition = calculateItemNutrition(item);
    return `- ${food.name} (${item.grams}g): ${nutrition.kcal} kcal, ${nutrition.protein}g protein, ${nutrition.carbs}g kolhydrater, ${nutrition.fat}g fett`;
  })
  .join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Livsmedel */}
          <div className="space-y-4">
            {mealItems.map(item => {
              const food = item.foodKey ? foodDatabase[item.foodKey] : null;
              const nutrition = calculateItemNutrition(item);
              
              return (
                <div key={item.id} className="flex flex-col gap-2 pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="flex-grow">
                      <Select 
                        value={item.foodKey} 
                        onValueChange={(value) => updateItem(item.id, 'foodKey', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Välj livsmedel" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(foodsByCategory).map(category => (
                            <SelectGroup key={category}>
                              <SelectLabel>{category}</SelectLabel>
                              {foodsByCategory[category].map(food => (
                                <SelectItem key={food.name} value={Object.keys(foodDatabase).find(key => foodDatabase[key] === food) || ''}>
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
              <div className="flex justify-between items-center">
                <Label>Kalorier</Label>
                <div className="text-right">
                  <div className="font-medium">{totals.kcal} kcal</div>
                  {targetKcal > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {targetKcal > totals.kcal ? `${targetKcal - totals.kcal} kcal kvar` : 'Mål uppnått'}
                    </div>
                  )}
                </div>
              </div>
              {targetKcal > 0 && (
                <Progress 
                  value={calculatePercentage(totals.kcal, targetKcal)} 
                  className={`h-2 ${totals.kcal >= targetKcal ? 'bg-green-500' : ''}`}
                />
              )}
            </div>
            
            {/* Protein */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Protein</Label>
                <div className="text-right">
                  <div className="font-medium">{totals.protein}g</div>
                  {targetProtein > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {targetProtein > totals.protein ? `${Math.round(targetProtein - totals.protein)}g kvar` : 'Mål uppnått'}
                    </div>
                  )}
                </div>
              </div>
              {targetProtein > 0 && (
                <Progress 
                  value={calculatePercentage(totals.protein, targetProtein)} 
                  className={`h-2 ${totals.protein >= targetProtein ? 'bg-green-500' : ''}`}
                />
              )}
            </div>
            
            {/* Kolhydrater */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Kolhydrater</Label>
                <div className="text-right">
                  <div className="font-medium">{totals.carbs}g</div>
                  {targetCarbs > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {targetCarbs > totals.carbs ? `${Math.round(targetCarbs - totals.carbs)}g kvar` : 'Mål uppnått'}
                    </div>
                  )}
                </div>
              </div>
              {targetCarbs > 0 && (
                <Progress 
                  value={calculatePercentage(totals.carbs, targetCarbs)} 
                  className={`h-2 ${totals.carbs >= targetCarbs ? 'bg-green-500' : ''}`}
                />
              )}
            </div>
            
            {/* Fett */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Fett</Label>
                <div className="text-right">
                  <div className="font-medium">{totals.fat}g</div>
                  {targetFat > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {targetFat > totals.fat ? `${Math.round(targetFat - totals.fat)}g kvar` : 'Mål uppnått'}
                    </div>
                  )}
                </div>
              </div>
              {targetFat > 0 && (
                <Progress 
                  value={calculatePercentage(totals.fat, targetFat)} 
                  className={`h-2 ${totals.fat >= targetFat ? 'bg-green-500' : ''}`}
                />
              )}
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
} 