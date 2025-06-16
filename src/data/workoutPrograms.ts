
import { WorkoutProgram } from '@/types/workout';

export const workoutPrograms: WorkoutProgram[] = [
  {
    id: '1',
    name: "Dr. Mike's Favorite",
    goal: 'Hypertrophy',
    frequency: '6/WEEK',
    difficulty: 'INTERMEDIATE',
    duration: '12 WEEKS',
    focus: 'Whole Body Hypertrophy',
    description: 'A comprehensive hypertrophy program designed by Dr. Mike Israetel, focusing on maximum muscle growth through evidence-based training principles.',
    weeklyPlan: [
      {
        day: 'Monday',
        muscleGroups: ['Chest', 'Triceps'],
        focus: 'Upper Body Push',
        exercises: [
          { name: 'Barbell Bench Press', sets: '4', reps: '6-8', tags: ['Primary'] },
          { name: 'Incline Dumbbell Press', sets: '3', reps: '8-10', tags: ['Primary'] },
          { name: 'Dips', sets: '3', reps: '10-12', tags: ['Secondary'] },
          { name: 'Close-Grip Bench Press', sets: '3', reps: '8-10', tags: ['Primary'] },
          { name: 'Overhead Tricep Extension', sets: '3', reps: '10-12', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Tuesday',
        muscleGroups: ['Back', 'Biceps'],
        focus: 'Upper Body Pull',
        exercises: [
          { name: 'Deadlift', sets: '4', reps: '5-6', tags: ['Primary'] },
          { name: 'Pull-ups', sets: '3', reps: '8-10', tags: ['Primary'] },
          { name: 'Barbell Rows', sets: '3', reps: '8-10', tags: ['Primary'] },
          { name: 'Barbell Curls', sets: '3', reps: '10-12', tags: ['Secondary'] },
          { name: 'Hammer Curls', sets: '3', reps: '12-15', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Wednesday',
        muscleGroups: ['Legs', 'Glutes'],
        focus: 'Lower Body',
        exercises: [
          { name: 'Squats', sets: '4', reps: '6-8', tags: ['Primary'] },
          { name: 'Romanian Deadlift', sets: '3', reps: '8-10', tags: ['Primary'] },
          { name: 'Bulgarian Split Squats', sets: '3', reps: '10-12', tags: ['Secondary'] },
          { name: 'Leg Curls', sets: '3', reps: '12-15', tags: ['Secondary'] },
          { name: 'Calf Raises', sets: '4', reps: '15-20', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Thursday',
        muscleGroups: ['Shoulders', 'Arms'],
        focus: 'Shoulders & Arms',
        exercises: [
          { name: 'Overhead Press', sets: '4', reps: '6-8', tags: ['Primary'] },
          { name: 'Lateral Raises', sets: '3', reps: '12-15', tags: ['Primary'] },
          { name: 'Rear Delt Flyes', sets: '3', reps: '12-15', tags: ['Secondary'] },
          { name: 'Arnold Press', sets: '3', reps: '10-12', tags: ['Secondary'] },
          { name: 'Face Pulls', sets: '3', reps: '15-20', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Friday',
        muscleGroups: ['Chest', 'Back'],
        focus: 'Upper Body Volume',
        exercises: [
          { name: 'Incline Barbell Press', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'T-Bar Rows', sets: '3', reps: '8-10', tags: ['Primary'] },
          { name: 'Dumbbell Flyes', sets: '3', reps: '12-15', tags: ['Secondary'] },
          { name: 'Cable Rows', sets: '3', reps: '10-12', tags: ['Secondary'] },
          { name: 'Push-ups', sets: '3', reps: 'To failure', tags: ['Finisher'] }
        ]
      },
      {
        day: 'Saturday',
        muscleGroups: ['Legs', 'Core'],
        focus: 'Lower Body & Core',
        exercises: [
          { name: 'Front Squats', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'Walking Lunges', sets: '3', reps: '12 each leg', tags: ['Primary'] },
          { name: 'Leg Press', sets: '3', reps: '15-20', tags: ['Secondary'] },
          { name: 'Planks', sets: '3', reps: '60 seconds', tags: ['Core'] },
          { name: 'Russian Twists', sets: '3', reps: '20 each side', tags: ['Core'] }
        ]
      }
    ],
    benefits: [
      'Maximizes muscle hypertrophy through scientific training principles',
      'Balanced approach targeting all major muscle groups',
      'Progressive overload built into the program structure',
      'Suitable for intermediate to advanced trainees',
      'Evidence-based exercise selection and volume recommendations'
    ]
  },
  {
    id: '2',
    name: "Jared Feather's Favorite",
    goal: 'Hypertrophy',
    frequency: '6/WEEK',
    difficulty: 'ADVANCED',
    duration: '16 WEEKS',
    focus: 'Whole Body Mass Building',
    description: 'An advanced hypertrophy program focused on maximum muscle mass development with high volume training.',
    weeklyPlan: [
      {
        day: 'Monday',
        muscleGroups: ['Chest', 'Shoulders'],
        focus: 'Upper Body Push Volume',
        exercises: [
          { name: 'Bench Press', sets: '5', reps: '5-7', tags: ['Primary'] },
          { name: 'Incline Dumbbell Press', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'Shoulder Press', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'Lateral Raises', sets: '4', reps: '12-15', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Tuesday',
        muscleGroups: ['Back', 'Biceps'],
        focus: 'Pull Volume Training',
        exercises: [
          { name: 'Weighted Pull-ups', sets: '4', reps: '6-8', tags: ['Primary'] },
          { name: 'Barbell Rows', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'Cable Curls', sets: '4', reps: '10-12', tags: ['Secondary'] },
          { name: 'Preacher Curls', sets: '3', reps: '12-15', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Wednesday',
        muscleGroups: ['Legs'],
        focus: 'Leg Development',
        exercises: [
          { name: 'Back Squats', sets: '5', reps: '6-8', tags: ['Primary'] },
          { name: 'Romanian Deadlifts', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'Leg Press', sets: '4', reps: '12-15', tags: ['Secondary'] },
          { name: 'Leg Curls', sets: '4', reps: '12-15', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Thursday',
        muscleGroups: ['Arms'],
        focus: 'Arm Specialization',
        exercises: [
          { name: 'Close-Grip Bench Press', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'Barbell Curls', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'Tricep Dips', sets: '4', reps: '10-12', tags: ['Secondary'] },
          { name: 'Hammer Curls', sets: '4', reps: '12-15', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Friday',
        muscleGroups: ['Chest', 'Back'],
        focus: 'Upper Body Density',
        exercises: [
          { name: 'Dumbbell Bench Press', sets: '4', reps: '10-12', tags: ['Primary'] },
          { name: 'Cable Rows', sets: '4', reps: '10-12', tags: ['Primary'] },
          { name: 'Pec Deck', sets: '3', reps: '12-15', tags: ['Secondary'] },
          { name: 'Lat Pulldowns', sets: '3', reps: '12-15', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Saturday',
        muscleGroups: ['Shoulders', 'Legs'],
        focus: 'Weak Point Training',
        exercises: [
          { name: 'Front Squats', sets: '4', reps: '10-12', tags: ['Primary'] },
          { name: 'Arnold Press', sets: '4', reps: '10-12', tags: ['Primary'] },
          { name: 'Lateral Raises', sets: '4', reps: '15-20', tags: ['Secondary'] },
          { name: 'Calf Raises', sets: '4', reps: '20-25', tags: ['Secondary'] }
        ]
      }
    ],
    benefits: [
      'Advanced high-volume training for experienced lifters',
      'Focuses on weak point development',
      'Maximum muscle mass building potential',
      'Periodized approach to prevent plateaus'
    ]
  },
  {
    id: '3',
    name: "Thor Workout",
    goal: 'Strength',
    frequency: '5/WEEK',
    difficulty: 'INTERMEDIATE',
    duration: '8 WEEKS',
    focus: 'Upper Body Power',
    description: 'A powerful upper body focused program inspired by Norse mythology, designed to build impressive strength and size.',
    weeklyPlan: [
      {
        day: 'Monday',
        muscleGroups: ['Chest', 'Triceps'],
        focus: 'Power Upper Push',
        exercises: [
          { name: 'Barbell Bench Press', sets: '5', reps: '3-5', tags: ['Primary'] },
          { name: 'Weighted Dips', sets: '4', reps: '6-8', tags: ['Primary'] },
          { name: 'Close-Grip Bench Press', sets: '4', reps: '6-8', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Tuesday',
        muscleGroups: ['Back', 'Biceps'],
        focus: 'Power Upper Pull',
        exercises: [
          { name: 'Deadlift', sets: '5', reps: '3-5', tags: ['Primary'] },
          { name: 'Weighted Pull-ups', sets: '4', reps: '5-7', tags: ['Primary'] },
          { name: 'Barbell Rows', sets: '4', reps: '6-8', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Wednesday',
        muscleGroups: ['Shoulders'],
        focus: 'Shoulder Power',
        exercises: [
          { name: 'Overhead Press', sets: '5', reps: '3-5', tags: ['Primary'] },
          { name: 'Push Press', sets: '4', reps: '5-6', tags: ['Primary'] },
          { name: 'Lateral Raises', sets: '4', reps: '10-12', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Thursday',
        muscleGroups: ['Arms'],
        focus: 'Arm Strength',
        exercises: [
          { name: 'Barbell Curls', sets: '4', reps: '6-8', tags: ['Primary'] },
          { name: 'Skull Crushers', sets: '4', reps: '6-8', tags: ['Primary'] },
          { name: 'Hammer Curls', sets: '3', reps: '8-10', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Friday',
        muscleGroups: ['Chest', 'Back'],
        focus: 'Upper Body Volume',
        exercises: [
          { name: 'Incline Bench Press', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'T-Bar Rows', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'Cable Flyes', sets: '3', reps: '12-15', tags: ['Secondary'] }
        ]
      }
    ],
    benefits: [
      'Builds impressive upper body strength',
      'Focus on compound movements',
      'Perfect for intermediate lifters',
      'Balanced push/pull training'
    ]
  },
  {
    id: '4',
    name: "🧩 Whole Body Split",
    goal: 'Hypertrophy',
    frequency: '6/WEEK',
    difficulty: 'INTERMEDIATE',
    duration: '12 WEEKS',
    focus: 'Whole Body Development',
    description: 'Ett komplett helkroppsprogram med fokus på alla muskelgrupper fördelat över 6 träningsdagar per vecka för optimal utveckling.',
    weeklyPlan: [
      {
        day: 'Måndag',
        muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
        focus: 'Överkropp: Press',
        exercises: [
          { name: 'Chest Exercise 1', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'Chest Exercise 2', sets: '3', reps: '10-12', tags: ['Primary'] },
          { name: 'Triceps Exercise 1', sets: '3', reps: '10-12', tags: ['Secondary'] },
          { name: 'Triceps Exercise 2', sets: '3', reps: '12-15', tags: ['Secondary'] },
          { name: 'Shoulders Exercise 1', sets: '3', reps: '10-12', tags: ['Secondary'] },
          { name: 'Shoulders Exercise 2', sets: '3', reps: '12-15', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Tisdag',
        muscleGroups: ['Legs', 'Glutes', 'Calves'],
        focus: 'Ben (framsida + baksida + glute)',
        exercises: [
          { name: 'Quads Exercise 1', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'Quads Exercise 2', sets: '3', reps: '10-12', tags: ['Primary'] },
          { name: 'Hamstrings Exercise', sets: '3', reps: '10-12', tags: ['Secondary'] },
          { name: 'Glutes Exercise', sets: '3', reps: '12-15', tags: ['Secondary'] },
          { name: 'Calves Exercise 1', sets: '4', reps: '15-20', tags: ['Secondary'] },
          { name: 'Calves Exercise 2', sets: '3', reps: '15-20', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Onsdag',
        muscleGroups: ['Back', 'Biceps', 'Forearms'],
        focus: 'Överkropp: Drag',
        exercises: [
          { name: 'Back Exercise 1', sets: '4', reps: '6-8', tags: ['Primary'] },
          { name: 'Back Exercise 2', sets: '3', reps: '8-10', tags: ['Primary'] },
          { name: 'Back Exercise 3', sets: '3', reps: '10-12', tags: ['Primary'] },
          { name: 'Biceps Exercise 1', sets: '3', reps: '10-12', tags: ['Secondary'] },
          { name: 'Biceps Exercise 2', sets: '3', reps: '12-15', tags: ['Secondary'] },
          { name: 'Forearms Exercise', sets: '3', reps: '15-20', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Torsdag',
        muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
        focus: 'Pressfokus igen',
        exercises: [
          { name: 'Chest Exercise 1', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'Chest Exercise 2', sets: '3', reps: '10-12', tags: ['Primary'] },
          { name: 'Triceps Exercise 1', sets: '3', reps: '10-12', tags: ['Secondary'] },
          { name: 'Triceps Exercise 2', sets: '3', reps: '12-15', tags: ['Secondary'] },
          { name: 'Shoulders Exercise 1', sets: '3', reps: '10-12', tags: ['Secondary'] },
          { name: 'Shoulders Exercise 2', sets: '3', reps: '12-15', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Fredag',
        muscleGroups: ['Legs', 'Glutes', 'Calves'],
        focus: 'Ben igen',
        exercises: [
          { name: 'Quads Exercise 1', sets: '4', reps: '8-10', tags: ['Primary'] },
          { name: 'Quads Exercise 2', sets: '3', reps: '10-12', tags: ['Primary'] },
          { name: 'Hamstrings Exercise', sets: '3', reps: '10-12', tags: ['Secondary'] },
          { name: 'Glutes Exercise', sets: '3', reps: '12-15', tags: ['Secondary'] },
          { name: 'Calves Exercise 1', sets: '4', reps: '15-20', tags: ['Secondary'] },
          { name: 'Calves Exercise 2', sets: '3', reps: '15-20', tags: ['Secondary'] }
        ]
      },
      {
        day: 'Lördag',
        muscleGroups: ['Back', 'Biceps', 'Forearms'],
        focus: 'Rygg & Armar',
        exercises: [
          { name: 'Back Exercise 1', sets: '4', reps: '6-8', tags: ['Primary'] },
          { name: 'Back Exercise 2', sets: '3', reps: '8-10', tags: ['Primary'] },
          { name: 'Biceps Exercise 1', sets: '3', reps: '10-12', tags: ['Secondary'] },
          { name: 'Biceps Exercise 2', sets: '3', reps: '12-15', tags: ['Secondary'] },
          { name: 'Forearms Exercise 1', sets: '3', reps: '15-20', tags: ['Secondary'] },
          { name: 'Forearms Exercise 2', sets: '3', reps: '15-20', tags: ['Secondary'] }
        ]
      }
    ],
    benefits: [
      'Komplett helkroppsutveckling med fokus på alla muskelgrupper',
      '6-dagars split för maximal träningsvolym',
      'Balanserad fördelning mellan press- och dragövningar',
      'Optimal återhämtning genom att rotera muskelgrupper',
      'Perfekt för att bygga både styrka och muskelmassa'
    ]
  }
];
