// services/api/endpoints/exercise/types/exercise.types.ts
export interface ExerciseSet {
    weight: string | number;
    reps: string | number;
  }
  
  export interface Exercise {
    id: string;
    title: string;
    images: string[];
    thumbnail: string | null;
    category: string;
    equipment: string;
    level: string;
    force: string | null;
    mechanic: string | null;
    primaryMuscles: string[];
    secondaryMuscles: string[];
    instructions: string[];
    sets: ExerciseSet[];
  }
  
  export interface ExerciseFilters {
    category?: string;
    equipment?: string;
    level?: string;
  }