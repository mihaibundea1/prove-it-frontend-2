// services/api/endpoints/exercise/hooks/useExerciseService.ts
import { useRef, useState } from 'react';
import { ExerciseService } from '../ExerciseService';
import { Exercise } from '../types/exercise.types';
import { ApiResponse } from '../../../core/types/api.types';
import { useAuth } from '@clerk/clerk-expo';

export const useExerciseService = () => {
  const { getToken } = useAuth();
  const serviceRef = useRef(new ExerciseService(getToken));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllExercises = async (): Promise<ApiResponse<Exercise[]>> => {
    setLoading(true);
    try {
      return await serviceRef.current.fetchAllExercises();
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
      return await serviceRef.current.fetchExerciseDetails(exerciseId);
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