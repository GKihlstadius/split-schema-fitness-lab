import * as XLSX from 'xlsx';

export interface FoodItem {
  id: string;
  name: string;
  group: string;
  protein: number;
  carbs: number;
  fat: number;
  kcal: number;
  category?: string;
  fiber?: number;
}

// Kategorier baserade på livsmedelsgrupper
const categoryMapping: Record<string, string> = {
  'Kött': 'Protein',
  'Fågel': 'Protein',
  'Fisk och skaldjur': 'Protein',
  'Ägg': 'Protein',
  'Mjölk och mejeri': 'Mejeri',
  'Ost': 'Mejeri',
  'Baljväxter': 'Protein',
  'Nötter och frön': 'Fett',
  'Spannmål': 'Kolhydrater',
  'Potatis och rotfrukter': 'Kolhydrater',
  'Grönsaker': 'Grönsaker',
  'Frukt och bär': 'Frukt',
  'Fett och olja': 'Fett',
  'Socker och sötsaker': 'Övrigt',
  'Drycker': 'Drycker',
};

// Inbyggd livsmedeldatabas som fallback
export const fallbackFoodDatabase: FoodItem[] = [
  // Protein
  { id: "food_1", name: "Kycklingfilé", group: "Fågel", protein: 23.1, carbs: 0, fat: 1.1, kcal: 107, category: "Protein" },
  { id: "food_2", name: "Nötfärs 10%", group: "Kött", protein: 20.9, carbs: 0, fat: 10.5, kcal: 179, category: "Protein" },
  { id: "food_3", name: "Lax", group: "Fisk och skaldjur", protein: 20.4, carbs: 0, fat: 13.4, kcal: 203, category: "Protein" },
  { id: "food_4", name: "Ägg", group: "Ägg", protein: 12.6, carbs: 0.7, fat: 10.9, kcal: 151, category: "Protein" },
  { id: "food_5", name: "Tonfisk i vatten", group: "Fisk och skaldjur", protein: 25.5, carbs: 0, fat: 1, kcal: 116, category: "Protein" },
  { id: "food_6", name: "Quorn", group: "Baljväxter", protein: 14.1, carbs: 4.3, fat: 3.1, kcal: 105, category: "Protein" },
  { id: "food_7", name: "Kikärtor (kokta)", group: "Baljväxter", protein: 8.4, carbs: 19, fat: 2.1, kcal: 127, category: "Protein" },
  
  // Mejeri
  { id: "food_8", name: "Kvarg 0.2%", group: "Mjölk och mejeri", protein: 12, carbs: 3.5, fat: 0.2, kcal: 63, category: "Mejeri" },
  { id: "food_9", name: "Grekisk yoghurt 10%", group: "Mjölk och mejeri", protein: 5.3, carbs: 3.8, fat: 10, kcal: 126, category: "Mejeri" },
  { id: "food_10", name: "Mjölk 3%", group: "Mjölk och mejeri", protein: 3.4, carbs: 4.9, fat: 3, kcal: 60, category: "Mejeri" },
  { id: "food_11", name: "Västerbottenost", group: "Ost", protein: 26, carbs: 0, fat: 31, kcal: 387, category: "Mejeri" },
  { id: "food_12", name: "Mozzarella", group: "Ost", protein: 19.5, carbs: 2.2, fat: 21.6, kcal: 280, category: "Mejeri" },
  
  // Kolhydrater
  { id: "food_13", name: "Ris (kokt)", group: "Spannmål", protein: 2.7, carbs: 28.2, fat: 0.3, kcal: 130, category: "Kolhydrater" },
  { id: "food_14", name: "Pasta (kokt)", group: "Spannmål", protein: 5.8, carbs: 30.9, fat: 0.9, kcal: 158, category: "Kolhydrater" },
  { id: "food_15", name: "Potatis (kokt)", group: "Potatis och rotfrukter", protein: 1.7, carbs: 16.1, fat: 0.1, kcal: 73, category: "Kolhydrater" },
  { id: "food_16", name: "Havregryn", group: "Spannmål", protein: 13.5, carbs: 55.7, fat: 7.1, kcal: 371, category: "Kolhydrater" },
  { id: "food_17", name: "Fullkornsbröd", group: "Spannmål", protein: 8.5, carbs: 43.4, fat: 2.9, kcal: 235, category: "Kolhydrater" },
  { id: "food_18", name: "Quinoa (kokt)", group: "Spannmål", protein: 4.4, carbs: 21.3, fat: 1.9, kcal: 120, category: "Kolhydrater" },
  
  // Grönsaker
  { id: "food_19", name: "Broccoli", group: "Grönsaker", protein: 2.8, carbs: 6.6, fat: 0.4, kcal: 34, category: "Grönsaker" },
  { id: "food_20", name: "Morot", group: "Grönsaker", protein: 0.9, carbs: 9.6, fat: 0.2, kcal: 41, category: "Grönsaker" },
  { id: "food_21", name: "Spenat", group: "Grönsaker", protein: 2.9, carbs: 3.6, fat: 0.4, kcal: 23, category: "Grönsaker" },
  { id: "food_22", name: "Tomat", group: "Grönsaker", protein: 0.9, carbs: 3.9, fat: 0.2, kcal: 18, category: "Grönsaker" },
  { id: "food_23", name: "Gurka", group: "Grönsaker", protein: 0.7, carbs: 3.6, fat: 0.1, kcal: 15, category: "Grönsaker" },
  
  // Frukt
  { id: "food_24", name: "Banan", group: "Frukt och bär", protein: 1.1, carbs: 22.8, fat: 0.3, kcal: 89, category: "Frukt" },
  { id: "food_25", name: "Äpple", group: "Frukt och bär", protein: 0.3, carbs: 13.8, fat: 0.2, kcal: 52, category: "Frukt" },
  { id: "food_26", name: "Blåbär", group: "Frukt och bär", protein: 0.7, carbs: 14.5, fat: 0.3, kcal: 57, category: "Frukt" },
  { id: "food_27", name: "Apelsin", group: "Frukt och bär", protein: 0.9, carbs: 11.8, fat: 0.1, kcal: 47, category: "Frukt" },
  
  // Fett
  { id: "food_28", name: "Olivolja", group: "Fett och olja", protein: 0, carbs: 0, fat: 100, kcal: 884, category: "Fett" },
  { id: "food_29", name: "Avokado", group: "Frukt och bär", protein: 2, carbs: 8.5, fat: 14.7, kcal: 160, category: "Fett" },
  { id: "food_30", name: "Mandlar", group: "Nötter och frön", protein: 21.2, carbs: 19.7, fat: 49.9, kcal: 576, category: "Fett" },
  { id: "food_31", name: "Jordnötssmör", group: "Nötter och frön", protein: 25, carbs: 20, fat: 50, kcal: 588, category: "Fett" },
  { id: "food_32", name: "Chiafrön", group: "Nötter och frön", protein: 16.5, carbs: 42.1, fat: 30.7, kcal: 486, category: "Fett" },
  
  // Drycker
  { id: "food_33", name: "Proteinshake", group: "Drycker", protein: 30, carbs: 3, fat: 1.5, kcal: 145, category: "Drycker" },
  { id: "food_34", name: "Apelsinjuice", group: "Drycker", protein: 0.7, carbs: 10.4, fat: 0.2, kcal: 45, category: "Drycker" },
  { id: "food_35", name: "Mjölk 1.5%", group: "Mjölk och mejeri", protein: 3.5, carbs: 5, fat: 1.5, kcal: 46, category: "Drycker" },
  
  // Övrigt
  { id: "food_36", name: "Mörk choklad 70%", group: "Socker och sötsaker", protein: 7.8, carbs: 46, fat: 40.7, kcal: 566, category: "Övrigt" },
  { id: "food_37", name: "Honung", group: "Socker och sötsaker", protein: 0.3, carbs: 82.4, fat: 0, kcal: 304, category: "Övrigt" },
  { id: "food_38", name: "Ketchup", group: "Övrigt", protein: 1.2, carbs: 22.8, fat: 0.2, kcal: 97, category: "Övrigt" }
];

// Funktion för att läsa in Excel-filen och konvertera till FoodItem[]
export async function loadFoodDatabase(): Promise<FoodItem[]> {
  try {
    // Hämta Excel-filen från Livsmedelsverket
    const response = await fetch('/LivsmedelsDB.xlsx');
    
    // Om filen inte kan hämtas, använd fallback-databasen
    if (!response.ok) {
      console.warn('Kunde inte hämta Livsmedelsverkets databas, använder inbyggd databas istället');
      return fallbackFoodDatabase;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    // Läs in Excel-filen
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Anta att första arbetsbladet innehåller datan
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Konvertera till JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Konvertera till vårt FoodItem-format
    const foodItems: FoodItem[] = jsonData.map((row: any, index) => {
      // Anpassa dessa fält baserat på hur Excel-filen är strukturerad
      const group = row['Livsmedelsgrupp'] || 'Övrigt';
      
      return {
        id: `food_${index}`,
        name: row['Livsmedelsnamn'] || 'Okänd',
        group: group,
        protein: parseFloat(row['Protein (g)']) || 0,
        carbs: parseFloat(row['Kolhydrater (g)']) || 0,
        fat: parseFloat(row['Fett (g)']) || 0,
        kcal: parseFloat(row['Energi (kcal)']) || 0,
        category: categoryMapping[group] || 'Övrigt',
        fiber: parseFloat(row['Fiber (g)']) || 0
      };
    });
    
    return foodItems;
  } catch (error) {
    console.error('Fel vid inläsning av livsmedelsdatabas:', error);
    // Använd fallback-databasen om något går fel
    return fallbackFoodDatabase;
  }
}

// Funktion för att hämta alla kategorier
export function getFoodCategories(foods: FoodItem[] = fallbackFoodDatabase): string[] {
  const categories = new Set<string>();
  
  foods.forEach(food => {
    if (food.category) {
      categories.add(food.category);
    }
  });
  
  return Array.from(categories).sort();
}

// Funktion för att gruppera livsmedel efter kategori
export function getFoodsByCategory(foods: FoodItem[] = fallbackFoodDatabase): Record<string, FoodItem[]> {
  const foodsByCategory: Record<string, FoodItem[]> = {};
  
  foods.forEach(food => {
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