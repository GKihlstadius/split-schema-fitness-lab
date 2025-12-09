interface Exercise {
  name: string;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment?: string;
  description?: string;
}

export const exerciseDatabase: Record<string, Exercise[]> = {
  "Chest": [
    { name: "Bench Press", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Incline Dumbbell Press", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Dumbbell Bench Press", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Cable Fly", muscleGroup: "Chest", difficulty: "beginner", equipment: "Kabel" },
    { name: "Pec Deck", muscleGroup: "Chest", difficulty: "beginner", equipment: "Maskin" },
    { name: "Bänkpress", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Hantelpress", muscleGroup: "Chest", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Lutande bänkpress", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Dips", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Kroppsweight" },
    { name: "Bröstflyes", muscleGroup: "Chest", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Push-ups", muscleGroup: "Chest", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Kabelcrossover", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Kabel" },
    { name: "Decline bänkpress", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Pec deck", muscleGroup: "Chest", difficulty: "beginner", equipment: "Maskin" },
    { name: "Sviss boll press", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Hantlar + boll" },
    { name: "Lutande hantelpress", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Decline hantelpress", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Kabel flyes", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Kabel" },
    { name: "Maskinpress", muscleGroup: "Chest", difficulty: "beginner", equipment: "Maskin" },
    { name: "Diamond push-ups", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Kroppsweight" },
    { name: "Wide-grip push-ups", muscleGroup: "Chest", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Archer push-ups", muscleGroup: "Chest", difficulty: "advanced", equipment: "Kroppsweight" },
    { name: "Handstand push-ups", muscleGroup: "Chest", difficulty: "advanced", equipment: "Kroppsweight" },
    { name: "Landmine press", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Single arm hantelpress", muscleGroup: "Chest", difficulty: "intermediate", equipment: "Hantlar" }
  ],
  "Back": [
    { name: "Weighted Pull-ups", muscleGroup: "Back", difficulty: "intermediate", equipment: "Stång + vikt" },
    { name: "Barbell Row", muscleGroup: "Back", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Chest Supported Row", muscleGroup: "Back", difficulty: "beginner", equipment: "Maskin" },
    { name: "Cable Row", muscleGroup: "Back", difficulty: "beginner", equipment: "Kabel" },
    { name: "Straight-Arm Pulldown", muscleGroup: "Back", difficulty: "beginner", equipment: "Kabel" },
    { name: "Marklyft", muscleGroup: "Back", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Pull-ups", muscleGroup: "Back", difficulty: "intermediate", equipment: "Stång" },
    { name: "Barbell rows", muscleGroup: "Back", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Lat pulldowns", muscleGroup: "Back", difficulty: "beginner", equipment: "Kabel" },
    { name: "T-bar rows", muscleGroup: "Back", difficulty: "intermediate", equipment: "T-bar" },
    { name: "Seated cable rows", muscleGroup: "Back", difficulty: "beginner", equipment: "Kabel" },
    { name: "Face pulls", muscleGroup: "Back", difficulty: "beginner", equipment: "Kabel" },
    { name: "Dumbbell rows", muscleGroup: "Back", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Rack pulls", muscleGroup: "Back", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Hyperextensions", muscleGroup: "Back", difficulty: "beginner", equipment: "Bänk" },
    { name: "Chin-ups", muscleGroup: "Back", difficulty: "intermediate", equipment: "Stång" },
    { name: "Wide-grip pull-ups", muscleGroup: "Back", difficulty: "intermediate", equipment: "Stång" },
    { name: "Neutral-grip pull-ups", muscleGroup: "Back", difficulty: "intermediate", equipment: "Stång" },
    { name: "Single arm dumbbell rows", muscleGroup: "Back", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Chest-supported rows", muscleGroup: "Back", difficulty: "beginner", equipment: "Maskin" },
    { name: "Reverse flyes", muscleGroup: "Back", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Good mornings", muscleGroup: "Back", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Snatch-grip deadlift", muscleGroup: "Back", difficulty: "advanced", equipment: "Skivstång" },
    { name: "Deficit deadlift", muscleGroup: "Back", difficulty: "advanced", equipment: "Skivstång" },
    { name: "Cable rows high", muscleGroup: "Back", difficulty: "beginner", equipment: "Kabel" },
    { name: "Cable rows mid", muscleGroup: "Back", difficulty: "beginner", equipment: "Kabel" },
    { name: "Cable rows low", muscleGroup: "Back", difficulty: "beginner", equipment: "Kabel" },
    { name: "Resistance band rows", muscleGroup: "Back", difficulty: "beginner", equipment: "Band" },
    { name: "Inverted rows", muscleGroup: "Back", difficulty: "intermediate", equipment: "Stång" },
    { name: "Meadows rows", muscleGroup: "Back", difficulty: "advanced", equipment: "Skivstång" }
  ],
  "Shoulders": [
    { name: "Shoulder Press", muscleGroup: "Shoulders", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Rear Delt Fly", muscleGroup: "Shoulders", difficulty: "beginner", equipment: "Hantlar/Maskin" },
    { name: "Axelpress", muscleGroup: "Shoulders", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Lateral raises", muscleGroup: "Shoulders", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Front raises", muscleGroup: "Shoulders", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Rear delt flyes", muscleGroup: "Shoulders", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Upright rows", muscleGroup: "Shoulders", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Arnold press", muscleGroup: "Shoulders", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Shrugs", muscleGroup: "Shoulders", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Face pulls", muscleGroup: "Shoulders", difficulty: "beginner", equipment: "Kabel" },
    { name: "Militar press", muscleGroup: "Shoulders", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Pike push-ups", muscleGroup: "Shoulders", difficulty: "intermediate", equipment: "Kroppsweight" },
    { name: "Overhead press", muscleGroup: "Shoulders", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Behind-the-neck press", muscleGroup: "Shoulders", difficulty: "advanced", equipment: "Skivstång" },
    { name: "Cable lateral raises", muscleGroup: "Shoulders", difficulty: "beginner", equipment: "Kabel" },
    { name: "Cable rear delt flyes", muscleGroup: "Shoulders", difficulty: "beginner", equipment: "Kabel" },
    { name: "Machine shoulder press", muscleGroup: "Shoulders", difficulty: "beginner", equipment: "Maskin" },
    { name: "Y-raises", muscleGroup: "Shoulders", difficulty: "beginner", equipment: "Hantlar" },
    { name: "W-raises", muscleGroup: "Shoulders", difficulty: "beginner", equipment: "Hantlar" },
    { name: "L-raises", muscleGroup: "Shoulders", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Cuban press", muscleGroup: "Shoulders", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Handstand hold", muscleGroup: "Shoulders", difficulty: "advanced", equipment: "Kroppsweight" },
    { name: "Single arm press", muscleGroup: "Shoulders", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Plate raises", muscleGroup: "Shoulders", difficulty: "beginner", equipment: "Skiva" },
    { name: "Band pull-aparts", muscleGroup: "Shoulders", difficulty: "beginner", equipment: "Band" },
    { name: "Cable upright rows", muscleGroup: "Shoulders", difficulty: "intermediate", equipment: "Kabel" }
  ],
  "Triceps": [
    { name: "Rope pushdowns", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Kabel" },
    { name: "Overhead cable tricep extensions", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Kabel" },
    { name: "Dips", muscleGroup: "Triceps", difficulty: "intermediate", equipment: "Kroppsweight" },
    { name: "Skull crushers", muscleGroup: "Triceps", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Triceps pushdowns", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Kabel" },
    { name: "Close-grip bänkpress", muscleGroup: "Triceps", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Overhead triceps extension", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Diamond push-ups", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Triceps kickbacks", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Bench dips", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Bänk" },
    { name: "JM press", muscleGroup: "Triceps", difficulty: "advanced", equipment: "Skivstång" },
    { name: "Rope pushdowns", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Kabel" },
    { name: "Overhead cable extension", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Kabel" },
    { name: "Single arm pushdowns", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Kabel" },
    { name: "Reverse grip pushdowns", muscleGroup: "Triceps", difficulty: "intermediate", equipment: "Kabel" },
    { name: "Triceps dips på maskin", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Maskin" },
    { name: "French press", muscleGroup: "Triceps", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Single arm overhead extension", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Tate press", muscleGroup: "Triceps", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "California press", muscleGroup: "Triceps", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Triceps pushdowns med band", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Band" },
    { name: "Wall push-ups triceps", muscleGroup: "Triceps", difficulty: "beginner", equipment: "Kroppsweight" }
  ],
  "Biceps": [
    { name: "Preacher Curls", muscleGroup: "Biceps", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Hammer Curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Biceps curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Hammer curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Preacher curls", muscleGroup: "Biceps", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Concentration curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "Hantlar" },
    { name: "EZ-bar curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "EZ-stång" },
    { name: "Spider curls", muscleGroup: "Biceps", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Reverse curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "Skivstång" },
    { name: "Cable curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "Kabel" },
    { name: "Chin-ups", muscleGroup: "Biceps", difficulty: "intermediate", equipment: "Stång" },
    { name: "21s", muscleGroup: "Biceps", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Incline dumbbell curls", muscleGroup: "Biceps", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Cross-body hammer curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Drag curls", muscleGroup: "Biceps", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Cable hammer curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "Kabel" },
    { name: "Single arm cable curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "Kabel" },
    { name: "Wide-grip barbell curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "Skivstång" },
    { name: "Close-grip barbell curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "Skivstång" },
    { name: "Resistance band curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "Band" },
    { name: "Zottman curls", muscleGroup: "Biceps", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Seated dumbbell curls", muscleGroup: "Biceps", difficulty: "beginner", equipment: "Hantlar" }
  ],
  "Forearms": [
    { name: "Wrist curls", muscleGroup: "Forearms", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Reverse wrist curls", muscleGroup: "Forearms", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Farmers walk", muscleGroup: "Forearms", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Plate pinches", muscleGroup: "Forearms", difficulty: "beginner", equipment: "Skiva" },
    { name: "Hand gripper", muscleGroup: "Forearms", difficulty: "beginner", equipment: "Gripper" },
    { name: "Behind-the-back wrist curls", muscleGroup: "Forearms", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Finger curls", muscleGroup: "Forearms", difficulty: "beginner", equipment: "Skivstång" },
    { name: "Towel pull-ups", muscleGroup: "Forearms", difficulty: "advanced", equipment: "Handduk" },
    { name: "Zottman curls", muscleGroup: "Forearms", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Dead hangs", muscleGroup: "Forearms", difficulty: "beginner", equipment: "Stång" },
    { name: "Cable wrist curls", muscleGroup: "Forearms", difficulty: "beginner", equipment: "Kabel" },
    { name: "Hammer strength", muscleGroup: "Forearms", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Elastic band flex", muscleGroup: "Forearms", difficulty: "beginner", equipment: "Band" },
    { name: "Fat bar holds", muscleGroup: "Forearms", difficulty: "intermediate", equipment: "Fat bar" },
    { name: "Single arm hangs", muscleGroup: "Forearms", difficulty: "advanced", equipment: "Stång" }
  ],
  "Quads": [
    { name: "Back Squat", muscleGroup: "Quads", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Front Squat", muscleGroup: "Quads", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Squats", muscleGroup: "Quads", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Leg press", muscleGroup: "Quads", difficulty: "beginner", equipment: "Maskin" },
    { name: "Leg extensions", muscleGroup: "Quads", difficulty: "beginner", equipment: "Maskin" },
    { name: "Front squats", muscleGroup: "Quads", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Hack squats", muscleGroup: "Quads", difficulty: "intermediate", equipment: "Maskin" },
    { name: "Lunges", muscleGroup: "Quads", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Bulgarian split squats", muscleGroup: "Quads", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Step-ups", muscleGroup: "Quads", difficulty: "beginner", equipment: "Box" },
    { name: "Sissy squats", muscleGroup: "Quads", difficulty: "intermediate", equipment: "Kroppsweight" },
    { name: "Wall sits", muscleGroup: "Quads", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Goblet squats", muscleGroup: "Quads", difficulty: "beginner", equipment: "Hantel" },
    { name: "Jump squats", muscleGroup: "Quads", difficulty: "intermediate", equipment: "Kroppsweight" },
    { name: "Single leg squats", muscleGroup: "Quads", difficulty: "advanced", equipment: "Kroppsweight" },
    { name: "Overhead squats", muscleGroup: "Quads", difficulty: "advanced", equipment: "Skivstång" },
    { name: "Box squats", muscleGroup: "Quads", difficulty: "intermediate", equipment: "Box + stång" },
    { name: "Pause squats", muscleGroup: "Quads", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Zercher squats", muscleGroup: "Quads", difficulty: "advanced", equipment: "Skivstång" },
    { name: "Curtsy lunges", muscleGroup: "Quads", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Lateral lunges", muscleGroup: "Quads", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Walking lunges", muscleGroup: "Quads", difficulty: "intermediate", equipment: "Hantlar" }
  ],
  "Hamstrings": [
    { name: "Romanian Deadlift", muscleGroup: "Hamstrings", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Romanian deadlift", muscleGroup: "Hamstrings", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Leg curls", muscleGroup: "Hamstrings", difficulty: "beginner", equipment: "Maskin" },
    { name: "Good mornings", muscleGroup: "Hamstrings", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Glute-ham raises", muscleGroup: "Hamstrings", difficulty: "intermediate", equipment: "GHD" },
    { name: "Nordic curls", muscleGroup: "Hamstrings", difficulty: "advanced", equipment: "Kroppsweight" },
    { name: "Kettlebell swings", muscleGroup: "Hamstrings", difficulty: "beginner", equipment: "Kettlebell" },
    { name: "Cable pull-throughs", muscleGroup: "Hamstrings", difficulty: "beginner", equipment: "Kabel" },
    { name: "Single-leg deadlifts", muscleGroup: "Hamstrings", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Seated leg curls", muscleGroup: "Hamstrings", difficulty: "beginner", equipment: "Maskin" },
    { name: "Stability ball leg curls", muscleGroup: "Hamstrings", difficulty: "intermediate", equipment: "Boll" },
    { name: "Stiff-leg deadlift", muscleGroup: "Hamstrings", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Sumo deadlift", muscleGroup: "Hamstrings", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Lying leg curls", muscleGroup: "Hamstrings", difficulty: "beginner", equipment: "Maskin" },
    { name: "Standing leg curls", muscleGroup: "Hamstrings", difficulty: "beginner", equipment: "Maskin" },
    { name: "Cable leg curls", muscleGroup: "Hamstrings", difficulty: "beginner", equipment: "Kabel" },
    { name: "Band leg curls", muscleGroup: "Hamstrings", difficulty: "beginner", equipment: "Band" },
    { name: "Deadlift på platta", muscleGroup: "Hamstrings", difficulty: "advanced", equipment: "Skivstång" },
    { name: "Trap bar deadlift", muscleGroup: "Hamstrings", difficulty: "intermediate", equipment: "Trap bar" }
  ],
  "Calves": [
    { name: "Standing calf raises", muscleGroup: "Calves", difficulty: "beginner", equipment: "Maskin" },
    { name: "Seated calf raises", muscleGroup: "Calves", difficulty: "beginner", equipment: "Maskin" },
    { name: "Donkey calf raises", muscleGroup: "Calves", difficulty: "intermediate", equipment: "Maskin" },
    { name: "Single-leg calf raises", muscleGroup: "Calves", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Leg press calf raises", muscleGroup: "Calves", difficulty: "beginner", equipment: "Maskin" },
    { name: "Jump rope", muscleGroup: "Calves", difficulty: "beginner", equipment: "Rep" },
    { name: "Box jumps", muscleGroup: "Calves", difficulty: "intermediate", equipment: "Box" },
    { name: "Calf press på leg press", muscleGroup: "Calves", difficulty: "beginner", equipment: "Maskin" },
    { name: "Stair calf raises", muscleGroup: "Calves", difficulty: "beginner", equipment: "Trappa" },
    { name: "Tibia raises", muscleGroup: "Calves", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Smith machine calf raises", muscleGroup: "Calves", difficulty: "beginner", equipment: "Smith machine" },
    { name: "Dumbbell calf raises", muscleGroup: "Calves", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Barbell calf raises", muscleGroup: "Calves", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Wall calf raises", muscleGroup: "Calves", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Explosive calf raises", muscleGroup: "Calves", difficulty: "intermediate", equipment: "Kroppsweight" }
  ],
  "Glutes": [
    { name: "Hip Abduction Machine", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Maskin" },
    { name: "Cable Abductions", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Kabel" },
    { name: "Hip thrusts", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Skivstång" },
    { name: "Glute bridges", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Bulgarian split squats", muscleGroup: "Glutes", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Sumo deadlifts", muscleGroup: "Glutes", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Cable kickbacks", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Kabel" },
    { name: "Frog pumps", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Donkey kicks", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Lunges", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Step-ups", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Box" },
    { name: "Fire hydrants", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Single leg hip thrusts", muscleGroup: "Glutes", difficulty: "intermediate", equipment: "Bänk" },
    { name: "Cable pull-throughs", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Kabel" },
    { name: "Romanian deadlift", muscleGroup: "Glutes", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Good mornings", muscleGroup: "Glutes", difficulty: "intermediate", equipment: "Skivstång" },
    { name: "Reverse lunges", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Lateral lunges", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Hantlar" },
    { name: "Glute ham raises", muscleGroup: "Glutes", difficulty: "intermediate", equipment: "GHD" },
    { name: "Single leg deadlifts", muscleGroup: "Glutes", difficulty: "intermediate", equipment: "Hantlar" },
    { name: "Cossack squats", muscleGroup: "Glutes", difficulty: "intermediate", equipment: "Kroppsweight" },
    { name: "Curtsy lunges", muscleGroup: "Glutes", difficulty: "beginner", equipment: "Hantlar" }
  ],
  "Core": [
    { name: "Plankan", muscleGroup: "Core", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Crunches", muscleGroup: "Core", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Russian twists", muscleGroup: "Core", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Dead bug", muscleGroup: "Core", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Bird dog", muscleGroup: "Core", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Mountain climbers", muscleGroup: "Core", difficulty: "intermediate", equipment: "Kroppsweight" },
    { name: "Leg raises", muscleGroup: "Core", difficulty: "intermediate", equipment: "Kroppsweight" },
    { name: "Bicycle crunches", muscleGroup: "Core", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Side plankan", muscleGroup: "Core", difficulty: "intermediate", equipment: "Kroppsweight" },
    { name: "Hanging leg raises", muscleGroup: "Core", difficulty: "advanced", equipment: "Stång" },
    { name: "Ab wheel rollout", muscleGroup: "Core", difficulty: "intermediate", equipment: "Ab wheel" },
    { name: "Wood chop", muscleGroup: "Core", difficulty: "intermediate", equipment: "Kabel" },
    { name: "Pallof press", muscleGroup: "Core", difficulty: "intermediate", equipment: "Kabel" },
    { name: "Hollow body hold", muscleGroup: "Core", difficulty: "intermediate", equipment: "Kroppsweight" },
    { name: "V-ups", muscleGroup: "Core", difficulty: "intermediate", equipment: "Kroppsweight" },
    { name: "Reverse crunches", muscleGroup: "Core", difficulty: "beginner", equipment: "Kroppsweight" },
    { name: "Cable crunches", muscleGroup: "Core", difficulty: "beginner", equipment: "Kabel" },
    { name: "Dragon flag", muscleGroup: "Core", difficulty: "advanced", equipment: "Bänk" },
    { name: "L-sit", muscleGroup: "Core", difficulty: "advanced", equipment: "Stång" },
    { name: "Turkish get-up", muscleGroup: "Core", difficulty: "advanced", equipment: "Kettlebell" }
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

/**
 * Hämtar alla övningar för en specifik muskelgrupp
 */
export function getAllExercisesForMuscleGroup(muscleGroup: string): Exercise[] {
  return exerciseDatabase[muscleGroup] || [];
}

/**
 * Söker efter övningar baserat på namn
 */
export function searchExercises(query: string): Exercise[] {
  const allExercises = Object.values(exerciseDatabase).flat();
  return allExercises.filter(exercise => 
    exercise.name.toLowerCase().includes(query.toLowerCase())
  );
} 