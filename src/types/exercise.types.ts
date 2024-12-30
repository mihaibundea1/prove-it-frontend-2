// src/types/exercise.types.ts
export interface ExerciseSet {
    weight: string;
    reps: string;
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

export interface RawExerciseData {
    id: string;
    title?: string;
    name?: string;
    images?: string | string[];
    image?: {
        uri?: string;
    };
    image_data?: string | string[];
    thumbnail?: string;
    category?: string;
    equipment?: string;
    level?: string;
    force?: string;
    mechanic?: string;
    primary_muscles?: string | string[];
    secondary_muscles?: string | string[];
    instructions?: string | string[];
}

export type ExerciseSetField = 'weight' | 'reps';

export interface ExerciseContextType {
    exercisesTypes: Exercise[];
    allExercises: Exercise[];
    selectedExercises: Exercise[];
    loadingExercises: boolean;
    error: string | null;
    exerciseDetails: Record<string, Exercise>;
    setSelectedExercises: (exercises: Exercise[]) => void;
    applyFilters: (filters: Record<string, string>) => void;
    fetchExerciseDetails: (exerciseId: string) => Promise<Exercise | null>;
    toggleExercise: (exercise: Exercise) => void;
    clearSelectedExercises: () => void;
    addSetToExercise: (exerciseId: string) => void;
    removeSet: (exerciseId: string, setIndex: number) => void;
    updateSet: (
        exerciseId: string, 
        setIndex: number, 
        field: 'weight' | 'reps',  // Schimbat de la string la union type specific
        value: string
    ) => void;
}

export interface ExerciseCardProps {
    exercise: {
      id: string;
      title: string;
      thumbnail: string | null;
      images: string[];
    };
    onPress: () => void;
    onInfoPress: () => void;
    isSelected: boolean;
  }