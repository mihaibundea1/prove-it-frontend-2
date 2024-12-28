import { Exercise } from '@/types/exercise.types';

export type FilterOptionKey = 'force' | 'level' | 'mechanic' | 'equipment' | 'category';

export type FilterOptions = {
  [K in FilterOptionKey]: readonly string[]
};

export type Filters = {
  [K in FilterOptionKey]?: string | null;
};

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: Filters;
  onApplyFilters: (filters: Filters) => void;
}

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export interface ExerciseListProps {
  exercises: Exercise[];
  selectedExercises: Exercise[];
  onExercisePress: (exercise: Exercise) => void;
  onExerciseInfo: (exercise: Exercise) => void;
  onFilterPress: () => void;
}

export interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
  onInfoPress: () => void;
  isSelected: boolean;
}

export interface CreateWorkoutButtonProps {
  selectedCount: number;
  onPress: () => void;
}

export const filterOptions: FilterOptions = {
  force: ['push', 'pull'] as const,
  level: ['beginner', 'intermediate', 'advanced'] as const,
  mechanic: ['compound', 'isolation'] as const,
  equipment: ['body only', 'dumbbell', 'barbell', 'cable', 'machine'] as const,
  category: ['strength', 'stretching', 'plyometrics', 'cardio'] as const
};