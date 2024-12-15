// src/utils/exercise.utils.ts
import { Exercise, RawExerciseData } from '../types/exercise.types';

export const exerciseUtils = {
  ensureArray(value: unknown): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [value];
      }
    }
    return [String(value)];
  },

  formatExercise(exercise: RawExerciseData | string): Exercise {
    const parsedExercise: RawExerciseData = typeof exercise === 'string' 
      ? JSON.parse(exercise) 
      : exercise;

    return {
      id: parsedExercise.id,
      title: parsedExercise.title || parsedExercise.name || 'Unnamed Exercise',
      images: this.ensureArray(parsedExercise.images || parsedExercise.image?.uri || parsedExercise.image_data),
      thumbnail: parsedExercise.thumbnail || null,
      category: parsedExercise.category || 'Uncategorized',
      equipment: parsedExercise.equipment || 'None',
      level: parsedExercise.level || 'Beginner',
      force: parsedExercise.force || null,
      mechanic: parsedExercise.mechanic || null,
      primaryMuscles: this.ensureArray(parsedExercise.primary_muscles),
      secondaryMuscles: this.ensureArray(parsedExercise.secondary_muscles),
      instructions: this.ensureArray(parsedExercise.instructions),
      sets: []
    };
  }
};