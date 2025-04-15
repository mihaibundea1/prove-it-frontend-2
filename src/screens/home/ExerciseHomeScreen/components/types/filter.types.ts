export type MuscleGroup = 
  | "abdominals" | "hamstrings" | "adductors" | "quadriceps" | "biceps" 
  | "shoulders" | "chest" | "middle back" | "calves" | "glutes" 
  | "lower back" | "lats" | "triceps" | "traps" | "forearms"
  | "neck" | "abductors";

export type Equipment = 
  | "body only" | "machine" | "other" | "foam roll" | "kettlebells"
  | "dumbbell" | "cable" | "barbell" | "bands" | "medicine ball"
  | "exercise ball" | "e-z curl bar" | null;

export type Level = "beginner" | "intermediate" | "expert";

export interface Filters {
  muscleGroups?: MuscleGroup[];
  equipment?: Equipment[];
  level?: Level[];
}

// Filter options for the UI
export const MUSCLE_GROUPS: Record<string, MuscleGroup> = {
  "Abdominals": "abdominals",
  "Hamstrings": "hamstrings",
  "Adductors": "adductors",
  "Quadriceps": "quadriceps",
  "Biceps": "biceps",
  "Shoulders": "shoulders",
  "Chest": "chest",
  "Middle Back": "middle back",
  "Calves": "calves",
  "Glutes": "glutes",
  "Lower Back": "lower back",
  "Lats": "lats",
  "Triceps": "triceps",
  "Traps": "traps",
  "Forearms": "forearms",
  "Neck": "neck",
  "Abductors": "abductors"
};

export const EQUIPMENT_OPTIONS: Equipment[] = [
  "body only",
  "machine",
  "other",
  "foam roll",
  "kettlebells",
  "dumbbell",
  "cable",
  "barbell",
  "bands",
  "medicine ball",
  "exercise ball",
  "e-z curl bar"
];

export const LEVEL_OPTIONS: Level[] = [
  "beginner",
  "intermediate",
  "expert"
];

export const filterOptions = {
  level: LEVEL_OPTIONS,
  muscleGroups: Object.values(MUSCLE_GROUPS),
  equipment: EQUIPMENT_OPTIONS,
};

export type FilterOptionKey = keyof typeof filterOptions;