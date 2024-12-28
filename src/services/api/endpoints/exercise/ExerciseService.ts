// services/api/endpoints/exercise/ExerciseService.ts
import { BaseApiService } from '../../core/BaseApiService';
import { ApiResponse } from '../../core/types/api.types';
import { Exercise, ExerciseFilters } from './types/exercise.types';
import { EXERCISE_ENDPOINTS } from './constants/exercise.endpoints';

export class ExerciseService extends BaseApiService {
  constructor(getToken?: () => Promise<string | null>) {
    super(EXERCISE_ENDPOINTS.BASE, getToken);
  }

  private formatExercise(exercise: any): Exercise {
    const ensureArray = (value: any): any[] => {
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
    };

    const parsedExercise = typeof exercise === 'string' ? JSON.parse(exercise) : exercise;

    return {
      id: parsedExercise.id,
      title: parsedExercise.title || parsedExercise.name || 'Unnamed Exercise',
      images: ensureArray(parsedExercise.images || parsedExercise.image?.uri || parsedExercise.image_data),
      thumbnail: parsedExercise.thumbnail || null,
      category: parsedExercise.category || 'Uncategorized',
      equipment: parsedExercise.equipment || 'None',
      level: parsedExercise.level || 'Beginner',
      force: parsedExercise.force || null,
      mechanic: parsedExercise.mechanic || null,
      primaryMuscles: ensureArray(parsedExercise.primary_muscles),
      secondaryMuscles: ensureArray(parsedExercise.secondary_muscles),
      instructions: ensureArray(parsedExercise.instructions),
      sets: []
    };
  }

  async fetchAllExercises(): Promise<ApiResponse<Exercise[]>> {
    const response = await this.get<any[]>(EXERCISE_ENDPOINTS.ALL);
    if (response.data) {
      response.data = response.data.map(exercise => this.formatExercise(exercise));
    }
    return response;
  }

  async fetchExerciseDetails(exerciseId: string): Promise<ApiResponse<Exercise>> {
    const response = await this.get<any>(EXERCISE_ENDPOINTS.DETAILS(exerciseId));
    if (response.data) {
      response.data = this.formatExercise(response.data.exercise);
    }
    return response;
  }
}