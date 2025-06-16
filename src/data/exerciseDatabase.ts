interface Exercise {
  name: string;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment?: string;
}

export const exerciseDatabase: Record<string, Exercise[]> = {
  "Chest": [
    { name: "Bänkpress", muscleGroup: "Chest", difficulty: "intermediate" },
    { name: "Hantelpress", muscleGroup: "Chest", difficulty: "beginner" },
    { name: "Lutande bänkpress", muscleGroup: "Chest", difficulty: "intermediate" },
    { name: "Dips", muscleGroup: "Chest", difficulty: "intermediate" },
    { name: "Bröstflyes", muscleGroup: "Chest", difficulty: "beginner" },
    { name: "Push-ups", muscleGroup: "Chest", difficulty: "beginner" },
    { name: "Kabelcrossover", muscleGroup: "Chest", difficulty: "intermediate" },
    { name: "Decline bänkpress", muscleGroup: "Chest", difficulty: "intermediate" },
    { name: "Pec deck", muscleGroup: "Chest", difficulty: "beginner" },
    { name: "Sviss boll press", muscleGroup: "Chest", difficulty: "intermediate" }
  ],
  "Back": [
    { name: "Marklyft", muscleGroup: "Back", difficulty: "intermediate" },
    { name: "Pull-ups", muscleGroup: "Back", difficulty: "intermediate" },
    { name: "Barbell rows", muscleGroup: "Back", difficulty: "intermediate" },
    { name: "Lat pulldowns", muscleGroup: "Back", difficulty: "beginner" },
    { name: "T-bar rows", muscleGroup: "Back", difficulty: "intermediate" },
    { name: "Seated cable rows", muscleGroup: "Back", difficulty: "beginner" },
    { name: "Face pulls", muscleGroup: "Back", difficulty: "beginner" },
    { name: "Dumbbell rows", muscleGroup: "Back", difficulty: "beginner" },
    { name: "Rack pulls", muscleGroup: "Back", difficulty: "intermediate" },
    { name: "Hyperextensions", muscleGroup: "Back", difficulty: "beginner" }
  ],
  "Shoulders": [
    { name: "Axelpress", muscleGroup: "Shoulders", difficulty: "intermediate" },
    { name: "Lateral raises", muscleGroup: "Shoulders", difficulty: "beginner" },
    { name: "Front raises", muscleGroup: "Shoulders", difficulty: "beginner" },
    { name: "Rear delt flyes", muscleGroup: "Shoulders", difficulty: "beginner" },
    { name: "Upright rows", muscleGroup: "Shoulders", difficulty: "intermediate" },
    { name: "Arnold press", muscleGroup: "Shoulders", difficulty: "intermediate" },
    { name: "Shrugs", muscleGroup: "Shoulders", difficulty: "beginner" },
    { name: "Face pulls", muscleGroup: "Shoulders", difficulty: "beginner" },
    { name: "Militar press", muscleGroup: "Shoulders", difficulty: "intermediate" },
    { name: "Pike push-ups", muscleGroup: "Shoulders", difficulty: "intermediate" }
  ],
  "Triceps": [
    { name: "Dips", muscleGroup: "Triceps", difficulty: "intermediate" },
    { name: "Skull crushers", muscleGroup: "Triceps", difficulty: "intermediate" },
    { name: "Triceps pushdowns", muscleGroup: "Triceps", difficulty: "beginner" },
    { name: "Close-grip bänkpress", muscleGroup: "Triceps", difficulty: "intermediate" },
    { name: "Overhead triceps extension", muscleGroup: "Triceps", difficulty: "beginner" },
    { name: "Diamond push-ups", muscleGroup: "Triceps", difficulty: "beginner" },
    { name: "Triceps kickbacks", muscleGroup: "Triceps", difficulty: "beginner" },
    { name: "Bench dips", muscleGroup: "Triceps", difficulty: "beginner" },
    { name: "JM press", muscleGroup: "Triceps", difficulty: "advanced" },
    { name: "Rope pushdowns", muscleGroup: "Triceps", difficulty: "beginner" }
  ],
  "Biceps": [
    { name: "Biceps curls", muscleGroup: "Biceps", difficulty: "beginner" },
    { name: "Hammer curls", muscleGroup: "Biceps", difficulty: "beginner" },
    { name: "Preacher curls", muscleGroup: "Biceps", difficulty: "intermediate" },
    { name: "Concentration curls", muscleGroup: "Biceps", difficulty: "beginner" },
    { name: "EZ-bar curls", muscleGroup: "Biceps", difficulty: "beginner" },
    { name: "Spider curls", muscleGroup: "Biceps", difficulty: "intermediate" },
    { name: "Reverse curls", muscleGroup: "Biceps", difficulty: "beginner" },
    { name: "Cable curls", muscleGroup: "Biceps", difficulty: "beginner" },
    { name: "Chin-ups", muscleGroup: "Biceps", difficulty: "intermediate" },
    { name: "21s", muscleGroup: "Biceps", difficulty: "intermediate" }
  ],
  "Forearms": [
    { name: "Wrist curls", muscleGroup: "Forearms", difficulty: "beginner" },
    { name: "Reverse wrist curls", muscleGroup: "Forearms", difficulty: "beginner" },
    { name: "Farmers walk", muscleGroup: "Forearms", difficulty: "beginner" },
    { name: "Plate pinches", muscleGroup: "Forearms", difficulty: "beginner" },
    { name: "Hand gripper", muscleGroup: "Forearms", difficulty: "beginner" },
    { name: "Behind-the-back wrist curls", muscleGroup: "Forearms", difficulty: "intermediate" },
    { name: "Finger curls", muscleGroup: "Forearms", difficulty: "beginner" },
    { name: "Towel pull-ups", muscleGroup: "Forearms", difficulty: "advanced" },
    { name: "Zottman curls", muscleGroup: "Forearms", difficulty: "intermediate" },
    { name: "Dead hangs", muscleGroup: "Forearms", difficulty: "beginner" }
  ],
  "Quads": [
    { name: "Squats", muscleGroup: "Quads", difficulty: "intermediate" },
    { name: "Leg press", muscleGroup: "Quads", difficulty: "beginner" },
    { name: "Leg extensions", muscleGroup: "Quads", difficulty: "beginner" },
    { name: "Front squats", muscleGroup: "Quads", difficulty: "intermediate" },
    { name: "Hack squats", muscleGroup: "Quads", difficulty: "intermediate" },
    { name: "Lunges", muscleGroup: "Quads", difficulty: "beginner" },
    { name: "Bulgarian split squats", muscleGroup: "Quads", difficulty: "intermediate" },
    { name: "Step-ups", muscleGroup: "Quads", difficulty: "beginner" },
    { name: "Sissy squats", muscleGroup: "Quads", difficulty: "intermediate" },
    { name: "Wall sits", muscleGroup: "Quads", difficulty: "beginner" }
  ],
  "Hamstrings": [
    { name: "Romanian deadlift", muscleGroup: "Hamstrings", difficulty: "intermediate" },
    { name: "Leg curls", muscleGroup: "Hamstrings", difficulty: "beginner" },
    { name: "Good mornings", muscleGroup: "Hamstrings", difficulty: "intermediate" },
    { name: "Glute-ham raises", muscleGroup: "Hamstrings", difficulty: "intermediate" },
    { name: "Nordic curls", muscleGroup: "Hamstrings", difficulty: "advanced" },
    { name: "Kettlebell swings", muscleGroup: "Hamstrings", difficulty: "beginner" },
    { name: "Cable pull-throughs", muscleGroup: "Hamstrings", difficulty: "beginner" },
    { name: "Single-leg deadlifts", muscleGroup: "Hamstrings", difficulty: "intermediate" },
    { name: "Seated leg curls", muscleGroup: "Hamstrings", difficulty: "beginner" },
    { name: "Stability ball leg curls", muscleGroup: "Hamstrings", difficulty: "intermediate" }
  ],
  "Calves": [
    { name: "Standing calf raises", muscleGroup: "Calves", difficulty: "beginner" },
    { name: "Seated calf raises", muscleGroup: "Calves", difficulty: "beginner" },
    { name: "Donkey calf raises", muscleGroup: "Calves", difficulty: "intermediate" },
    { name: "Single-leg calf raises", muscleGroup: "Calves", difficulty: "beginner" },
    { name: "Leg press calf raises", muscleGroup: "Calves", difficulty: "beginner" },
    { name: "Jump rope", muscleGroup: "Calves", difficulty: "beginner" },
    { name: "Box jumps", muscleGroup: "Calves", difficulty: "intermediate" },
    { name: "Calf press on leg press", muscleGroup: "Calves", difficulty: "beginner" },
    { name: "Stair calf raises", muscleGroup: "Calves", difficulty: "beginner" },
    { name: "Tibia raises", muscleGroup: "Calves", difficulty: "beginner" }
  ],
  "Glutes": [
    { name: "Hip thrusts", muscleGroup: "Glutes", difficulty: "beginner" },
    { name: "Glute bridges", muscleGroup: "Glutes", difficulty: "beginner" },
    { name: "Bulgarian split squats", muscleGroup: "Glutes", difficulty: "intermediate" },
    { name: "Sumo deadlifts", muscleGroup: "Glutes", difficulty: "intermediate" },
    { name: "Cable kickbacks", muscleGroup: "Glutes", difficulty: "beginner" },
    { name: "Frog pumps", muscleGroup: "Glutes", difficulty: "beginner" },
    { name: "Donkey kicks", muscleGroup: "Glutes", difficulty: "beginner" },
    { name: "Lunges", muscleGroup: "Glutes", difficulty: "beginner" },
    { name: "Step-ups", muscleGroup: "Glutes", difficulty: "beginner" },
    { name: "Fire hydrants", muscleGroup: "Glutes", difficulty: "beginner" }
  ]
};

/**
 * Hämtar slumpmässiga övningar för en specifik muskelgrupp
 * @param muscleGroup Muskelgruppen att hämta övningar för
 * @param count Antal övningar att hämta
 * @param difficulty Svårighetsgrad att filtrera på (valfritt)
 * @returns Array med slumpmässigt valda övningar
 */
export function getRandomExercises(
  muscleGroup: string, 
  count: number = 1, 
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
): Exercise[] {
  const exercises = exerciseDatabase[muscleGroup];
  
  if (!exercises || exercises.length === 0) {
    return [];
  }
  
  let filteredExercises = exercises;
  
  // Filtrera baserat på svårighetsgrad om det anges
  if (difficulty) {
    filteredExercises = exercises.filter(ex => ex.difficulty === difficulty);
  }
  
  // Shuffle och välj antal
  const shuffled = [...filteredExercises].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Hämtar alla tillgängliga muskelgrupper
 */
export function getAvailableMuscleGroups(): string[] {
  return Object.keys(exerciseDatabase);
} 