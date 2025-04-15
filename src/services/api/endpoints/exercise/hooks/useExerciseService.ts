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

  const fetchAllExercises = async (): Promise<Exercise[]> => {
    setLoading(true);
    try {
      const response = await serviceRef.current.fetchAllExercises();

      // Return only the exercise data, not the whole API response
      return response.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exercises';
      setError(err instanceof Error ? err : new Error(errorMessage));
      return []; // Return empty array in case of an error
    } finally {
      setLoading(false);
    }
  };

  const fetchExerciseDetails = async (exerciseId: string): Promise<Exercise | null> => {
    setLoading(true);
    try {
      const response = await serviceRef.current.fetchExerciseDetails(exerciseId);

      // If the response doesn't contain valid data, return null
      if (!response.data || Object.keys(response.data).length === 0) {
        return null;
      }

      console.log(response.data, 'details in hook');
      
      return response.data; // Return only exercise data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exercise details';
      setError(err instanceof Error ? err : new Error(errorMessage));
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  const getSelectedExercises = async (): Promise<Exercise[] | null> => {
    try {
      const response = await serviceRef.current.getSelectedExercises();

      // Return only the exercise data or null if empty
      return response.data || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get selected exercises';
      setError(err instanceof Error ? err : new Error(errorMessage));
      return null; // Return null in case of an error
    }
  };

  const saveSelectedExercises = async (exercises: Exercise[]): Promise<void> => {
    try {
      await serviceRef.current.saveSelectedExercises(exercises);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save selected exercises';
      setError(err instanceof Error ? err : new Error(errorMessage));
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
