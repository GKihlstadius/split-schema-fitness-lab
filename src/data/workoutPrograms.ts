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
        muscleGroups: ['Chest', 'Triceps', 'Shoulders', 'Biceps', 'Calves'],
        focus: 'Bröst, Triceps, Axlar, Biceps, Vader',
        exercises: [
          { name: 'Chest Exercise 1', sets: '3-4', reps: '8-12', rest: '60-90 sek', tags: ['Chest'] },
          { name: 'Chest Exercise 2', sets: '3-4', reps: '8-12', rest: '60-90 sek', tags: ['Chest'] },
          { name: 'Triceps Exercise', sets: '3-4', reps: '10-15', rest: '45-60 sek', tags: ['Triceps'] },
          { name: 'Calves Exercise', sets: '3-4', reps: '15-20', rest: '30-45 sek', tags: ['Calves'] },
          { name: 'Shoulders Exercise', sets: '3-4', reps: '8-12', rest: '60-90 sek', tags: ['Shoulders'] },
          { name: 'Biceps Exercise', sets: '3-4', reps: '10-15', rest: '45-60 sek', tags: ['Biceps'] }
        ]
      },
      {
        day: 'Tisdag',
        muscleGroups: ['Hamstrings', 'Quads'],
        focus: 'Ben (bak & fram)',
        exercises: [
          { name: 'Hamstrings Exercise', sets: '3-4', reps: '8-12', tags: ['Hamstrings'] },
          { name: 'Quads Exercise', sets: '3-4', reps: '8-12', tags: ['Quads'] }
        ]
      },
      {
        day: 'Onsdag',
        muscleGroups: ['Back', 'Biceps', 'Forearms'],
        focus: 'Rygg, Biceps, Underarmar',
        exercises: [
          { name: 'Back Exercise 1', sets: '3-4', reps: '8-12', tags: ['Back'] },
          { name: 'Back Exercise 2', sets: '3-4', reps: '8-12', tags: ['Back'] },
          { name: 'Back Exercise 3', sets: '3-4', reps: '8-12', tags: ['Back'] },
          { name: 'Biceps Exercise', sets: '3-4', reps: '10-15', tags: ['Biceps'] },
          { name: 'Forearms Exercise', sets: '3-4', reps: '15-20', tags: ['Forearms'] }
        ]
      },
      {
        day: 'Torsdag',
        muscleGroups: ['Triceps', 'Chest', 'Calves', 'Shoulders', 'Biceps'],
        focus: 'Tryckmuskler + lite armar',
        exercises: [
          { name: 'Triceps Exercise 1', sets: '3-4', reps: '10-15', tags: ['Triceps'] },
          { name: 'Triceps Exercise 2', sets: '3-4', reps: '10-15', tags: ['Triceps'] },
          { name: 'Chest Exercise 1', sets: '3-4', reps: '8-12', tags: ['Chest'] },
          { name: 'Chest Exercise 2', sets: '3-4', reps: '8-12', tags: ['Chest'] },
          { name: 'Calves Exercise', sets: '3-4', reps: '15-20', tags: ['Calves'] },
          { name: 'Shoulders Exercise', sets: '3-4', reps: '8-12', tags: ['Shoulders'] },
          { name: 'Biceps Exercise', sets: '3-4', reps: '10-15', tags: ['Biceps'] }
        ]
      },
      {
        day: 'Fredag',
        muscleGroups: ['Hamstrings', 'Quads', 'Glutes'],
        focus: 'Ben & säte',
        exercises: [
          { name: 'Hamstrings Exercise', sets: '3-4', reps: '8-12', tags: ['Hamstrings'] },
          { name: 'Quads Exercise', sets: '3-4', reps: '8-12', tags: ['Quads'] },
          { name: 'Glutes Exercise', sets: '3-4', reps: '12-15', tags: ['Glutes'] }
        ]
      },
      {
        day: 'Lördag',
        muscleGroups: ['Back', 'Shoulders', 'Biceps', 'Forearms'],
        focus: 'Rygg, Axlar, Armar, Underarmar',
        exercises: [
          { name: 'Back Exercise 1', sets: '3-4', reps: '8-12', tags: ['Back'] },
          { name: 'Back Exercise 2', sets: '3-4', reps: '8-12', tags: ['Back'] },
          { name: 'Shoulders Exercise', sets: '3-4', reps: '8-12', tags: ['Shoulders'] },
          { name: 'Biceps Exercise', sets: '3-4', reps: '10-15', tags: ['Biceps'] },
          { name: 'Forearms Exercise', sets: '3-4', reps: '15-20', tags: ['Forearms'] }
        ]
      },
      {
        day: 'Söndag',
        muscleGroups: ['Rest'],
        focus: 'Vila / Aktiv återhämtning',
        exercises: [
          { name: 'Vila / Aktiv återhämtning', sets: '-', reps: '-', tags: ['Rest'] }
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
        day: 'Måndag',
        muscleGroups: ['Chest', 'Shoulders'],
        focus: 'Upper Body Push Volume',
        exercises: [
          { name: 'Bench Press', sets: '4', reps: '5-7', tags: ['Chest'] },
          { name: 'Incline Dumbbell Press', sets: '3', reps: '8-10', tags: ['Chest'] },
          { name: 'Shoulder Press', sets: '4', reps: '8-10', tags: ['Shoulders'] },
          { name: 'Lateral Raises', sets: '4', reps: '12-15', tags: ['Shoulders'] }
        ]
      },
      {
        day: 'Tisdag',
        muscleGroups: ['Back', 'Biceps'],
        focus: 'Pull Volume Training',
        exercises: [
          { name: 'Weighted Pull-ups', sets: '3', reps: '6-8', tags: ['Back'] },
          { name: 'Barbell Rows', sets: '3', reps: '8-10', tags: ['Back'] },
          { name: 'Cable Curls', sets: '4', reps: '10-12', tags: ['Biceps'] },
          { name: 'Preacher Curls', sets: '4', reps: '12-15', tags: ['Biceps'] }
        ]
      },
      {
        day: 'Onsdag',
        muscleGroups: ['Quads', 'Hamstrings', 'Glutes'],
        focus: 'Leg Development',
        exercises: [
          { name: 'Back Squats', sets: '3', reps: '6-8', tags: ['Quads'] },
          { name: 'Romanian Deadlifts', sets: '4', reps: '8-10', tags: ['Hamstrings'] },
          { name: 'Leg Press', sets: '2', reps: '12-15', tags: ['Quads'] },
          { name: 'Leg Curls', sets: '4', reps: '12-15', tags: ['Hamstrings'] }
        ]
      },
      {
        day: 'Torsdag',
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
        day: 'Fredag',
        muscleGroups: ['Chest', 'Back'],
        focus: 'Upper Body Density',
        exercises: [
          { name: 'Dumbbell Bench Press', sets: '4', reps: '10-12', tags: ['Chest'] },
          { name: 'Cable Rows', sets: '3', reps: '10-12', tags: ['Back'] },
          { name: 'Pec Deck', sets: '3', reps: '12-15', tags: ['Chest'] },
          { name: 'Lat Pulldowns', sets: '2', reps: '12-15', tags: ['Back'] }
        ]
      },
      {
        day: 'Lördag',
        muscleGroups: ['Shoulders', 'Calves', 'Quads'],
        focus: 'Weak Point Training',
        exercises: [
          { name: 'Front Squats', sets: '3', reps: '10-12', tags: ['Quads'] },
          { name: 'Arnold Press', sets: '2', reps: '10-12', tags: ['Shoulders'] },
          { name: 'Lateral Raises', sets: '2', reps: '15-20', tags: ['Shoulders'] },
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
        day: 'Måndag',
        muscleGroups: ['Chest', 'Triceps'],
        focus: 'Power Upper Push',
        exercises: [
          { name: 'Barbell Bench Press', sets: '4', reps: '3-5', tags: ['Chest'] },
          { name: 'Weighted Dips', sets: '3', reps: '6-8', tags: ['Chest'] },
          { name: 'Close-Grip Bench Press', sets: '4', reps: '6-8', tags: ['Triceps'] }
        ]
      },
      {
        day: 'Tisdag',
        muscleGroups: ['Back', 'Biceps'],
        focus: 'Power Upper Pull',
        exercises: [
          { name: 'Deadlift', sets: '3', reps: '3-5', tags: ['Back'] },
          { name: 'Weighted Pull-ups', sets: '3', reps: '5-7', tags: ['Back'] },
          { name: 'Barbell Rows', sets: '3', reps: '6-8', tags: ['Back'] }
        ]
      },
      {
        day: 'Onsdag',
        muscleGroups: ['Shoulders'],
        focus: 'Shoulder Power',
        exercises: [
          { name: 'Overhead Press', sets: '4', reps: '3-5', tags: ['Shoulders'] },
          { name: 'Push Press', sets: '4', reps: '5-6', tags: ['Shoulders'] },
          { name: 'Lateral Raises', sets: '4', reps: '10-12', tags: ['Shoulders'] }
        ]
      },
      {
        day: 'Torsdag',
        muscleGroups: ['Triceps', 'Biceps'],
        focus: 'Arm Strength',
        exercises: [
          { name: 'Barbell Curls', sets: '4', reps: '6-8', tags: ['Biceps'] },
          { name: 'Skull Crushers', sets: '4', reps: '6-8', tags: ['Triceps'] },
          { name: 'Hammer Curls', sets: '4', reps: '8-10', tags: ['Biceps'] }
        ]
      },
      {
        day: 'Fredag',
        muscleGroups: ['Chest', 'Back'],
        focus: 'Upper Body Volume',
        exercises: [
          { name: 'Incline Bench Press', sets: '4', reps: '8-10', tags: ['Chest'] },
          { name: 'T-Bar Rows', sets: '3', reps: '8-10', tags: ['Back'] },
          { name: 'Cable Flyes', sets: '3', reps: '12-15', tags: ['Chest'] }
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
          { name: 'Chest Exercise 1', sets: '4', reps: '8-10', tags: ['Chest'] },
          { name: 'Chest Exercise 2', sets: '3', reps: '10-12', tags: ['Chest'] },
          { name: 'Triceps Exercise 1', sets: '3', reps: '10-12', tags: ['Triceps'] },
          { name: 'Triceps Exercise 2', sets: '3', reps: '12-15', tags: ['Triceps'] },
          { name: 'Shoulders Exercise 1', sets: '3', reps: '10-12', tags: ['Shoulders'] },
          { name: 'Shoulders Exercise 2', sets: '3', reps: '12-15', tags: ['Shoulders'] }
        ]
      },
      {
        day: 'Tisdag',
        muscleGroups: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
        focus: 'Ben (framsida + baksida + glute)',
        exercises: [
          { name: 'Quads Exercise 1', sets: '3', reps: '8-10', tags: ['Quads'] },
          { name: 'Quads Exercise 2', sets: '2', reps: '10-12', tags: ['Quads'] },
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
          { name: 'Back Exercise 1', sets: '3', reps: '6-8', tags: ['Back'] },
          { name: 'Back Exercise 2', sets: '2', reps: '8-10', tags: ['Back'] },
          { name: 'Back Exercise 3', sets: '2', reps: '10-12', tags: ['Back'] },
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
          { name: 'Chest Exercise 2', sets: '3', reps: '10-12', tags: ['Chest'] },
          { name: 'Triceps Exercise 1', sets: '3', reps: '10-12', tags: ['Triceps'] },
          { name: 'Triceps Exercise 2', sets: '3', reps: '12-15', tags: ['Triceps'] },
          { name: 'Shoulders Exercise 1', sets: '3', reps: '10-12', tags: ['Shoulders'] },
          { name: 'Shoulders Exercise 2', sets: '3', reps: '12-15', tags: ['Shoulders'] }
        ]
      },
      {
        day: 'Fredag',
        muscleGroups: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
        focus: 'Ben igen',
        exercises: [
          { name: 'Quads Exercise 1', sets: '3', reps: '8-10', tags: ['Quads'] },
          { name: 'Quads Exercise 2', sets: '2', reps: '10-12', tags: ['Quads'] },
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
          { name: 'Back Exercise 1', sets: '3', reps: '6-8', tags: ['Back'] },
          { name: 'Back Exercise 2', sets: '2', reps: '8-10', tags: ['Back'] },
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
  },
  {
    id: '5',
    name: 'Gabbelito',
    goal: 'Hypertrophy',
    frequency: '5/WEEK',
    difficulty: 'Advanced',
    duration: '16 WEEKS',
    focus: 'Whole Body Mass Building',
    description: 'Ett avancerat 5-dagars hypertrofiprogram: Push/Pull/Legs, dedikerad arm- & axeldag, upper + weak points. 20+ set/vecka biceps/triceps.',
    weeklyPlan: [
      {
        day: 'Måndag',
        muscleGroups: ['Chest', 'Shoulders'],
        focus: 'Push (Chest & Front Delts Focus)',
        exercises: [
          { name: 'Bench Press', sets: '4', reps: '5-7', tags: ['Chest'] },
          { name: 'Incline Dumbbell Press', sets: '4', reps: '8-10', tags: ['Upper Chest'] },
          { name: 'Machine Chest Press', sets: '3', reps: '10-12', tags: ['Chest'] },
          { name: 'Cable Fly (låg till hög)', sets: '3', reps: '12-15', tags: ['Upper Chest'] },
          { name: 'Lateral Raises (light)', sets: '3', reps: '15-20', tags: ['Side Delts'] },
        ],
      },
      {
        day: 'Tisdag',
        muscleGroups: ['Back', 'Shoulders'],
        focus: 'Pull (Back & Rear Delts Focus)',
        exercises: [
          { name: 'Weighted Pull-ups', sets: '4', reps: '6-8', tags: ['Lats'] },
          { name: 'Barbell Row', sets: '4', reps: '8-10', tags: ['Mid Back'] },
          { name: 'Chest Supported Row', sets: '3', reps: '10-12', tags: ['Upper Back'] },
          { name: 'Lat Pulldown (wide grip)', sets: '3', reps: '10-12', tags: ['Lats'] },
          { name: 'Face Pulls', sets: '4', reps: '15-20', tags: ['Rear Delts'] },
          { name: 'Reverse Pec Deck', sets: '3', reps: '12-15', tags: ['Rear Delts'] },
        ],
      },
      {
        day: 'Onsdag',
        muscleGroups: ['Quads', 'Hamstrings', 'Glutes'],
        focus: 'Legs (Quads, Hamstrings, Glutes)',
        exercises: [
          { name: 'Back Squat', sets: '4', reps: '6-8', tags: ['Quads', 'Glutes'] },
          { name: 'Romanian Deadlift', sets: '4', reps: '8-10', tags: ['Hamstrings'] },
          { name: 'Leg Press', sets: '3', reps: '12-15', tags: ['Quads'] },
          { name: 'Leg Curl (lying)', sets: '4', reps: '12-15', tags: ['Hamstrings'] },
          { name: 'Bulgarian Split Squat', sets: '3', reps: '10-12/leg', tags: ['Quads', 'Glutes'] },
          { name: 'Hip Abduction Machine', sets: '3', reps: '15-20', tags: ['Glutes'] },
        ],
      },
      {
        day: 'Torsdag',
        muscleGroups: ['Shoulders', 'Biceps', 'Triceps'],
        focus: 'Arms & Delts (The Gun Show)',
        exercises: [
          { name: 'Seated Dumbbell Press', sets: '4', reps: '8-10', tags: ['Front/Side Delts'], notes: 'Tung start' },
          { name: 'Barbell Curls', sets: '4', reps: '8-10', tags: ['Biceps'], notes: 'Massbyggare' },
          { name: 'Skull Crushers (EZ-bar)', sets: '4', reps: '10-12', tags: ['Triceps'], notes: 'Massbyggare' },
          { name: 'Lateral Raises (cable)', sets: '4', reps: '12-15', tags: ['Side Delts'], notes: 'Konstant spänning' },
          { name: 'Incline Dumbbell Curls', sets: '3', reps: '10-12', tags: ['Biceps'], notes: 'Stretch-fokus, långt huvud' },
          { name: 'Close-Grip Bench Press', sets: '4', reps: '8-10', tags: ['Triceps'], notes: 'Tungt' },
          { name: 'Cable Curls (straight bar)', sets: '3', reps: '12-15', tags: ['Biceps'], notes: 'Pump' },
          { name: 'Tricep Pushdowns (rope)', sets: '3', reps: '12-15', tags: ['Triceps'], notes: 'Pump' },
          { name: 'Front Raises (plate)', sets: '3', reps: '12-15', tags: ['Front Delts'], notes: 'Brännare' },
        ],
      },
      {
        day: 'Fredag',
        muscleGroups: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Calves'],
        focus: 'Upper Body & Weak Points',
        exercises: [
          { name: 'Dumbbell Bench Press', sets: '4', reps: '8-10', tags: ['Chest'] },
          { name: 'Cable Row', sets: '4', reps: '10-12', tags: ['Back'] },
          { name: 'Arnold Press', sets: '3', reps: '10-12', tags: ['Delts'] },
          { name: 'Pec Deck', sets: '3', reps: '12-15', tags: ['Chest'] },
          { name: 'Straight-Arm Pulldown', sets: '3', reps: '12-15', tags: ['Lats'] },
          { name: 'Hammer Curls', sets: '3', reps: '10-12', tags: ['Biceps', 'Brachialis'] },
          { name: 'Overhead Cable Extensions', sets: '3', reps: '12-15', tags: ['Triceps'] },
          { name: 'Standing Calf Raises', sets: '4', reps: '15-20', tags: ['Calves'] },
        ],
      },
    ],
    benefits: [
      'Torsdag = ren arm/axel-dag (32 set totalt). Biceps/triceps borttagna från måndag/tisdag.',
      'Bröst 24 set/vecka, rygg 21 set. Ökad volym jämfört med tidigare.',
      'Balanserat 20+ set/vecka biceps/triceps. Side delts 17 set för "capped" look.',
      'Progression: Når du övre rep-range → öka vikt 2,5–5 kg. Torsdag: pump & spänning före maxvikt.',
    ],
  }
];
