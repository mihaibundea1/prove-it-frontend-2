// services/api/endpoints/exercise/hooks/useExercisePreloader.ts
import { useEffect, useCallback, useState } from 'react';
import { ExerciseService } from '../ExerciseService';  // Importăm ExerciseService direct
import { cacheUtils } from '../utils/cache.utils';
import { CACHE_CONSTANTS } from '../constants/cache.constants';
import { Exercise } from '@/types/exercise.types';

export const useExercisePreloader = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadExercises = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Loading exercises...");

      // Verificăm cache-ul
      const cachedExercises = await cacheUtils.get<Exercise[]>(CACHE_CONSTANTS.EXERCISE_KEY);
      if (cachedExercises) {
        setExercises(cachedExercises); // Setăm exercițiile din cache
        console.log("Loaded exercises from cache.");
        return cachedExercises;
      }

      // Dacă nu există în cache, apelăm API-ul
      const exerciseService = new ExerciseService();  // Instanțiem direct ExerciseService
      const response = await exerciseService.fetchAllExercises();  // Apelăm funcția fetchAllExercises

      if (response.data && Array.isArray(response.data)) {
        const fetchedExercises = response.data;
        await cacheUtils.set(CACHE_CONSTANTS.EXERCISE_KEY, fetchedExercises); // Salvăm exercițiile în cache
        setExercises(fetchedExercises); // Setăm exercițiile în state
        console.log("Loaded exercises from API and saved to cache.");
        return fetchedExercises;
      } else {
        throw new Error("No exercises found.");
      }
    } catch (err) {
      console.error('Failed to preload exercises:', err);
      setError("Failed to load exercises.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  return { exercises, loading, error, loadExercises };
};
