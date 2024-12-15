// src/contexts/ExerciseContext.tsx
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Exercise, ExerciseContextType } from '../types/exercise.types';
import { exerciseApi } from '../services/api/exercise.api';
import { exerciseUtils } from '../utils/exercise.utils';

export const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

interface ExerciseProviderProps {
  children: React.ReactNode;
}

export const ExerciseProvider: React.FC<ExerciseProviderProps> = ({ children }) => {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [exercisesTypes, setExercisesTypes] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseDetails, setExerciseDetails] = useState<Record<string, Exercise>>({});
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const initialFetchDone = useRef(false);

  const fetchInitialExercises = async () => {
    if (initialFetchDone.current) return;

    try {
      const { exercises } = await exerciseApi.getAllExercises();
      const formattedExercises = exercises
        .map(exercise => {
          try {
            return exerciseUtils.formatExercise(exercise);
          } catch (err) {
            console.error('Error formatting exercise:', err);
            return null;
          }
        })
        .filter((exercise): exercise is Exercise => exercise !== null);

      setAllExercises(formattedExercises);
      setExercisesTypes(formattedExercises);
      initialFetchDone.current = true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching exercises:', errorMessage);
    } finally {
      setLoadingExercises(false);
    }
  };

  useEffect(() => {
    fetchInitialExercises();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const toggleExercise = useCallback((exercise: Exercise) => {
    if (!exercise?.id) {
      console.error('Invalid exercise object:', exercise);
      return;
    }

    setSelectedExercises(prev => {
      const isSelected = prev.some(ex => ex.id === exercise.id);
      
      if (isSelected) {
        return prev.filter(ex => ex.id !== exercise.id);
      } else {
        return [...prev, {
          ...exercise,
          sets: [{ weight: '', reps: '' }]
        }];
      }
    });
  }, []);

  const applyFilters = useCallback((filters: Record<string, string>) => {
    if (!filters || Object.keys(filters).length === 0) {
      setExercisesTypes(allExercises);
      return;
    }

    const filtered = allExercises.filter(exercise => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const exerciseValue = exercise[key as keyof Exercise];
        return typeof exerciseValue === 'string' && 
               exerciseValue.toLowerCase() === value.toLowerCase();
      });
    });

    setExercisesTypes(filtered);
  }, [allExercises]);

  const fetchExerciseDetails = useCallback(async (exerciseId: string): Promise<Exercise | null> => {
    if (!exerciseId) {
      console.error('No exercise ID provided');
      return null;
    }

    setLoadingExercises(true);
    
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      const { exercise } = await exerciseApi.getExerciseDetails(
        exerciseId,
        abortControllerRef.current.signal
      );

      const details = exerciseUtils.formatExercise(exercise);
      
      setExerciseDetails(prev => ({
        ...prev,
        [exerciseId]: details
      }));

      return details;

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Fetch aborted');
        return null;
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching exercise details:', errorMessage);
      return null;
    } finally {
      setLoadingExercises(false);
    }
  }, []);

  const addSetToExercise = useCallback((exerciseId: string) => {
    setSelectedExercises(prev =>
      prev.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: [...ex.sets, { weight: '', reps: '' }]
          };
        }
        return ex;
      })
    );
  }, []);

  const removeSet = useCallback((exerciseId: string, setIndex: number) => {
    setSelectedExercises(prev =>
      prev.map(ex => {
        if (ex.id === exerciseId) {
          const newSets = [...ex.sets];
          newSets.splice(setIndex, 1);
          return {
            ...ex,
            sets: newSets.length ? newSets : [{ weight: '', reps: '' }]
          };
        }
        return ex;
      })
    );
  }, []);

  const updateSet = useCallback((
    exerciseId: string,
    setIndex: number,
    field: 'weight' | 'reps',
    value: string
  ) => {
    setSelectedExercises(prev =>
      prev.map(ex => {
        if (ex.id === exerciseId) {
          const newSets = [...ex.sets];
          if (newSets[setIndex]) {
            newSets[setIndex] = {
              ...newSets[setIndex],
              [field]: value
            };
          }
          return { ...ex, sets: newSets };
        }
        return ex;
      })
    );
  }, []);

  const clearSelectedExercises = useCallback(() => {
    setSelectedExercises([]);
  }, []);

  const value: ExerciseContextType = {
    exercisesTypes,
    allExercises,
    selectedExercises,
    loadingExercises,
    error,
    setSelectedExercises,
    applyFilters,
    fetchExerciseDetails,
    toggleExercise,
    clearSelectedExercises,
    addSetToExercise,
    removeSet,
    updateSet,
    exerciseDetails
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};
