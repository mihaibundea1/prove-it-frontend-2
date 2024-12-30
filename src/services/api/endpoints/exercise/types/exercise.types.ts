// services/api/endpoints/exercise/types/exercise.types.ts
import type { Exercise } from "@/types/exercise.types";

export { Exercise };

export interface ExerciseSet {
  weight: string | number;
  reps: string | number;
}

export interface ExerciseFilters {
  category?: string;
  equipment?: string;
  level?: string;
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

export interface Filters {
  category?: string;
  equipment?: string;
  level?: string;
  [key: string]: string | undefined;
}
