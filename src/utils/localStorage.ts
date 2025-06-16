// Typer för måltidsdata
export interface MealNutrition {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface MealItem {
  id: string;
  foodId: string;
  grams: number;
}

export interface Meal {
  id: string;
  name: string;
  items: MealItem[];
  nutrition: MealNutrition;
  category?: string; // Frukost, Lunch, Middag, Mellanmål
  isTemplate?: boolean; // Om det är en mall
  isFavorite?: boolean; // Om det är en favorit
}

export interface SavedMealPlan {
  id: string;
  date: string;
  name: string;
  meals: Meal[];
  totals: MealNutrition;
  targetKcal: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  tags?: string[]; // Taggar för att organisera planer
  isTemplate?: boolean; // Om planen är en mall
}

export interface MealTemplate {
  id: string;
  name: string;
  description?: string;
  meal: Meal;
  category: string;
  tags?: string[];
  createdAt: string;
  usageCount?: number;
}

export interface QuickMeal {
  id: string;
  name: string;
  items: MealItem[];
  nutrition: MealNutrition;
  category: string;
  prepTime?: number; // Förberedelsetid i minuter
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  createdAt: string;
  lastUsed?: string;
  usageCount?: number;
}

const MEAL_PLANS_KEY = 'gym-janne-meal-plans';
const MEAL_TEMPLATES_KEY = 'gym-janne-meal-templates';
const QUICK_MEALS_KEY = 'gym-janne-quick-meals';
const USER_PREFERENCES_KEY = 'gym-janne-meal-preferences';
const DAILY_PLAN_KEY = 'gym-janne-daily-plan';
const DAILY_GOALS_KEY = 'gym-janne-daily-goals';
const SELECTED_WORKOUT_PROGRAM_KEY = 'gym-janne-selected-workout-program';

// Användarpreferenser för måltidsplanering
export interface UserMealPreferences {
  defaultMealTimes: string[]; // t.ex. ["Frukost", "Lunch", "Middag", "Kvällsmål"]
  favoriteCategories: string[];
  dietaryRestrictions?: string[];
  allergies?: string[];
  commonPortionSizes: Record<string, number>; // Vanliga portionsstorlekar för olika livsmedel
  quickAccessFoods: string[]; // Livsmedels-ID:n för snabbåtkomst
}

// Hämta alla sparade måltidsplaner
export const getSavedMealPlans = (): SavedMealPlan[] => {
  const savedPlans = localStorage.getItem(MEAL_PLANS_KEY);
  if (!savedPlans) return [];
  
  try {
    return JSON.parse(savedPlans);
  } catch (error) {
    console.error('Fel vid inläsning av sparade måltidsplaner:', error);
    return [];
  }
};

// Spara en måltidsplan
export const saveMealPlan = (mealPlan: SavedMealPlan): void => {
  const currentPlans = getSavedMealPlans();
  
  // Kontrollera om planen redan finns och uppdatera i så fall
  const existingPlanIndex = currentPlans.findIndex(plan => plan.id === mealPlan.id);
  
  if (existingPlanIndex >= 0) {
    currentPlans[existingPlanIndex] = mealPlan;
  } else {
    currentPlans.push(mealPlan);
  }
  
  localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(currentPlans));
};

// Ta bort en måltidsplan
export const deleteMealPlan = (id: string): void => {
  const currentPlans = getSavedMealPlans();
  const updatedPlans = currentPlans.filter(plan => plan.id !== id);
  localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(updatedPlans));
};

// Hämta en specifik måltidsplan
export const getMealPlan = (id: string): SavedMealPlan | undefined => {
  const currentPlans = getSavedMealPlans();
  return currentPlans.find(plan => plan.id === id);
};

// === MÅLTIDSMALLAR ===

// Hämta alla måltidsmallar
export const getMealTemplates = (): MealTemplate[] => {
  const savedTemplates = localStorage.getItem(MEAL_TEMPLATES_KEY);
  if (!savedTemplates) return [];
  
  try {
    return JSON.parse(savedTemplates);
  } catch (error) {
    console.error('Fel vid inläsning av måltidsmallar:', error);
    return [];
  }
};

// Spara en måltidsmall
export const saveMealTemplate = (template: MealTemplate): void => {
  const currentTemplates = getMealTemplates();
  
  const existingTemplateIndex = currentTemplates.findIndex(t => t.id === template.id);
  
  if (existingTemplateIndex >= 0) {
    currentTemplates[existingTemplateIndex] = template;
  } else {
    currentTemplates.push(template);
  }
  
  localStorage.setItem(MEAL_TEMPLATES_KEY, JSON.stringify(currentTemplates));
};

// Ta bort en måltidsmall
export const deleteMealTemplate = (id: string): void => {
  const currentTemplates = getMealTemplates();
  const updatedTemplates = currentTemplates.filter(template => template.id !== id);
  localStorage.setItem(MEAL_TEMPLATES_KEY, JSON.stringify(updatedTemplates));
};

// === SNABBMÅLTIDER ===

// Hämta alla snabbmåltider
export const getQuickMeals = (): QuickMeal[] => {
  const savedQuickMeals = localStorage.getItem(QUICK_MEALS_KEY);
  if (!savedQuickMeals) return [];
  
  try {
    return JSON.parse(savedQuickMeals);
  } catch (error) {
    console.error('Fel vid inläsning av snabbmåltider:', error);
    return [];
  }
};

// Spara en snabbmåltid
export const saveQuickMeal = (quickMeal: QuickMeal): void => {
  const currentQuickMeals = getQuickMeals();
  
  const existingQuickMealIndex = currentQuickMeals.findIndex(qm => qm.id === quickMeal.id);
  
  if (existingQuickMealIndex >= 0) {
    currentQuickMeals[existingQuickMealIndex] = quickMeal;
  } else {
    currentQuickMeals.push(quickMeal);
  }
  
  localStorage.setItem(QUICK_MEALS_KEY, JSON.stringify(currentQuickMeals));
};

// Ta bort en snabbmåltid
export const deleteQuickMeal = (id: string): void => {
  const currentQuickMeals = getQuickMeals();
  const updatedQuickMeals = currentQuickMeals.filter(qm => qm.id !== id);
  localStorage.setItem(QUICK_MEALS_KEY, JSON.stringify(updatedQuickMeals));
};

// Uppdatera användningsstatistik för en snabbmåltid
export const updateQuickMealUsage = (id: string): void => {
  const quickMeals = getQuickMeals();
  const updatedQuickMeals = quickMeals.map(qm => {
    if (qm.id === id) {
      return {
        ...qm,
        lastUsed: new Date().toISOString(),
        usageCount: (qm.usageCount || 0) + 1
      };
    }
    return qm;
  });
  
  localStorage.setItem(QUICK_MEALS_KEY, JSON.stringify(updatedQuickMeals));
};

// === ANVÄNDARPREFERENSER ===

// Hämta användarpreferenser
export const getUserMealPreferences = (): UserMealPreferences => {
  const savedPreferences = localStorage.getItem(USER_PREFERENCES_KEY);
  if (!savedPreferences) {
    // Returnera standardpreferenser
    return {
      defaultMealTimes: ['Frukost', 'Lunch', 'Middag', 'Kvällsmål'],
      favoriteCategories: [],
      commonPortionSizes: {},
      quickAccessFoods: []
    };
  }
  
  try {
    return JSON.parse(savedPreferences);
  } catch (error) {
    console.error('Fel vid inläsning av användarpreferenser:', error);
    return {
      defaultMealTimes: ['Frukost', 'Lunch', 'Middag', 'Kvällsmål'],
      favoriteCategories: [],
      commonPortionSizes: {},
      quickAccessFoods: []
    };
  }
};

// Spara användarpreferenser
export const saveUserMealPreferences = (preferences: UserMealPreferences): void => {
  localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
};

// === HJÄLPFUNKTIONER ===

// Sök i måltidsplaner
export const searchMealPlans = (query: string, tags?: string[]): SavedMealPlan[] => {
  const allPlans = getSavedMealPlans();
  const lowerQuery = query.toLowerCase();
  
  return allPlans.filter(plan => {
    const matchesQuery = plan.name.toLowerCase().includes(lowerQuery) ||
                        plan.meals.some(meal => meal.name.toLowerCase().includes(lowerQuery));
    
    const matchesTags = !tags || tags.length === 0 || 
                       (plan.tags && tags.some(tag => plan.tags!.includes(tag)));
    
    return matchesQuery && matchesTags;
  });
};

// Hämta mest använda snabbmåltider
export const getMostUsedQuickMeals = (limit: number = 10): QuickMeal[] => {
  const quickMeals = getQuickMeals();
  return quickMeals
    .filter(qm => qm.usageCount && qm.usageCount > 0)
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, limit);
};

// Hämta senast använda snabbmåltider
export const getRecentlyUsedQuickMeals = (limit: number = 10): QuickMeal[] => {
  const quickMeals = getQuickMeals();
  return quickMeals
    .filter(qm => qm.lastUsed)
    .sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())
    .slice(0, limit);
};

// Exportera all måltidsdata (för backup)
export const exportMealData = () => {
  return {
    mealPlans: getSavedMealPlans(),
    mealTemplates: getMealTemplates(),
    quickMeals: getQuickMeals(),
    userPreferences: getUserMealPreferences(),
    exportDate: new Date().toISOString()
  };
};

// Importera måltidsdata (från backup)
export const importMealData = (data: any): boolean => {
  try {
    if (data.mealPlans) {
      localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(data.mealPlans));
    }
    if (data.mealTemplates) {
      localStorage.setItem(MEAL_TEMPLATES_KEY, JSON.stringify(data.mealTemplates));
    }
    if (data.quickMeals) {
      localStorage.setItem(QUICK_MEALS_KEY, JSON.stringify(data.quickMeals));
    }
    if (data.userPreferences) {
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(data.userPreferences));
    }
    return true;
  } catch (error) {
    console.error('Fel vid import av måltidsdata:', error);
    return false;
  }
};

// === DAGENS PLAN ===

export interface DailyGoals {
  targetKcal: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  weight?: number;
  selectedPreset?: string;
}

// Spara dagens måltidsplan
export const saveDailyPlan = (meals: Meal[]): void => {
  try {
    const dailyPlan = {
      date: new Date().toDateString(), // Sparar dagens datum
      meals: meals,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(DAILY_PLAN_KEY, JSON.stringify(dailyPlan));
  } catch (error) {
    console.error('Fel vid sparning av dagens plan:', error);
  }
};

// Ladda dagens måltidsplan
export const loadDailyPlan = (): Meal[] => {
  try {
    const savedPlan = localStorage.getItem(DAILY_PLAN_KEY);
    if (!savedPlan) return [];
    
    const dailyPlan = JSON.parse(savedPlan);
    const today = new Date().toDateString();
    
    // Om det är samma dag, ladda planen, annars returnera tom array
    if (dailyPlan.date === today) {
      return dailyPlan.meals || [];
    } else {
      // Rensa gammal plan från annan dag
      localStorage.removeItem(DAILY_PLAN_KEY);
      return [];
    }
  } catch (error) {
    console.error('Fel vid laddning av dagens plan:', error);
    return [];
  }
};

// Spara dagens mål
export const saveDailyGoals = (goals: DailyGoals): void => {
  try {
    localStorage.setItem(DAILY_GOALS_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Fel vid sparning av dagens mål:', error);
  }
};

// Ladda dagens mål
export const loadDailyGoals = (): DailyGoals | null => {
  try {
    const savedGoals = localStorage.getItem(DAILY_GOALS_KEY);
    if (!savedGoals) return null;
    
    return JSON.parse(savedGoals);
  } catch (error) {
    console.error('Fel vid laddning av dagens mål:', error);
    return null;
  }
};

// Rensa dagens plan (t.ex. när användaren vill börja om)
export const clearDailyPlan = (): void => {
  try {
    localStorage.removeItem(DAILY_PLAN_KEY);
  } catch (error) {
    console.error('Fel vid rensning av dagens plan:', error);
  }
};

// === TRÄNINGSPROGRAM ===

// Spara valt träningsprogram
export const saveSelectedWorkoutProgram = (programId: string): void => {
  try {
    localStorage.setItem(SELECTED_WORKOUT_PROGRAM_KEY, programId);
  } catch (error) {
    console.error('Fel vid sparning av valt träningsprogram:', error);
  }
};

// Ladda valt träningsprogram
export const loadSelectedWorkoutProgram = (): string | null => {
  try {
    return localStorage.getItem(SELECTED_WORKOUT_PROGRAM_KEY);
  } catch (error) {
    console.error('Fel vid laddning av valt träningsprogram:', error);
    return null;
  }
}; 