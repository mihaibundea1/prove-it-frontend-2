// services/api/endpoints/workout/hooks/useWorkoutService.ts
import { useRef, useState, useEffect, useCallback } from 'react';
import { WorkoutService } from '../WorkoutService';
import { WorkoutState, WorkoutContextState } from '../types/workout.types';
import { useAuth } from '@clerk/clerk-expo';

export const useWorkoutService = () => {
  const { getToken } = useAuth();
  const serviceRef = useRef(new WorkoutService(getToken));
  const [state, setState] = useState<WorkoutContextState>({
    activeWorkout: null,
    duration: 0,
    volume: 0,
    sets: 0,
    isWorkoutActive: false,
  });

  useEffect(() => {
    loadWorkoutState();
    return () => {
      serviceRef.current.dismissAllNotifications();
    };
  }, []);

  const calculateElapsedTime = useCallback((workout: WorkoutState | null): number => {
    if (!workout?.startTime) return 0;
    
    const currentTime = new Date();
    const startTime = new Date(workout.startTime);
    return Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
  }, []);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.activeWorkout && !state.activeWorkout.pauseTime) {
      interval = setInterval(() => {
        const elapsedTime = calculateElapsedTime(state.activeWorkout);
        updateWorkoutState({ duration: elapsedTime });
        updateNotification(elapsedTime);
      }, 1000);
    }
  
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.activeWorkout, calculateElapsedTime]);

  const loadWorkoutState = async (): Promise<void> => {
    const workout = await serviceRef.current.loadWorkoutState();
    if (workout) {
      const currentTime = new Date();
      const elapsedTime = Math.floor(
        (currentTime.getTime() - new Date(workout.startTime).getTime()) / 1000
      );
      setState(prev => ({
        ...prev,
        activeWorkout: workout,
        duration: elapsedTime,
        isWorkoutActive: true,
      }));
      updateNotification(elapsedTime);
    }
  };

  const updateWorkoutState = (updates: Partial<WorkoutContextState>): void => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const updateNotification = async (time: number, isPaused = false): Promise<void> => {
    await serviceRef.current.showNotification({
      title: isPaused ? 'Workout Paused' : 'Workout in Progress',
      body: `Duration: ${serviceRef.current.formatDuration(time)}`,
    });
  };

  const startWorkout = async (): Promise<void> => {
    const newWorkout: WorkoutState = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      exercises: [],
    };

    await serviceRef.current.saveWorkoutState(newWorkout);
    updateWorkoutState({
      activeWorkout: newWorkout,
      isWorkoutActive: true,
    });
    await updateNotification(0);
  };

  const pauseWorkout = async (): Promise<void> => {
    if (state.activeWorkout) {
      const updatedWorkout = {
        ...state.activeWorkout,
        pauseTime: new Date().toISOString(),
      };
      await serviceRef.current.saveWorkoutState(updatedWorkout);
      updateWorkoutState({ activeWorkout: updatedWorkout });
      await updateNotification(state.duration, true);
    }
  };

  const resumeWorkout = async (): Promise<void> => {
    if (state.activeWorkout) {
      const updatedWorkout = {
        ...state.activeWorkout,
        startTime: new Date(new Date().getTime() - state.duration * 1000).toISOString(),
        pauseTime: null,
      };
      await serviceRef.current.saveWorkoutState(updatedWorkout);
      updateWorkoutState({ activeWorkout: updatedWorkout });
      await updateNotification(state.duration);
    }
  };

  const endWorkout = async (): Promise<void> => {
    await serviceRef.current.clearWorkoutState();
    setState({
      activeWorkout: null,
      duration: 0,
      volume: 0,
      sets: 0,
      isWorkoutActive: false,
    });
  };

  return {
    ...state,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    endWorkout,
    formatDuration: serviceRef.current.formatDuration,
    setVolume: (volume: number) => updateWorkoutState({ volume }),
    setSets: (sets: number) => updateWorkoutState({ sets }),
  };
};