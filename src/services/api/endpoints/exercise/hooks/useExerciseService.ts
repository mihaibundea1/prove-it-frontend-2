// services/api/endpoints/exercise/hooks/useExerciseService.tsx
import { useRef, useState, useCallback } from 'react';
import { ExerciseService } from '../ExerciseService';
import { Exercise, ExerciseSet } from '../types/exercise.types';
import { ApiResponse } from '../../../core/types/api.types';
import { useAuth } from '@clerk/clerk-expo';

export const useExerciseService = () => {
  const { getToken } = useAuth();
  const serviceRef = useRef(new ExerciseService(getToken));
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseDetails, setExerciseDetails] = useState<Record<string, Exercise>>({});

  const fetchAllExercises = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await serviceRef.current.fetchAllExercises();
      if (response.data) {
        setExercises(response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchExerciseDetails = async (exerciseId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await serviceRef.current.fetchExerciseDetails(exerciseId);
      if (response.data) { 
        setExerciseDetails(prev => ({
          ...prev,
          [exerciseId]: response.data as Exercise
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleExercise = useCallback((exercise: Exercise) => {
    setSelectedExercises(prev => {
      const isSelected = prev.some(ex => ex.id === exercise.id);
      if (isSelected) {
        return prev.filter(ex => ex.id !== exercise.id);
      }
      return [...prev, { ...exercise, sets: [{ weight: '', reps: '' }] }];
    });
  }, []);

  const addSetToExercise = useCallback((exerciseId: string) => {
    setSelectedExercises(prev =>
      prev.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: [...(ex.sets || []), { weight: '', reps: '' }]
          };
        }
        return ex;
      })
    );
  }, []);

  const removeSet = useCallback((exerciseId: string, setIndex: number) => {
    setSelectedExercises(prev =>
      prev.map(ex => {
        if (ex.id === exerciseId && Array.isArray(ex.sets)) {
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
    field: keyof ExerciseSet, 
    value: string | number
  ) => {
    setSelectedExercises(prev =>
      prev.map(ex => {
        if (ex.id === exerciseId && Array.isArray(ex.sets)) {
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

  return {
    loading,
    exercises,
    selectedExercises,
    exerciseDetails,
    fetchAllExercises,
    fetchExerciseDetails,
    toggleExercise,
    addSetToExercise,
    removeSet,
    updateSet,
  };
};