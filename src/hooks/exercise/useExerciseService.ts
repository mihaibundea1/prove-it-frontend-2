// hooks/exercise/useExerciseService.ts
import { useState } from 'react';
import { ExerciseService } from '@/services/exercise/ExerciseService';
import { Exercise } from '@/types/exercise.types';
import { ApiResponse } from '@/types/api.types';

export const useExerciseService = () => {
  const [loading, setLoading] = useState(false);
  const exerciseService = new ExerciseService();

  const getExercises = async (): Promise<ApiResponse<Exercise[]>> => {
    setLoading(true);
    try {
      return await exerciseService.getExercises();
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getExercises,
  };
};