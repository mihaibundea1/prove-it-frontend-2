// services/api/endpoints/exercise/ExerciseService.ts
import { BaseApiService } from '../../core/BaseApiService';
import { Exercise, ExerciseResponse, ExerciseDetailResponse } from './types/exercise.types';
import { EXERCISE_ENDPOINTS } from './constants/exercise.endpoints';
import { exerciseFormatter } from './utils/exercise.formatter';
import { ApiResponse } from '../../core/types/api.types';
import { cacheUtils } from './utils/cache.utils';
import { CACHE_CONSTANTS } from './constants/cache.constants';

export class ExerciseService extends BaseApiService {
  constructor(getToken?: () => Promise<string | null>) {
    super(EXERCISE_ENDPOINTS.BASE, getToken);
  }

  async fetchAllExercises(): Promise<ApiResponse<Exercise[]>> {
    try {
      // Check cache first
      const cached = await cacheUtils.get<Exercise[]>(CACHE_CONSTANTS.KEYS.ALL_EXERCISES);
      if (cached) {
        return { 
          data: cached, 
          error: undefined,
          status: 200 
        };
      }

      const response = await this.get<ExerciseResponse>(EXERCISE_ENDPOINTS.ALL);
      
      if (response.error) {
        return { 
          data: null, 
          error: response.error,
          status: response.status || 400
        };
      }

      if (!response.data?.exercises) {
        return {
          data: null,
          error: 'Invalid response format',
          status: response.status || 400
        };
      }

      const formattedExercises = response.data.exercises
        .map(exercise => exerciseFormatter.formatExercise(exercise))
        .filter(Boolean);

      // Cache the formatted exercises
      await cacheUtils.set(CACHE_CONSTANTS.KEYS.ALL_EXERCISES, formattedExercises);

      return { 
        data: formattedExercises, 
        error: undefined,
        status: response.status || 200
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch exercises';
      return { 
        data: null, 
        error: errorMessage,
        status: 500
      };
    }
  }

  async fetchExerciseDetails(exerciseId: string): Promise<ApiResponse<Exercise>> {
    try {
      // Check cache first
      const cacheKey = CACHE_CONSTANTS.KEYS.EXERCISE_DETAILS(exerciseId);
      const cached = await cacheUtils.get<Exercise>(cacheKey);
      if (cached) {
        return { 
          data: cached, 
          error: undefined,
          status: 200 
        };
      }

      const response = await this.get<ExerciseDetailResponse>(
        EXERCISE_ENDPOINTS.DETAILS(exerciseId)
      );

      if (response.error) {
        return { 
          data: null, 
          error: response.error,
          status: response.status || 400
        };
      }

      if (!response.data?.exercise) {
        return {
          data: null,
          error: 'Invalid response format',
          status: response.status || 400
        };
      }

      const formattedExercise = exerciseFormatter.formatExercise(response.data.exercise);

      // Cache the formatted exercise
      await cacheUtils.set(cacheKey, formattedExercise);

      return { 
        data: formattedExercise, 
        error: undefined,
        status: response.status || 200
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch exercise details';
      return { 
        data: null, 
        error: errorMessage,
        status: 500
      };
    }
  }

  async getSelectedExercises(): Promise<ApiResponse<Exercise[]>> {
    try {
      const exercises = await cacheUtils.get<Exercise[]>(CACHE_CONSTANTS.KEYS.SELECTED_EXERCISES);
      return { 
        data: exercises || [], 
        error: undefined,
        status: 200
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get selected exercises';
      return {
        data: [], 
        error: errorMessage,
        status: 500
      };
    }
  }

  async saveSelectedExercises(exercises: Exercise[]): Promise<ApiResponse<void>> {
    try {
      await cacheUtils.set(CACHE_CONSTANTS.KEYS.SELECTED_EXERCISES, exercises);
      return { 
        data: undefined, 
        error: undefined,
        status: 200 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save selected exercises';
      return {
        data: undefined,
        error: errorMessage,
        status: 500
      };
    }
  }
}