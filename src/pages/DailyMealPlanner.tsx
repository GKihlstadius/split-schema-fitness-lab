import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { DailyMealPlanner } from '@/components/DailyMealPlanner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DailyMealPlannerPage = () => {
  const [targetKcal, setTargetKcal] = useState<number>(0);
  const [targetProtein, setTargetProtein] = useState<number>(0);
  const [targetCarbs, setTargetCarbs] = useState<number>(0);
  const [targetFat, setTargetFat] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('manual');
  const [weight, setWeight] = useState<number | ''>('');
  
  // Beräkna mål baserat på vikt och aktivitetsnivå
  const calculateTargets = (activityLevel: number) => {
    if (typeof weight !== 'number' || weight <= 0) return;
    
    // Konvertera vikt till pounds
    const weightInPounds = weight * 2.20462;
    
    // Beräkna kalorier baserat på aktivitetsnivå (Hormozi-metoden)
    const calories = Math.round(weightInPounds * activityLevel);
    
    // Protein: 1g per pound kroppsvikt
    const protein = Math.round(weightInPounds);
    
    // Fett: 0.3g per pound kroppsvikt
    const fat = Math.round(weightInPounds * 0.3);
    
    // Resterande kalorier till kolhydrater
    // Protein: 4 kcal/g, Fett: 9 kcal/g, Kolhydrater: 4 kcal/g
    const proteinCalories = protein * 4;
    const fatCalories = fat * 9;
    const remainingCalories = calories - proteinCalories - fatCalories;
    const carbs = Math.round(remainingCalories / 4);
    
    setTargetKcal(calories);
    setTargetProtein(protein);
    setTargetCarbs(carbs);
    setTargetFat(fat);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Daglig måltidsplanering</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-lg mx-auto">
          Planera dina måltider för dagen och se hur de bidrar till dina dagliga mål.
        </p>
        
        <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <Tabs defaultValue="manual" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="manual">Manuella mål</TabsTrigger>
                  <TabsTrigger value="auto">Beräkna mål</TabsTrigger>
                </TabsList>
                
                {activeTab === 'manual' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="targetKcal">Mål kalorier (kcal)</Label>
                      <Input 
                        id="targetKcal" 
                        type="number" 
                        value={targetKcal || ''}
                        onChange={(e) => setTargetKcal(parseInt(e.target.value) || 0)}
                        min={0}
                        placeholder="t.ex. 2000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="targetProtein">Mål protein (g)</Label>
                      <Input 
                        id="targetProtein" 
                        type="number" 
                        value={targetProtein || ''}
                        onChange={(e) => setTargetProtein(parseInt(e.target.value) || 0)}
                        min={0}
                        placeholder="t.ex. 150"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="targetCarbs">Mål kolhydrater (g)</Label>
                      <Input 
                        id="targetCarbs" 
                        type="number" 
                        value={targetCarbs || ''}
                        onChange={(e) => setTargetCarbs(parseInt(e.target.value) || 0)}
                        min={0}
                        placeholder="t.ex. 200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="targetFat">Mål fett (g)</Label>
                      <Input 
                        id="targetFat" 
                        type="number" 
                        value={targetFat || ''}
                        onChange={(e) => setTargetFat(parseInt(e.target.value) || 0)}
                        min={0}
                        placeholder="t.ex. 70"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Din vikt (kg)</Label>
                      <Input 
                        id="weight" 
                        type="number" 
                        value={weight}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWeight(val === '' ? '' : Number(val));
                        }}
                        min={1}
                        placeholder="Ange din vikt"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div 
                        className="p-4 border rounded-md text-center cursor-pointer hover:bg-secondary transition-colors"
                        onClick={() => calculateTargets(10)}
                      >
                        <div className="font-medium">Viktminskning</div>
                        <div className="text-sm text-muted-foreground">10x kroppsvikt</div>
                      </div>
                      <div 
                        className="p-4 border rounded-md text-center cursor-pointer hover:bg-secondary transition-colors"
                        onClick={() => calculateTargets(14)}
                      >
                        <div className="font-medium">Underhåll</div>
                        <div className="text-sm text-muted-foreground">14x kroppsvikt</div>
                      </div>
                      <div 
                        className="p-4 border rounded-md text-center cursor-pointer hover:bg-secondary transition-colors"
                        onClick={() => calculateTargets(18)}
                      >
                        <div className="font-medium">Muskelökning</div>
                        <div className="text-sm text-muted-foreground">18x kroppsvikt</div>
                      </div>
                    </div>
                    
                    {targetKcal > 0 && (
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex justify-between">
                          <span>Kalorier:</span>
                          <span className="font-medium">{targetKcal} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <span className="font-medium">{targetProtein}g ({Math.round(targetProtein * 4)} kcal)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kolhydrater:</span>
                          <span className="font-medium">{targetCarbs}g ({Math.round(targetCarbs * 4)} kcal)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fett:</span>
                          <span className="font-medium">{targetFat}g ({Math.round(targetFat * 9)} kcal)</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Tabs>
            </CardContent>
          </Card>
          
          <DailyMealPlanner 
            targetKcal={targetKcal}
            targetProtein={targetProtein}
            targetCarbs={targetCarbs}
            targetFat={targetFat}
          />
        </div>
      </main>
    </div>
  );
};

export default DailyMealPlannerPage; 