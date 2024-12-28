// src/screens/home/ExerciseHomeScreen/types/filter.types.ts
export type FilterOptionKey = 'category' | 'equipment' | 'level';

export interface Filters {
  category?: string;
  equipment?: string;
  level?: string;
  [key: string]: string | undefined;
}

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: Filters;
  onApplyFilters: (filters: Filters) => void;
}

// Am eliminat 'as const' și am făcut array-urile mutabile
export const filterOptions: Record<FilterOptionKey, string[]> = {
  category: [
    'Strength',
    'Cardio',
    'Flexibility',
    'Balance',
    'Plyometrics'
  ],
  equipment: [
    'None',
    'Dumbbells',
    'Barbell',
    'Kettlebell',
    'Resistance Bands',
    'Machine'
  ],
  level: [
    'Beginner',
    'Intermediate',
    'Advanced'
  ]
};