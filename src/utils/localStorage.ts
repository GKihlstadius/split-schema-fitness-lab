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
}

const MEAL_PLANS_KEY = 'gym-janne-meal-plans';

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