import { useRef, useState } from 'react';
import { ExerciseService } from '../ExerciseService';
import { Exercise } from '../types/exercise.types';
import { ApiResponse } from '../../../core/types/api.types';
import { useAuth } from '@clerk/clerk-expo';
import { CacheManager } from '@/services/cache/CacheManager';

const CACHE_KEYS = {
  ALL_EXERCISES: 'exercises:all',
  EXERCISE_DETAILS: (id: string) => `exercises:details:${id}`,
};

const CACHE_CONFIG = {
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  maxMemorySize: 100, // 100MB
  maxDiskSize: 1000, // 1GB
};

export const useExerciseService = () => {
  const { getToken } = useAuth();
  const serviceRef = useRef(new ExerciseService(getToken));
  const cacheRef = useRef(new CacheManager(CACHE_CONFIG));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllExercises = async (): Promise<ApiResponse<Exercise[]>> => {
    setLoading(true);
    try {
      // Try to get from cache first
      const cachedExercises = await cacheRef.current.get<Exercise[]>(CACHE_KEYS.ALL_EXERCISES);
      if (cachedExercises) {
        return { data: cachedExercises, status: 200 };
      }

      // If not in cache, fetch from API
      const response = await serviceRef.current.fetchAllExercises();
      
      if (response.data) {
        // Store in cache with high priority
        await cacheRef.current.set(CACHE_KEYS.ALL_EXERCISES, response.data, {
          priority: 'high',
          persist: true
        });
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exercises';
      setError(err instanceof Error ? err : new Error(errorMessage));
      return { 
        data: null, 
        error: errorMessage,
        status: 500
      };
    } finally {
      setLoading(false);
    }
  };

  const fetchExerciseDetails = async (exerciseId: string): Promise<ApiResponse<Exercise>> => {
    setLoading(true);
    try {
      const cacheKey = CACHE_KEYS.EXERCISE_DETAILS(exerciseId);
      const cachedDetails = await cacheRef.current.get<Exercise>(cacheKey);
      
      if (cachedDetails) {
        return { data: cachedDetails, status: 200 };
      }

      const response = await serviceRef.current.fetchExerciseDetails(exerciseId);
      
      if (response.data) {
        await cacheRef.current.set(cacheKey, response.data, {
          priority: 'high',
          persist: true
        });
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exercise details';
      setError(err instanceof Error ? err : new Error(errorMessage));
      return { 
        data: null, 
        error: errorMessage,
        status: 500
      };
    } finally {
      setLoading(false);
    }
  };

  const getSelectedExercises = async (): Promise<ApiResponse<Exercise[]>> => {
    try {
      return await serviceRef.current.getSelectedExercises();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get selected exercises';
      setError(err instanceof Error ? err : new Error(errorMessage));
      return { 
        data: [], 
        error: errorMessage,
        status: 500
      };
    }
  };

  const saveSelectedExercises = async (exercises: Exercise[]): Promise<ApiResponse<void>> => {
    try {
      return await serviceRef.current.saveSelectedExercises(exercises);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save selected exercises';
      setError(err instanceof Error ? err : new Error(errorMessage));
      return { 
        data: undefined, 
        error: errorMessage,
        status: 500
      };
    }
  };

  return {
    loading,
    error,
    fetchAllExercises,
    fetchExerciseDetails,
    getSelectedExercises,
    saveSelectedExercises
  };
};