import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { DailyMealPlanner } from '@/components/DailyMealPlanner';
import { QuickMeals } from '@/components/QuickMeals';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Meal } from '@/utils/localStorage';

const DailyMealPlannerPage = () => {
  const [targetKcal, setTargetKcal] = useState<number>(0);
  const [targetProtein, setTargetProtein] = useState<number>(0);
  const [targetCarbs, setTargetCarbs] = useState<number>(0);
  const [targetFat, setTargetFat] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('manual');
  const [weight, setWeight] = useState<number | ''>('');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [goalType, setGoalType] = useState<string>('maintenance');
  const [customMultiplier, setCustomMultiplier] = useState<number>(14);
  const [proteinMultiplier, setProteinMultiplier] = useState<number>(1);
  const [fatMultiplier, setFatMultiplier] = useState<number>(0.3);
  const [selectedMeal, setSelectedMeal] = useState<Meal | undefined>(undefined);
  
  // Aktivitetsnivåer enligt Hormozi-modellen
  const activityLevels = {
    sedentary: { name: "Stillasittande", baseMultiplier: 12 },
    light: { name: "Lätt aktiv", baseMultiplier: 13 },
    moderate: { name: "Måttligt aktiv", baseMultiplier: 14 },
    active: { name: "Mycket aktiv", baseMultiplier: 15 },
    veryActive: { name: "Extremt aktiv", baseMultiplier: 16 }
  };
  
  // Måltyper
  const goalTypes = {
    aggressiveCut: { name: "Aggressiv viktminskning", adjustment: -4 },
    moderateCut: { name: "Måttlig viktminskning", adjustment: -2 },
    mildCut: { name: "Lätt viktminskning", adjustment: -1 },
    maintenance: { name: "Underhåll", adjustment: 0 },
    mildBulk: { name: "Lätt muskelökning", adjustment: 1 },
    moderateBulk: { name: "Måttlig muskelökning", adjustment: 2 },
    aggressiveBulk: { name: "Aggressiv muskelökning", adjustment: 4 }
  };
  
  // Presets för olika mål
  const presets = [
    // Extrema viktminskningspresets
    { name: "Crash Diet", multiplier: 6, description: "Mycket riskabel snabb viktminskning", category: "cut", warning: true },
    { name: "Hardcore Cut", multiplier: 8, description: "Extremt aggressiv viktminskning", category: "cut", warning: true },
    { name: "Bodybuilding Cut", multiplier: 9, description: "Tävlingsförberedelse cut", category: "cut" },
    { name: "Aggressiv viktminskning", multiplier: 10, description: "Snabb viktminskning", category: "cut" },
    { name: "Snabb viktminskning", multiplier: 11, description: "Måttligt aggressiv viktminskning", category: "cut" },
    { name: "Måttlig viktminskning", multiplier: 12, description: "Balanserad viktminskning", category: "cut" },
    { name: "Lätt viktminskning", multiplier: 13, description: "Långsam, hållbar viktminskning", category: "cut" },
    
    // Underhållspresets
    { name: "Låg underhåll", multiplier: 13.5, description: "Underhåll för stillasittande", category: "maintenance" },
    { name: "Underhåll", multiplier: 14, description: "Standard underhåll", category: "maintenance" },
    { name: "Aktiv underhåll", multiplier: 14.5, description: "Underhåll för aktiva personer", category: "maintenance" },
    { name: "Hög underhåll", multiplier: 15, description: "Underhåll för mycket aktiva", category: "maintenance" },
    
    // Muskelökningspresets
    { name: "Mini Bulk", multiplier: 15, description: "Minimal muskelökning", category: "bulk" },
    { name: "Lätt muskelökning", multiplier: 16, description: "Långsam, ren muskelökning", category: "bulk" },
    { name: "Klassisk bulk", multiplier: 17, description: "Traditionell muskelökning", category: "bulk" },
    { name: "Måttlig muskelökning", multiplier: 18, description: "Balanserad muskelökning", category: "bulk" },
    { name: "Aggressiv muskelökning", multiplier: 20, description: "Snabb muskelökning", category: "bulk" },
    { name: "Dirty Bulk", multiplier: 22, description: "Mycket snabb muskelökning", category: "bulk", warning: true },
    { name: "Extreme Bulk", multiplier: 24, description: "Extremt aggressiv muskelökning", category: "bulk", warning: true },
    
    // Specialpresets
    { name: "Äldre vuxen (50+)", multiplier: 12, description: "Anpassat för äldre metabolism", category: "special" },
    { name: "Tonåring aktiv", multiplier: 16, description: "För växande tonåringar", category: "special" },
    { name: "Tonåring mycket aktiv", multiplier: 18, description: "För mycket aktiva tonåringar", category: "special" },
    { name: "Ektomorf bulk", multiplier: 20, description: "För personer som lätt går ner i vikt", category: "special" },
    { name: "Endomorf cut", multiplier: 10, description: "För personer som lätt går upp i vikt", category: "special" },
    { name: "Kvinnlig PMS-vecka", multiplier: 13, description: "Anpassat för hormonella förändringar", category: "special" },
    { name: "Post-sjukdom", multiplier: 15, description: "Återhämtning efter sjukdom", category: "special" },
    { name: "Graviditet trimester 2-3", multiplier: 15.5, description: "Under graviditet (konsultera läkare)", category: "special", warning: true },
    
    // Idrottspecifika presets
    { name: "Styrkelyftare off-season", multiplier: 19, description: "För kraftsport", category: "sport" },
    { name: "Styrkelyftare pre-comp", multiplier: 11, description: "Före tävling", category: "sport" },
    { name: "Löpare volymperiod", multiplier: 16, description: "Uthållighetsträning", category: "sport" },
    { name: "Löpare tävlingsperiod", multiplier: 14, description: "Tävlingsforberedelse", category: "sport" },
    { name: "Crossfit atlet", multiplier: 17, description: "Blandad träning", category: "sport" },
    { name: "Bodybuilder off-season", multiplier: 18, description: "Muskeluppbyggnad", category: "sport" },
    { name: "Bodybuilder prep", multiplier: 9, description: "Tävlingsförberedelse", category: "sport" },
    { name: "MMA fighter", multiplier: 15, description: "Kampsport", category: "sport" },
    
    // Livsstilspresets
    { name: "Kontorsarbetare", multiplier: 12, description: "Stillasittande jobb", category: "lifestyle" },
    { name: "Byggarbetare", multiplier: 16, description: "Fysiskt krävande jobb", category: "lifestyle" },
    { name: "Sjuksköterska", multiplier: 14, description: "Måttligt aktiv på jobbet", category: "lifestyle" },
    { name: "Student", multiplier: 13, description: "Stillasittande studier", category: "lifestyle" },
    { name: "Förälder småbarn", multiplier: 14.5, description: "Aktiv med barn", category: "lifestyle" },
    { name: "Pensionär aktiv", multiplier: 13, description: "Aktiv efter pension", category: "lifestyle" },
    
    // Säsongs-/periodpresets
    { name: "Sommarsemester", multiplier: 12, description: "Viktnedgång inför sommaren", category: "seasonal" },
    { name: "Vinterbulk", multiplier: 17, description: "Muskelökning under vintern", category: "seasonal" },
    { name: "Nyårsresolution", multiplier: 11, description: "Snabb start på året", category: "seasonal" },
    { name: "Före bröllop", multiplier: 10, description: "Viktminskning inför stora dagen", category: "seasonal" },
    { name: "Post-semester återhämtning", multiplier: 13, description: "Tillbaka efter semester", category: "seasonal" },
  ];
  
  // Beräkna mål baserat på vikt, aktivitetsnivå och mål
  const calculateTargets = () => {
    if (typeof weight !== 'number' || weight <= 0) return;
    
    // Konvertera vikt till pounds
    const weightInPounds = weight * 2.20462;
    
    // Hämta basmultiplikatorn för aktivitetsnivån
    const baseMultiplier = activityLevels[activityLevel as keyof typeof activityLevels].baseMultiplier;
    
    // Justera multiplikatorn baserat på målet
    const goalAdjustment = goalTypes[goalType as keyof typeof goalTypes].adjustment;
    const finalMultiplier = baseMultiplier + goalAdjustment;
    
    // Uppdatera den anpassade multiplikatorn för visning
    setCustomMultiplier(finalMultiplier);
    
    // Beräkna kalorier baserat på den slutliga multiplikatorn
    const calories = Math.round(weightInPounds * finalMultiplier);
    
    // Protein: använd den valda proteinmultiplikatorn per pound kroppsvikt
    const protein = Math.round(weightInPounds * proteinMultiplier);
    
    // Fett: använd den valda fettmultiplikatorn per pound kroppsvikt
    const fat = Math.round(weightInPounds * fatMultiplier);
    
    // Resterande kalorier till kolhydrater
    // Protein: 4 kcal/g, Fett: 9 kcal/g, Kolhydrater: 4 kcal/g
    const proteinCalories = protein * 4;
    const fatCalories = fat * 9;
    const remainingCalories = calories - proteinCalories - fatCalories;
    const carbs = Math.max(0, Math.round(remainingCalories / 4)); // Säkerställ att kolhydrater inte blir negativt
    
    setTargetKcal(calories);
    setTargetProtein(protein);
    setTargetCarbs(carbs);
    setTargetFat(fat);
  };
  
  // Använd förinställda multiplikatorer
  const usePresetMultiplier = (calorieMultiplier: number) => {
    if (typeof weight !== 'number' || weight <= 0) return;
    
    // Konvertera vikt till pounds
    const weightInPounds = weight * 2.20462;
    
    // Beräkna kalorier baserat på den angivna multiplikatorn
    const calories = Math.round(weightInPounds * calorieMultiplier);
    
    // Protein: 1g per pound kroppsvikt
    const protein = Math.round(weightInPounds);
    
    // Fett: 0.3g per pound kroppsvikt
    const fat = Math.round(weightInPounds * 0.3);
    
    // Resterande kalorier till kolhydrater
    const proteinCalories = protein * 4;
    const fatCalories = fat * 9;
    const remainingCalories = calories - proteinCalories - fatCalories;
    const carbs = Math.max(0, Math.round(remainingCalories / 4));
    
    setTargetKcal(calories);
    setTargetProtein(protein);
    setTargetCarbs(carbs);
    setTargetFat(fat);
    setCustomMultiplier(calorieMultiplier);
  };
  
  const handleMealSelect = (meal: Meal) => {
    // Denna funktion kan användas för att hantera valda måltider från QuickMeals
    setSelectedMeal(meal);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col items-center px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Daglig måltidsplanering</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-lg">
          Planera dina måltider för dagen och se hur de bidrar till dina dagliga mål enligt Hormozi-modellen.
        </p>
        
        <div className="grid grid-cols-1 gap-8 max-w-6xl">
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
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="activityLevel">Aktivitetsnivå</Label>
                        <Select 
                          value={activityLevel} 
                          onValueChange={setActivityLevel}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Välj aktivitetsnivå" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(activityLevels).map(([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value.name} ({value.baseMultiplier}x)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="goalType">Mål</Label>
                        <Select 
                          value={goalType} 
                          onValueChange={setGoalType}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Välj mål" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(goalTypes).map(([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value.name} ({value.adjustment > 0 ? '+' : ''}{value.adjustment}x)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="proteinMultiplier">Protein per pound kroppsvikt</Label>
                            <span className="text-sm">{proteinMultiplier}g</span>
                          </div>
                          <Slider
                            id="proteinMultiplier"
                            min={0.8}
                            max={1.5}
                            step={0.1}
                            value={[proteinMultiplier]}
                            onValueChange={(value) => setProteinMultiplier(value[0])}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="fatMultiplier">Fett per pound kroppsvikt</Label>
                            <span className="text-sm">{fatMultiplier}g</span>
                          </div>
                          <Slider
                            id="fatMultiplier"
                            min={0.2}
                            max={0.5}
                            step={0.05}
                            value={[fatMultiplier]}
                            onValueChange={(value) => setFatMultiplier(value[0])}
                          />
                        </div>
                        
                        <Button 
                          className="w-full mt-2" 
                          onClick={calculateTargets}
                        >
                          Beräkna mål
                        </Button>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">Snabbval - Hormozi-presets</h3>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm text-muted-foreground">Viktminskning</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {presets
                              .filter(preset => preset.category === 'cut')
                              .map((preset, index) => (
                                <div 
                                  key={index}
                                  className={`p-3 border rounded-md text-center cursor-pointer hover:bg-secondary transition-colors ${preset.warning ? 'border-red-300 bg-red-50' : ''}`}
                                  onClick={() => usePresetMultiplier(preset.multiplier)}
                                >
                                  <div className="font-medium">{preset.name}</div>
                                  <div className="text-xs text-muted-foreground">{preset.multiplier}x • {preset.description}</div>
                                  {preset.warning && <div className="text-xs text-red-600 mt-1">⚠️ Riskabel</div>}
                                </div>
                              ))
                            }
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm text-muted-foreground">Underhåll</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {presets
                              .filter(preset => preset.category === 'maintenance')
                              .map((preset, index) => (
                                <div 
                                  key={index}
                                  className="p-3 border rounded-md text-center cursor-pointer hover:bg-secondary transition-colors"
                                  onClick={() => usePresetMultiplier(preset.multiplier)}
                                >
                                  <div className="font-medium">{preset.name}</div>
                                  <div className="text-xs text-muted-foreground">{preset.multiplier}x • {preset.description}</div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm text-muted-foreground">Muskelökning</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {presets
                              .filter(preset => preset.category === 'bulk')
                              .map((preset, index) => (
                                <div 
                                  key={index}
                                  className={`p-3 border rounded-md text-center cursor-pointer hover:bg-secondary transition-colors ${preset.warning ? 'border-red-300 bg-red-50' : ''}`}
                                  onClick={() => usePresetMultiplier(preset.multiplier)}
                                >
                                  <div className="font-medium">{preset.name}</div>
                                  <div className="text-xs text-muted-foreground">{preset.multiplier}x • {preset.description}</div>
                                  {preset.warning && <div className="text-xs text-red-600 mt-1">⚠️ Riskabel</div>}
                                </div>
                              ))
                            }
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm text-muted-foreground">Specialanpassade</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {presets
                              .filter(preset => preset.category === 'special')
                              .map((preset, index) => (
                                <div 
                                  key={index}
                                  className={`p-3 border rounded-md text-center cursor-pointer hover:bg-secondary transition-colors ${preset.warning ? 'border-orange-300 bg-orange-50' : ''}`}
                                  onClick={() => usePresetMultiplier(preset.multiplier)}
                                >
                                  <div className="font-medium">{preset.name}</div>
                                  <div className="text-xs text-muted-foreground">{preset.multiplier}x • {preset.description}</div>
                                  {preset.warning && <div className="text-xs text-orange-600 mt-1">⚠️ Konsultera expert</div>}
                                </div>
                              ))
                            }
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm text-muted-foreground">Idrottsspecifika</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {presets
                              .filter(preset => preset.category === 'sport')
                              .map((preset, index) => (
                                <div 
                                  key={index}
                                  className="p-3 border rounded-md text-center cursor-pointer hover:bg-secondary transition-colors"
                                  onClick={() => usePresetMultiplier(preset.multiplier)}
                                >
                                  <div className="font-medium">{preset.name}</div>
                                  <div className="text-xs text-muted-foreground">{preset.multiplier}x • {preset.description}</div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm text-muted-foreground">Livsstil</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {presets
                              .filter(preset => preset.category === 'lifestyle')
                              .map((preset, index) => (
                                <div 
                                  key={index}
                                  className="p-3 border rounded-md text-center cursor-pointer hover:bg-secondary transition-colors"
                                  onClick={() => usePresetMultiplier(preset.multiplier)}
                                >
                                  <div className="font-medium">{preset.name}</div>
                                  <div className="text-xs text-muted-foreground">{preset.multiplier}x • {preset.description}</div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm text-muted-foreground">Säsongs-/Period</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {presets
                              .filter(preset => preset.category === 'seasonal')
                              .map((preset, index) => (
                                <div 
                                  key={index}
                                  className="p-3 border rounded-md text-center cursor-pointer hover:bg-secondary transition-colors"
                                  onClick={() => usePresetMultiplier(preset.multiplier)}
                                >
                                  <div className="font-medium">{preset.name}</div>
                                  <div className="text-xs text-muted-foreground">{preset.multiplier}x • {preset.description}</div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {targetKcal > 0 && (
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex justify-between">
                          <span>Kaloriforbruk:</span>
                          <span className="font-medium">{weight && typeof weight === 'number' ? Math.round(weight * 2.20462 * customMultiplier) : 0} kcal ({customMultiplier}x)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kalorier:</span>
                          <span className="font-medium">{targetKcal} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <span className="font-medium">{targetProtein}g ({Math.round(targetProtein * 4)} kcal, {Math.round((targetProtein * 4 / targetKcal) * 100)}%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kolhydrater:</span>
                          <span className="font-medium">{targetCarbs}g ({Math.round(targetCarbs * 4)} kcal, {Math.round((targetCarbs * 4 / targetKcal) * 100)}%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fett:</span>
                          <span className="font-medium">{targetFat}g ({Math.round(targetFat * 9)} kcal, {Math.round((targetFat * 9 / targetKcal) * 100)}%)</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Snabbmåltider */}
          <QuickMeals 
            onMealSelect={handleMealSelect}
            currentMeal={selectedMeal}
          />
          
          {/* Måltidsplanering */}
          <DailyMealPlanner 
            targetKcal={targetKcal}
            targetProtein={targetProtein}
            targetCarbs={targetCarbs}
            targetFat={targetFat}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyMealPlannerPage; 