// utils/exercise.formatter.ts
import { Exercise } from '../types/exercise.types';

export const exerciseFormatter = {
  ensureArray(value: any): any[] {
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
    return [value];
  },

  formatExercise(exercise: any): Exercise {
    const parsedExercise = typeof exercise === 'string' ? JSON.parse(exercise) : exercise;

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
      sets: [],
      restTimer: exercise.restTimer || 'OFF', // Default to 'OFF' if not provided
    };
  }
};