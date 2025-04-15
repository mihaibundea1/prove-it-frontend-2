// contexts/exercise/ExerciseContext.tsx
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Exercise, ExerciseContextType, ExerciseFilters } from '@/services/api/endpoints/exercise/types/exercise.types';
import { useExerciseService } from '@/services/api/endpoints/exercise/hooks/useExerciseService';

// State Management
interface State {
  allExercises: Exercise[];
  exercisesTypes: Exercise[];
  selectedExercises: Exercise[];
  exerciseDetails: Record<string, Exercise>;
  loadingExercises: boolean;
  error: string | null;
}

const initialState: State = {
  allExercises: [],
  exercisesTypes: [],
  selectedExercises: [],
  exerciseDetails: {},
  loadingExercises: true,
  error: null
};

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

interface ExerciseProviderProps {
  children: React.ReactNode;
  onError?: (error: string) => void;
}

export const ExerciseProvider: React.FC<ExerciseProviderProps> = ({
  children,
  onError
}) => {
  // State & Refs
  const [state, setState] = useState<State>(initialState);
  const initialFetchDone = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingUpdateRef = useRef<boolean>(false);

  // Services
  const {
    loading: serviceLoading,
    fetchAllExercises,
    fetchExerciseDetails,
    getSelectedExercises,
    saveSelectedExercises
  } = useExerciseService();

  // Helper Functions
  const handleError = useCallback((error: unknown) => {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    setState(prev => ({ ...prev, error: message }));
    onError?.(message);
  }, [onError]);

  const updateState = useCallback((updates: Partial<State>) => {
    setState(current => ({ ...current, ...updates }));
  }, []);

  const initializeExercises = useCallback(async () => {
    if (initialFetchDone.current || pendingUpdateRef.current) return;
    pendingUpdateRef.current = true;

    try {
      const [exercisesResponse, selectedResponse] = await Promise.all([
        fetchAllExercises(),
        getSelectedExercises()
      ]);
      // console.log("Fetched exercises:", exercisesResponse);

      // Access the 'data' directly since it's already typed correctly
      // console.log(exercisesResponse, "exercisesResponse:");
      updateState({
        allExercises: exercisesResponse,
        exercisesTypes: exercisesResponse, // Assuming exercisesTypes should be the same as allExercises
        selectedExercises: Array.isArray(selectedResponse) ? selectedResponse : [],
        loadingExercises: false
      });
      // console.log("allexercises:", exercises);

      initialFetchDone.current = true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize exercises';
      updateState({
        error: message,
        loadingExercises: false
      });
      onError?.(message);
    } finally {
      pendingUpdateRef.current = false;
    }
  }, [fetchAllExercises, getSelectedExercises, onError, updateState]);


  function parseExercises(response: any): Exercise[] {
    // Începem cu valoarea din response.data
    let exercises = response?.data || [];

    // Dacă, la final, nu obținem un array, înseamnă că structura nu este cea așteptată
    if (!Array.isArray(exercises)) {
      console.error('Structură neașteptată a datelor:', response);
      return [];
    }

    // Parcurgem array-ul pentru a construi obiectele de tip Exercise
    return exercises.map((item: any) => ({
      id: item.id,
      title: item.title,
      images: Array.isArray(item.images) ? item.images : [item.images],
      thumbnail: item.thumbnail?.uri || '',
      category: item.category,
      equipment: item.equipment,
      level: item.level,
      force: item.force,
      mechanic: item.mechanic,
      primaryMuscles: Array.isArray(item.primaryMuscles) ? item.primaryMuscles : [item.primaryMuscles],
      secondaryMuscles: Array.isArray(item.secondaryMuscles) ? item.secondaryMuscles : [item.secondaryMuscles],
      instructions: Array.isArray(item.instructions) ? item.instructions : [item.instructions],
      sets: item.sets || [],
      restTimer: item.restTimer
    }));
  }


  // Data Loading
  const loadInitialData = useCallback(async () => {
    if (initialFetchDone.current) return;

    try {
      updateState({ loadingExercises: true });

      const [exercisesResponse, selectedResponse] = await Promise.all([
        fetchAllExercises(),
        getSelectedExercises()
      ]);

      if (exercisesResponse === null || selectedResponse === null) {
        throw new Error("Failed to fetch exercises");
      }

      updateState({
        allExercises: exercisesResponse || [],
        exercisesTypes: exercisesResponse || [],
        selectedExercises: selectedResponse || [],
        loadingExercises: false
      });

      initialFetchDone.current = true;
    } catch (error) {
      handleError(error);
      updateState({ loadingExercises: false });
    }
  }, [fetchAllExercises, getSelectedExercises, handleError, updateState]);

  useEffect(() => {
    // console.log('Initializing exercises...');
    initializeExercises();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [initializeExercises]);

  // In ExerciseContext.tsx

  const applyFilters = useCallback((filters: ExerciseFilters = {}) => {
    setState(prev => {
      const allExercises = Array.isArray(prev.allExercises) ? prev.allExercises : [];

      // No filters? Reset to full list.
      if (!filters || Object.keys(filters).length === 0) {
        return { ...prev, exercisesTypes: allExercises };
      }

      const filtered = allExercises.filter(exercise =>
        Object.entries(filters).every(([key, filterValue]) => {
          // If no filter for a key, then pass this property.
          if (
            filterValue === undefined ||
            filterValue === null ||
            (Array.isArray(filterValue) && filterValue.length === 0)
          ) {
            return true;
          }

          let filterOptions: string[] =
            Array.isArray(filterValue)
              ? filterValue.map(opt => opt.toLowerCase())
              : [String(filterValue).toLowerCase()];

          // Special handling for muscle groups, if key is "muscleGroups"
          if (key === 'muscleGroups') {
            // Combine primaryMuscles and secondaryMuscles
            const primary = Array.isArray(exercise.primaryMuscles) ? exercise.primaryMuscles : [];
            const secondary = Array.isArray(exercise.secondaryMuscles) ? exercise.secondaryMuscles : [];
            const combinedMuscles = [...primary, ...secondary];
            return combinedMuscles
              .map(val => String(val).toLowerCase())
              .some(val => filterOptions.includes(val));
          } else {
            // General handling; if the exercise property is an array...
            const exerciseProp = exercise[key as keyof Exercise];
            if (Array.isArray(exerciseProp)) {
              return exerciseProp
                .map(val => String(val).toLowerCase())
                .some(val => filterOptions.includes(val));
            } else {
              return filterOptions.includes(String(exerciseProp || '').toLowerCase());
            }
          }
        })
      );

      return { ...prev, exercisesTypes: filtered };
    });
  }, []);




  // Selected Exercise Management
  const handleSelectedExercisesUpdate = useCallback(async (newSelectedExercises: Exercise[]) => {
    try {
      await saveSelectedExercises(newSelectedExercises);
      updateState({ selectedExercises: newSelectedExercises });
    } catch (error) {
      handleError(error);
    }
  }, [handleError, saveSelectedExercises, updateState]);

  const toggleExercise = useCallback(async (exercise: Exercise) => {
    if (!exercise?.id) return;

    const newSelectedExercises = state.selectedExercises.some(ex => ex.id === exercise.id)
      ? state.selectedExercises.filter(ex => ex.id !== exercise.id)
      : [...state.selectedExercises, { ...exercise, sets: [{ weight: '', reps: '' }] }];

    updateState({ selectedExercises: newSelectedExercises });
    await saveSelectedExercises(newSelectedExercises);
  }, [state.selectedExercises, updateState, saveSelectedExercises]);

  // Set Management
  const addSetToExercise = useCallback(async (exerciseId: string) => {
    setState(prev => {
      const newSelectedExercises = (prev.selectedExercises || []).map(ex =>
        ex.id === exerciseId
          ? { ...ex, sets: [...(ex.sets || []), { weight: '', reps: '' }] }
          : ex
      );

      handleSelectedExercisesUpdate(newSelectedExercises);
      return { ...prev, selectedExercises: newSelectedExercises };
    });
  }, [handleSelectedExercisesUpdate]);

  const removeSet = useCallback(async (exerciseId: string, setIndex: number) => {
    setState(prev => {
      const newSelectedExercises = (prev.selectedExercises || []).map(ex => {
        if (ex.id === exerciseId && Array.isArray(ex.sets)) {
          const newSets = [...ex.sets];
          newSets.splice(setIndex, 1);
          return {
            ...ex,
            sets: newSets.length ? newSets : [{ weight: '', reps: '' }]
          };
        }
        return ex;
      });

      handleSelectedExercisesUpdate(newSelectedExercises);
      return { ...prev, selectedExercises: newSelectedExercises };
    });
  }, [handleSelectedExercisesUpdate]);

  const updateSet = useCallback(async (
    exerciseId: string,
    setIndex: number,
    field: string,
    value: string
  ) => {
    setState(prev => {
      const newSelectedExercises = prev.selectedExercises.map(ex => {
        if (ex.id === exerciseId && Array.isArray(ex.sets)) {
          const newSets = [...ex.sets];
          if (newSets[setIndex]) {
            newSets[setIndex] = { ...newSets[setIndex], [field]: value };
          }
          return { ...ex, sets: newSets };
        }
        return ex;
      });

      handleSelectedExercisesUpdate(newSelectedExercises);
      return { ...prev, selectedExercises: newSelectedExercises };
    });
  }, [handleSelectedExercisesUpdate]);

  const clearSelectedExercises = useCallback(async () => {
    try {
      await saveSelectedExercises([]);
      updateState({ selectedExercises: [] });
    } catch (error) {
      handleError(error);
    }
  }, [handleError, saveSelectedExercises, updateState]);

  const value = {
    ...state,
    loadingExercises: state.loadingExercises || serviceLoading,
    setSelectedExercises: handleSelectedExercisesUpdate,
    applyFilters,
    fetchExerciseDetails,
    toggleExercise,
    clearSelectedExercises,
    addSetToExercise,
    removeSet,
    updateSet
  };

  return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>;
};

export const useExercises = (): ExerciseContextType => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercises must be used within an ExerciseProvider');
  }
  return context;
};