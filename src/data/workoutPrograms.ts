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
        day: 'Måndag',
        muscleGroups: ['Chest', 'Triceps', 'Calves', 'Shoulders', 'Biceps'],
        focus: 'Upper Body Push',
        exercises: [
          { name: 'Bench Press', sets: '4', reps: '8-12', tags: ['Chest'] },
          { name: 'Incline Dumbbell Press', sets: '3', reps: '8-12', tags: ['Chest'] },
          { name: 'Close-Grip Bench Press', sets: '4', reps: '10-15', tags: ['Triceps'] },
          { name: 'Standing Calf Raises', sets: '4', reps: '15-20', tags: ['Calves'] },
          { name: 'Overhead Press', sets: '4', reps: '8-12', tags: ['Shoulders'] },
          { name: 'Barbell Curls', sets: '3', reps: '10-15', tags: ['Biceps'] }
        ]
      },
      {
        day: 'Tisdag',
        muscleGroups: ['Hamstrings', 'Quads'],
        focus: 'Lower Body',
        exercises: [
          { name: 'Romanian Deadlifts', sets: '4', reps: '8-12', tags: ['Hamstrings'] },
          { name: 'Squats', sets: '3', reps: '8-12', tags: ['Quads'] },
          { name: 'Walking Lunges', sets: '2', reps: '12-15', tags: ['Quads'] }
        ]
      },
      {
        day: 'Onsdag',
        muscleGroups: ['Back', 'Biceps', 'Forearms'],
        focus: 'Upper Body Pull',
        exercises: [
          { name: 'Pull-ups', sets: '3', reps: '8-12', tags: ['Back'] },
          { name: 'Barbell Rows', sets: '3', reps: '8-12', tags: ['Back'] },
          { name: 'Cable Rows', sets: '2', reps: '8-12', tags: ['Back'] },
          { name: 'Hammer Curls', sets: '3', reps: '10-15', tags: ['Biceps'] },
          { name: 'Farmers Walk', sets: '3', reps: '30s', tags: ['Forearms'] }
        ]
      },
      {
        day: 'Torsdag',
        muscleGroups: ['Triceps', 'Chest', 'Calves', 'Shoulders', 'Biceps'],
        focus: 'Upper Body Push 2',
        exercises: [
          { name: 'Dips', sets: '4', reps: '10-15', tags: ['Triceps'] },
          { name: 'Overhead Tricep Extension', sets: '4', reps: '10-15', tags: ['Triceps'] },
          { name: 'Dumbbell Bench Press', sets: '4', reps: '8-12', tags: ['Chest'] },
          { name: 'Dumbbell Flyes', sets: '2', reps: '12-15', tags: ['Chest'] },
          { name: 'Seated Calf Raises', sets: '4', reps: '15-20', tags: ['Calves'] },
          { name: 'Lateral Raises', sets: '4', reps: '12-15', tags: ['Shoulders'] },
          { name: 'Cable Curls', sets: '3', reps: '10-15', tags: ['Biceps'] }
        ]
      },
      {
        day: 'Fredag',
        muscleGroups: ['Hamstrings', 'Quads', 'Glutes'],
        focus: 'Lower Body 2',
        exercises: [
          { name: 'Stiff Leg Deadlifts', sets: '4', reps: '8-12', tags: ['Hamstrings'] },
          { name: 'Leg Press', sets: '3', reps: '12-15', tags: ['Quads'] },
          { name: 'Hip Thrusts', sets: '4', reps: '12-15', tags: ['Glutes'] }
        ]
      },
      {
        day: 'Lördag',
        muscleGroups: ['Back', 'Shoulders', 'Biceps', 'Forearms'],
        focus: 'Upper Body Pull 2',
        exercises: [
          { name: 'T-Bar Rows', sets: '2', reps: '8-12', tags: ['Back'] },
          { name: 'Lat Pulldowns', sets: '2', reps: '8-12', tags: ['Back'] },
          { name: 'Rear Delt Flyes', sets: '4', reps: '12-15', tags: ['Shoulders'] },
          { name: 'Preacher Curls', sets: '3', reps: '10-15', tags: ['Biceps'] },
          { name: 'Wrist Curls', sets: '3', reps: '15-20', tags: ['Forearms'] }
        ]
      },
      {
        day: 'Söndag',
        muscleGroups: ['Rest'],
        focus: 'Vila / Återhämtning',
        exercises: [
          { name: 'Vila / Återhämtning', sets: '-', reps: '-', tags: ['Rest'] }
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
          { name: 'Bench Press', sets: '5', reps: '5-7', tags: ['Chest'] },
          { name: 'Incline Dumbbell Press', sets: '4', reps: '8-10', tags: ['Chest'] },
          { name: 'Shoulder Press', sets: '4', reps: '8-10', tags: ['Shoulders'] },
          { name: 'Lateral Raises', sets: '4', reps: '12-15', tags: ['Shoulders'] }
        ]
      },
      {
        day: 'Tuesday',
        muscleGroups: ['Back', 'Biceps'],
        focus: 'Pull Volume Training',
        exercises: [
          { name: 'Weighted Pull-ups', sets: '5', reps: '6-8', tags: ['Back'] },
          { name: 'Barbell Rows', sets: '5', reps: '8-10', tags: ['Back'] },
          { name: 'Cable Curls', sets: '4', reps: '10-12', tags: ['Biceps'] },
          { name: 'Preacher Curls', sets: '4', reps: '12-15', tags: ['Biceps'] }
        ]
      },
      {
        day: 'Wednesday',
        muscleGroups: ['Quads', 'Hamstrings', 'Glutes'],
        focus: 'Leg Development',
        exercises: [
          { name: 'Back Squats', sets: '5', reps: '6-8', tags: ['Quads'] },
          { name: 'Romanian Deadlifts', sets: '4', reps: '8-10', tags: ['Hamstrings'] },
          { name: 'Leg Press', sets: '5', reps: '12-15', tags: ['Quads'] },
          { name: 'Leg Curls', sets: '4', reps: '12-15', tags: ['Hamstrings'] }
        ]
      },
      {
        day: 'Thursday',
        muscleGroups: ['Triceps', 'Biceps'],
        focus: 'Arm Specialization',
        exercises: [
          { name: 'Close-Grip Bench Press', sets: '4', reps: '8-10', tags: ['Triceps'] },
          { name: 'Barbell Curls', sets: '4', reps: '8-10', tags: ['Biceps'] },
          { name: 'Tricep Dips', sets: '4', reps: '10-12', tags: ['Triceps'] },
          { name: 'Hammer Curls', sets: '4', reps: '12-15', tags: ['Biceps'] }
        ]
      },
      {
        day: 'Friday',
        muscleGroups: ['Chest', 'Back'],
        focus: 'Upper Body Density',
        exercises: [
          { name: 'Dumbbell Bench Press', sets: '4', reps: '10-12', tags: ['Chest'] },
          { name: 'Cable Rows', sets: '5', reps: '10-12', tags: ['Back'] },
          { name: 'Pec Deck', sets: '4', reps: '12-15', tags: ['Chest'] },
          { name: 'Lat Pulldowns', sets: '4', reps: '12-15', tags: ['Back'] }
        ]
      },
      {
        day: 'Saturday',
        muscleGroups: ['Shoulders', 'Calves', 'Quads'],
        focus: 'Weak Point Training',
        exercises: [
          { name: 'Front Squats', sets: '5', reps: '10-12', tags: ['Quads'] },
          { name: 'Arnold Press', sets: '4', reps: '10-12', tags: ['Shoulders'] },
          { name: 'Lateral Raises', sets: '4', reps: '15-20', tags: ['Shoulders'] },
          { name: 'Calf Raises', sets: '8', reps: '20-25', tags: ['Calves'] }
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
          { name: 'Barbell Bench Press', sets: '5', reps: '3-5', tags: ['Chest'] },
          { name: 'Weighted Dips', sets: '5', reps: '6-8', tags: ['Chest'] },
          { name: 'Close-Grip Bench Press', sets: '4', reps: '6-8', tags: ['Triceps'] }
        ]
      },
      {
        day: 'Tuesday',
        muscleGroups: ['Back', 'Biceps'],
        focus: 'Power Upper Pull',
        exercises: [
          { name: 'Deadlift', sets: '5', reps: '3-5', tags: ['Back'] },
          { name: 'Weighted Pull-ups', sets: '5', reps: '5-7', tags: ['Back'] },
          { name: 'Barbell Rows', sets: '5', reps: '6-8', tags: ['Back'] }
        ]
      },
      {
        day: 'Wednesday',
        muscleGroups: ['Shoulders'],
        focus: 'Shoulder Power',
        exercises: [
          { name: 'Overhead Press', sets: '5', reps: '3-5', tags: ['Shoulders'] },
          { name: 'Push Press', sets: '4', reps: '5-6', tags: ['Shoulders'] },
          { name: 'Lateral Raises', sets: '4', reps: '10-12', tags: ['Shoulders'] }
        ]
      },
      {
        day: 'Thursday',
        muscleGroups: ['Triceps', 'Biceps'],
        focus: 'Arm Strength',
        exercises: [
          { name: 'Barbell Curls', sets: '4', reps: '6-8', tags: ['Biceps'] },
          { name: 'Skull Crushers', sets: '4', reps: '6-8', tags: ['Triceps'] },
          { name: 'Hammer Curls', sets: '4', reps: '8-10', tags: ['Biceps'] }
        ]
      },
      {
        day: 'Friday',
        muscleGroups: ['Chest', 'Back'],
        focus: 'Upper Body Volume',
        exercises: [
          { name: 'Incline Bench Press', sets: '5', reps: '8-10', tags: ['Chest'] },
          { name: 'T-Bar Rows', sets: '5', reps: '8-10', tags: ['Back'] },
          { name: 'Cable Flyes', sets: '4', reps: '12-15', tags: ['Chest'] }
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
          { name: 'Chest Exercise 1', sets: '5', reps: '8-10', tags: ['Chest'] },
          { name: 'Chest Exercise 2', sets: '4', reps: '10-12', tags: ['Chest'] },
          { name: 'Triceps Exercise 1', sets: '4', reps: '10-12', tags: ['Triceps'] },
          { name: 'Triceps Exercise 2', sets: '4', reps: '12-15', tags: ['Triceps'] },
          { name: 'Shoulders Exercise 1', sets: '4', reps: '10-12', tags: ['Shoulders'] },
          { name: 'Shoulders Exercise 2', sets: '4', reps: '12-15', tags: ['Shoulders'] }
        ]
      },
      {
        day: 'Tisdag',
        muscleGroups: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
        focus: 'Ben (framsida + baksida + glute)',
        exercises: [
          { name: 'Quads Exercise 1', sets: '5', reps: '8-10', tags: ['Quads'] },
          { name: 'Quads Exercise 2', sets: '4', reps: '10-12', tags: ['Quads'] },
          { name: 'Hamstrings Exercise', sets: '4', reps: '10-12', tags: ['Hamstrings'] },
          { name: 'Glutes Exercise', sets: '4', reps: '12-15', tags: ['Glutes'] },
          { name: 'Calves Exercise 1', sets: '4', reps: '15-20', tags: ['Calves'] },
          { name: 'Calves Exercise 2', sets: '4', reps: '15-20', tags: ['Calves'] }
        ]
      },
      {
        day: 'Onsdag',
        muscleGroups: ['Back', 'Biceps', 'Forearms'],
        focus: 'Överkropp: Drag',
        exercises: [
          { name: 'Back Exercise 1', sets: '5', reps: '6-8', tags: ['Back'] },
          { name: 'Back Exercise 2', sets: '4', reps: '8-10', tags: ['Back'] },
          { name: 'Back Exercise 3', sets: '4', reps: '10-12', tags: ['Back'] },
          { name: 'Biceps Exercise 1', sets: '3', reps: '10-12', tags: ['Biceps'] },
          { name: 'Biceps Exercise 2', sets: '3', reps: '12-15', tags: ['Biceps'] },
          { name: 'Forearms Exercise', sets: '4', reps: '15-20', tags: ['Forearms'] }
        ]
      },
      {
        day: 'Torsdag',
        muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
        focus: 'Pressfokus igen',
        exercises: [
          { name: 'Chest Exercise 1', sets: '4', reps: '8-10', tags: ['Chest'] },
          { name: 'Chest Exercise 2', sets: '4', reps: '10-12', tags: ['Chest'] },
          { name: 'Triceps Exercise 1', sets: '4', reps: '10-12', tags: ['Triceps'] },
          { name: 'Triceps Exercise 2', sets: '4', reps: '12-15', tags: ['Triceps'] },
          { name: 'Shoulders Exercise 1', sets: '4', reps: '10-12', tags: ['Shoulders'] },
          { name: 'Shoulders Exercise 2', sets: '4', reps: '12-15', tags: ['Shoulders'] }
        ]
      },
      {
        day: 'Fredag',
        muscleGroups: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
        focus: 'Ben igen',
        exercises: [
          { name: 'Quads Exercise 1', sets: '5', reps: '8-10', tags: ['Quads'] },
          { name: 'Quads Exercise 2', sets: '4', reps: '10-12', tags: ['Quads'] },
          { name: 'Hamstrings Exercise', sets: '4', reps: '10-12', tags: ['Hamstrings'] },
          { name: 'Glutes Exercise', sets: '4', reps: '12-15', tags: ['Glutes'] },
          { name: 'Calves Exercise 1', sets: '4', reps: '15-20', tags: ['Calves'] },
          { name: 'Calves Exercise 2', sets: '4', reps: '15-20', tags: ['Calves'] }
        ]
      },
      {
        day: 'Lördag',
        muscleGroups: ['Back', 'Biceps', 'Forearms'],
        focus: 'Rygg & Armar',
        exercises: [
          { name: 'Back Exercise 1', sets: '5', reps: '6-8', tags: ['Back'] },
          { name: 'Back Exercise 2', sets: '4', reps: '8-10', tags: ['Back'] },
          { name: 'Biceps Exercise 1', sets: '3', reps: '10-12', tags: ['Biceps'] },
          { name: 'Biceps Exercise 2', sets: '3', reps: '12-15', tags: ['Biceps'] },
          { name: 'Forearms Exercise 1', sets: '3', reps: '15-20', tags: ['Forearms'] },
          { name: 'Forearms Exercise 2', sets: '3', reps: '15-20', tags: ['Forearms'] }
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
