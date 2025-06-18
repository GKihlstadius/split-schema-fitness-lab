import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export function CalorieCalculator() {
  const [weight, setWeight] = useState<number | ''>('');
  const [goal, setGoal] = useState<string>('maintenance');
  const [meals, setMeals] = useState<number>(3);
  const [results, setResults] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    caloriesPerMeal: number;
    proteinPerMeal: number;
  } | null>(null);

  const goals = {
    aggressiveCut: { name: "Aggressiv viktminskning", multiplier: 10 },
    moderateCut: { name: "Måttlig viktminskning", multiplier: 12 },
    maintenance: { name: "Underhåll", multiplier: 14 },
    moderateBulk: { name: "Måttlig muskelökning", multiplier: 16 },
    aggressiveBulk: { name: "Aggressiv muskelökning", multiplier: 18 }
  };

  const calculateCalories = () => {
    if (typeof weight !== 'number' || weight <= 0) return;

    const weightInPounds = weight * 2.20462;
    const multiplier = goals[goal as keyof typeof goals].multiplier;
    
    const calories = Math.round(weightInPounds * multiplier);
    const protein = Math.round(weightInPounds);
    const fat = Math.round(weightInPounds * 0.3);
    
    const proteinCalories = protein * 4;
    const fatCalories = fat * 9;
    const remainingCalories = calories - proteinCalories - fatCalories;
    const carbs = Math.max(0, Math.round(remainingCalories / 4));
    
    const caloriesPerMeal = Math.round(calories / meals);
    const proteinPerMeal = Math.round(protein / meals);

    setResults({
      calories,
      protein,
      carbs,
      fat,
      caloriesPerMeal,
      proteinPerMeal
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Kaloriräknare</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Vikt (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
            placeholder="Ange din vikt"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Mål</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(goals).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meals">Antal måltider per dag</Label>
          <Input
            id="meals"
            type="number"
            value={meals}
            onChange={(e) => setMeals(Number(e.target.value) || 3)}
            min="1"
            max="8"
          />
        </div>

        <Button onClick={calculateCalories} className="w-full">
          Beräkna
        </Button>

        {results && (
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold">Dina dagliga mål:</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Kalorier:</span>
                <span className="font-medium">{results.calories} kcal</span>
              </div>
              <div className="flex justify-between">
                <span>Protein:</span>
                <span className="font-medium">{results.protein}g</span>
              </div>
              <div className="flex justify-between">
                <span>Kolhydrater:</span>
                <span className="font-medium">{results.carbs}g</span>
              </div>
              <div className="flex justify-between">
                <span>Fett:</span>
                <span className="font-medium">{results.fat}g</span>
              </div>
            </div>
            
            <div className="space-y-2 pt-3 border-t">
              <h4 className="font-medium">Per måltid ({meals} måltider/dag):</h4>
              <div className="flex justify-between">
                <span>Kalorier:</span>
                <span className="font-medium">{results.caloriesPerMeal} kcal</span>
              </div>
              <div className="flex justify-between">
                <span>Protein:</span>
                <span className="font-medium">{results.proteinPerMeal}g</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 