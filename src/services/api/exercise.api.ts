// src/services/api/exercise.api.ts
import { API_CONFIG } from './config';
import { Exercise, RawExerciseData } from '@/types/exercise.types';

export const exerciseApi = {
  async getAllExercises(): Promise<{ exercises: RawExerciseData[] }> {
    const response = await fetch(`${API_CONFIG.baseUrl}/exercises/all`, {
      headers: API_CONFIG.headers
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getExerciseDetails(
    exerciseId: string,
    signal?: AbortSignal
  ): Promise<{ exercise: RawExerciseData }> {
    const response = await fetch(`${API_CONFIG.baseUrl}/exercises/details/${exerciseId}`, {
      headers: API_CONFIG.headers,
      signal
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};