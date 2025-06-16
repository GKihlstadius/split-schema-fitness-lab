export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  notes?: string;
  tags?: string[];
  alternatives?: string[];
}

export interface DayPlan {
  day: string;
  muscleGroups: string[];
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutProgram {
  id: string;
  name: string;
  goal: string;
  frequency: string;
  difficulty: string;
  duration: string;
  focus: string;
  description: string;
  weeklyPlan: DayPlan[];
  benefits: string[];
}
