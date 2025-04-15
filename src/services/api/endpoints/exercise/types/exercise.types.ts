// services/api/endpoints/exercise/types/exercise.types.ts
import type { Exercise } from "@/types/exercise.types";

export { Exercise };

export interface ExerciseSet {
  weight: string | number;
  reps: string | number;
}
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

export interface ExerciseFilters {
  muscleGroups?: MuscleGroup[];
  equipment?: Equipment[];
  level?: Level[];
}

export interface ExerciseResponse {
  exercises: Exercise[];
  error?: string;
}

export interface ExerciseDetailResponse {
  exercise: Exercise;
  error?: string;
}

export interface ExerciseContextType {
  exercisesTypes: Exercise[];
  allExercises: Exercise[];
  selectedExercises: Exercise[];
  loadingExercises: boolean;
  error: string | null;
  exerciseDetails: Record<string, Exercise>;
  setSelectedExercises: (exercises: Exercise[]) => void;
  applyFilters: (filters: ExerciseFilters) => void;
  fetchExerciseDetails: (id: string) => Promise<Exercise | null>;
  toggleExercise: (exercise: Exercise) => void;
  clearSelectedExercises: () => void;
  addSetToExercise: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setIndex: number) => void;
  updateSet: (exerciseId: string, setIndex: number, field: string, value: string) => void;
}


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

export interface Filters {
  category?: string;
  equipment?: string;
  level?: string;
  [key: string]: string | string[] | undefined;
}

export const filterOptions = {
  muscleGroups: Object.values(MUSCLE_GROUPS),
  equipment: EQUIPMENT_OPTIONS,
  level: LEVEL_OPTIONS
};

export type FilterOptionKey = keyof typeof filterOptions;