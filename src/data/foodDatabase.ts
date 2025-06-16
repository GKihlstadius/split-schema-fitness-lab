export interface FoodItem {
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  kcal: number;
  category?: string;
}

export const foodDatabase: Record<string, FoodItem> = {
  "kycklingfilé": { 
    name: "Kycklingfilé", 
    protein: 23, 
    carbs: 0, 
    fat: 2, 
    kcal: 110, 
    category: "Protein" 
  },
  "nötfärs": { 
    name: "Nötfärs (10%)", 
    protein: 20, 
    carbs: 0, 
    fat: 10, 
    kcal: 170, 
    category: "Protein" 
  },
  "lax": { 
    name: "Lax", 
    protein: 20, 
    carbs: 0, 
    fat: 13, 
    kcal: 206, 
    category: "Protein" 
  },
  "ägg": { 
    name: "Ägg", 
    protein: 13, 
    carbs: 1.1, 
    fat: 10, 
    kcal: 143, 
    category: "Protein" 
  },
  "proteinpulver": { 
    name: "Proteinpulver (whey)", 
    protein: 80, 
    carbs: 7, 
    fat: 2, 
    kcal: 370, 
    category: "Protein" 
  },
  "quorn": { 
    name: "Quorn", 
    protein: 14, 
    carbs: 4, 
    fat: 3, 
    kcal: 100, 
    category: "Protein" 
  },
  "tofu": { 
    name: "Tofu", 
    protein: 8, 
    carbs: 2, 
    fat: 4, 
    kcal: 76, 
    category: "Protein" 
  },
  "ris": { 
    name: "Ris (kokt)", 
    protein: 2.7, 
    carbs: 28, 
    fat: 0.3, 
    kcal: 130, 
    category: "Kolhydrater" 
  },
  "pasta": { 
    name: "Pasta (kokt)", 
    protein: 5, 
    carbs: 25, 
    fat: 1, 
    kcal: 131, 
    category: "Kolhydrater" 
  },
  "potatis": { 
    name: "Potatis (kokt)", 
    protein: 2, 
    carbs: 17, 
    fat: 0.1, 
    kcal: 77, 
    category: "Kolhydrater" 
  },
  "quinoa": { 
    name: "Quinoa (kokt)", 
    protein: 4.4, 
    carbs: 21.3, 
    fat: 1.9, 
    kcal: 120, 
    category: "Kolhydrater" 
  },
  "havregryn": { 
    name: "Havregryn", 
    protein: 13, 
    carbs: 55, 
    fat: 7, 
    kcal: 371, 
    category: "Kolhydrater" 
  },
  "bröd": { 
    name: "Bröd (fullkorn)", 
    protein: 8, 
    carbs: 43, 
    fat: 3, 
    kcal: 250, 
    category: "Kolhydrater" 
  },
  "avokado": { 
    name: "Avokado", 
    protein: 2, 
    carbs: 9, 
    fat: 15, 
    kcal: 160, 
    category: "Fett" 
  },
  "olivolja": { 
    name: "Olivolja", 
    protein: 0, 
    carbs: 0, 
    fat: 100, 
    kcal: 884, 
    category: "Fett" 
  },
  "smör": { 
    name: "Smör", 
    protein: 0.6, 
    carbs: 0.6, 
    fat: 81, 
    kcal: 717, 
    category: "Fett" 
  },
  "nötter": { 
    name: "Nötter (blandade)", 
    protein: 15, 
    carbs: 16, 
    fat: 50, 
    kcal: 607, 
    category: "Fett" 
  },
  "broccoli": { 
    name: "Broccoli", 
    protein: 2.8, 
    carbs: 7, 
    fat: 0.4, 
    kcal: 34, 
    category: "Grönsaker" 
  },
  "spenat": { 
    name: "Spenat", 
    protein: 2.9, 
    carbs: 3.6, 
    fat: 0.4, 
    kcal: 23, 
    category: "Grönsaker" 
  },
  "tomat": { 
    name: "Tomat", 
    protein: 0.9, 
    carbs: 3.9, 
    fat: 0.2, 
    kcal: 18, 
    category: "Grönsaker" 
  },
  "gurka": { 
    name: "Gurka", 
    protein: 0.7, 
    carbs: 3.6, 
    fat: 0.1, 
    kcal: 15, 
    category: "Grönsaker" 
  },
  "banan": { 
    name: "Banan", 
    protein: 1.1, 
    carbs: 23, 
    fat: 0.3, 
    kcal: 89, 
    category: "Frukt" 
  },
  "äpple": { 
    name: "Äpple", 
    protein: 0.3, 
    carbs: 14, 
    fat: 0.2, 
    kcal: 52, 
    category: "Frukt" 
  },
  "jordgubbar": { 
    name: "Jordgubbar", 
    protein: 0.7, 
    carbs: 7.7, 
    fat: 0.3, 
    kcal: 32, 
    category: "Frukt" 
  },
  "mjölk": { 
    name: "Mjölk (3%)", 
    protein: 3.4, 
    carbs: 4.8, 
    fat: 3, 
    kcal: 60, 
    category: "Mejeri" 
  },
  "kvarg": { 
    name: "Kvarg", 
    protein: 11, 
    carbs: 4, 
    fat: 0.2, 
    kcal: 63, 
    category: "Mejeri" 
  },
  "yoghurt": { 
    name: "Yoghurt (naturell)", 
    protein: 3.5, 
    carbs: 4.7, 
    fat: 3.8, 
    kcal: 69, 
    category: "Mejeri" 
  }
};

export function getFoodCategories(): string[] {
  const categories = new Set<string>();
  
  Object.values(foodDatabase).forEach(food => {
    if (food.category) {
      categories.add(food.category);
    }
  });
  
  return Array.from(categories).sort();
}

export function getFoodsByCategory(): Record<string, FoodItem[]> {
  const foodsByCategory: Record<string, FoodItem[]> = {};
  
  Object.values(foodDatabase).forEach(food => {
    const category = food.category || 'Övrigt';
    
    if (!foodsByCategory[category]) {
      foodsByCategory[category] = [];
    }
    
    foodsByCategory[category].push(food);
  });
  
  // Sortera livsmedel inom varje kategori
  Object.keys(foodsByCategory).forEach(category => {
    foodsByCategory[category].sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return foodsByCategory;
} 