import React, { createContext, useContext, useState, useRef, useMemo, ReactNode, useCallback, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, AppState } from 'react-native';
import { Workout, CompletedWorkout, Exercise, Set } from '@/services/api/endpoints/workout/types/workout.types';
import { useWorkoutService } from '@/services/api/endpoints/workout/hooks/useWorkoutService';
import { useUserContext } from '@/contexts/UserContext';

interface WorkoutContextValue {
  activeWorkout: Workout | null;
  isWorkoutActive: boolean;
  currentDuration: number;
  startWorkout: (routineId: string, routineName: string, exercises: Exercise[]) => Promise<void>;
  pauseWorkout: () => Promise<void>;
  resumeWorkout: () => Promise<void>;
  endWorkout: (save: boolean) => Promise<CompletedWorkout | null>;
  discardWorkout: () => Promise<void>;
  formatDuration: (seconds: number) => string;
  addSetToExercise: (exerciseId: string, set: Set) => Promise<void>;
  updateExercise: (exerciseId: string, updatedExercise: Partial<Exercise>) => Promise<void>;
  getTotalVolume: () => number;
  getTotalSets: () => number;
  syncTimerWithBackground: () => void;
  addExercisesToWorkout: (exercises: Exercise[]) => void;
  updateWorkout: (updatedWorkout: Workout) => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);
const WORKOUT_NOTIFICATION_ID = 'workout-notification';

// Configure notifications
(Notifications as any).setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  const startTimeRef = useRef<Date | null>(null);
  const lastUpdateTimeRef = useRef<Date | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);
  const { createCompletedWorkout, updateSavedWorkout } = useWorkoutService();
  const notificationUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  // Load any existing workout on app start
  useEffect(() => {
    const loadExistingWorkout = async () => {
      try {
        const savedWorkoutJson = await AsyncStorage.getItem('activeWorkout');
        if (savedWorkoutJson) {
          const savedWorkout = JSON.parse(savedWorkoutJson);
          const workoutStartTime = savedWorkout.workoutStartTime
            ? new Date(savedWorkout.workoutStartTime)
            : new Date();

          startTimeRef.current = workoutStartTime;
          setActiveWorkout(savedWorkout);

          // Calculate elapsed time
          const elapsedSeconds = Math.floor((new Date().getTime() - workoutStartTime.getTime()) / 1000);
          setCurrentDuration(elapsedSeconds);

          // Resume workout if it wasn't paused
          if (!savedWorkout.isPaused) {
            setIsWorkoutActive(true);
            startRealTimeTimer();
            updateNotificationWithWorkoutStatus(savedWorkout.routineName, elapsedSeconds, false);
          } else {
            setIsWorkoutActive(false);
            updateNotificationWithWorkoutStatus(savedWorkout.routineName, elapsedSeconds, true);
          }
        }
      } catch (error) {
        console.error('Error loading workout:', error);
      }
    };

    loadExistingWorkout();

    // Set up app state change listener
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        syncTimerWithBackground();
      } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App has gone to the background
        lastUpdateTimeRef.current = new Date();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      if (timerInterval.current) clearInterval(timerInterval.current);
      if (notificationUpdateInterval.current) clearInterval(notificationUpdateInterval.current);
    };
  }, []);

  const addExercisesToWorkout = useCallback((exercises: Exercise[]) => {
    if (!activeWorkout) return;
  
    // Creează o listă actualizată de exerciții
    const updatedExercises = [...activeWorkout.exercises, ...exercises];
  
    // Actualizează workout-ul activ
    const updatedWorkout: Workout = {
      ...activeWorkout,
      exercises: updatedExercises,
      updated_at: new Date().toISOString(), // Actualizează timestamp-ul
    };
  
    // Actualizează starea și AsyncStorage
    setActiveWorkout(updatedWorkout);
    AsyncStorage.setItem('activeWorkout', JSON.stringify(updatedWorkout)); // Salvează în AsyncStorage
  }, [activeWorkout]);

  const removeExerciseFromWorkout = (exerciseId: string) => {
    if (!activeWorkout) return;
    
    setActiveWorkout(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.filter(ex => ex.exercise_id !== exerciseId)
      };
    });
  };

  // Timer that runs in real-time
  const startRealTimeTimer = useCallback(() => {
    if (timerInterval.current) clearInterval(timerInterval.current);

    // Real-time timer to update the UI
    const interval = setInterval(() => {
      if (startTimeRef.current) {
        const now = new Date();
        const elapsedSeconds = Math.floor((now.getTime() - startTimeRef.current.getTime()) / 1000);
        setCurrentDuration(elapsedSeconds);
      } else {
        setCurrentDuration(prev => prev + 1);
      }
    }, 1000);

    timerInterval.current = interval;
  }, []);

  // Start notification timer updates
  const startNotificationTimer = useCallback((routineName: string) => {
    if (notificationUpdateInterval.current) clearInterval(notificationUpdateInterval.current);

    // Only update notification every 15 seconds to reduce system load
    const interval = setInterval(() => {
      if (isWorkoutActive && startTimeRef.current) {
        const now = new Date();
        const elapsedSeconds = Math.floor((now.getTime() - startTimeRef.current.getTime()) / 1000);
        updateNotificationWithWorkoutStatus(routineName, elapsedSeconds, false);
      }
    }, 15000); // Update every 15 seconds

    notificationUpdateInterval.current = interval;
  }, [isWorkoutActive]);

  // Stop all timers
  const stopTimer = useCallback(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    if (notificationUpdateInterval.current) {
      clearInterval(notificationUpdateInterval.current);
      notificationUpdateInterval.current = null;
    }
  }, []);

  // Reset timers and duration
  const resetTimer = useCallback(() => {
    setCurrentDuration(0);
    startTimeRef.current = null;
    lastUpdateTimeRef.current = null;
    stopTimer();
  }, [stopTimer]);

  // Format duration for display
  const formatDuration = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Update notification with current workout status
  const updateNotificationWithWorkoutStatus = useCallback(async (
    routineName: string,
    duration: number = 0,
    isPaused: boolean = false
  ) => {
    try {
      const formattedTime = formatDuration(duration);
      const title = isPaused ? 'Workout Paused' : 'Workout in Progress';
      const body = `${routineName} - Time: ${formattedTime}`;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sticky: true,
          autoDismiss: false,
          data: { workoutId: activeWorkout?._id },
        },
        trigger: null,
        identifier: WORKOUT_NOTIFICATION_ID
      });
    } catch (error) {
      console.error('Failed to update notification:', error);
    }
  }, [activeWorkout, formatDuration]);

  // Sync timer with actual elapsed time after background
  const syncTimerWithBackground = useCallback(() => {
    if (isWorkoutActive && startTimeRef.current) {
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - startTimeRef.current.getTime()) / 1000);
      setCurrentDuration(elapsedSeconds);

      if (activeWorkout) {
        updateNotificationWithWorkoutStatus(activeWorkout.routineName, elapsedSeconds, false);
      }
    }
  }, [isWorkoutActive, activeWorkout, updateNotificationWithWorkoutStatus]);

  // Calculate workout stats
  const getTotalVolume = useCallback(() => {
    if (!activeWorkout) return 0;
    return activeWorkout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((exerciseTotal, set) => {
        return exerciseTotal + (set.weight * set.reps);
      }, 0);
    }, 0);
  }, [activeWorkout]);

  const getTotalSets = useCallback(() => {
    if (!activeWorkout) return 0;
    return activeWorkout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.length;
    }, 0);
  }, [activeWorkout]);

  // Start a new workout
  const startWorkout = useCallback(async (
    savedWorkoutId: string,
    routineName: string,
    exercises: Exercise[]
  ) => {
    try {
      console.log("Starting new workout:", { savedWorkoutId, routineName });

      // Create new workout object
      const startTime = new Date();
      startTimeRef.current = startTime;

      const newWorkout: Workout = {
        _id: savedWorkoutId,
        user_id: user?._id || '',
        routineName,
        exercises,
        created_at: startTime.toISOString(),
        updated_at: startTime.toISOString(),
        volume: 0,
        sets: 0,
        workoutStartTime: startTime.toISOString(), // Add start time for background tracking
      };

      // Update state and persist
      setActiveWorkout(newWorkout);
      setIsWorkoutActive(true);
      setCurrentDuration(0);

      // Start timers
      startRealTimeTimer();
      startNotificationTimer(routineName);

      // Save to AsyncStorage
      await AsyncStorage.setItem('activeWorkout', JSON.stringify(newWorkout));

      // Initial notification
      await updateNotificationWithWorkoutStatus(routineName, 0, false);

    } catch (error) {
      console.error('Error starting workout:', error);
    }
  }, [
    user,
    startRealTimeTimer,
    startNotificationTimer,
    updateNotificationWithWorkoutStatus
  ]);

  // End the current workout
  const endWorkout = useCallback(async (save: boolean): Promise<CompletedWorkout | null> => {
    if (!activeWorkout) return null;

    try {
      // Stop all timers
      stopTimer();

      let completedWorkout: CompletedWorkout | null = null;
      if (save) {
        const endTime = new Date();
        const startTime = startTimeRef.current || new Date(activeWorkout.created_at);
        const finalDuration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

        completedWorkout = {
          ...activeWorkout,
          saved_workout_id: activeWorkout._id!,
          start_date_time: startTime.toISOString(),
          end_date_time: endTime.toISOString(),
          duration: finalDuration,
          volume: getTotalVolume(),
          sets: getTotalSets()
        };

        console.log('Saving completed workout:', completedWorkout);

        try {
          // Upload to server
          const uploadedWorkout = await createCompletedWorkout(completedWorkout);
          console.log('Workout uploaded successfully:', uploadedWorkout);
          completedWorkout = uploadedWorkout;
        } catch (error) {
          console.error('Failed to upload workout:', error);
        }
      }

      // Clean up workout state
      setActiveWorkout(null);
      setIsWorkoutActive(false);
      resetTimer();

      // Remove from storage and dismiss notifications
      await AsyncStorage.removeItem('activeWorkout');
      await Notifications.dismissAllNotificationsAsync();

      return completedWorkout;
    } catch (error) {
      console.error('Error ending workout:', error);
      return null;
    }
  }, [
    activeWorkout,
    stopTimer,
    getTotalVolume,
    getTotalSets,
    resetTimer
  ]);

  const updateWorkout = useCallback(async (updatedWorkout: Workout): Promise<void> => {
    // Update the active workout state
    setActiveWorkout(updatedWorkout);
  
    // Persist to AsyncStorage
    await AsyncStorage.setItem('activeWorkout', JSON.stringify(updatedWorkout));
  
    // If workout has an ID, update on the server
    if (updatedWorkout._id) {
      try {
        await updateSavedWorkout(updatedWorkout._id, {
          routineName: updatedWorkout.routineName,
          exercises: updatedWorkout.exercises,
        });
      } catch (error) {
        console.error('Error updating saved workout:', error);
      }
    }
  }, [updateSavedWorkout]);
  
  // Pause the current workout
  const pauseWorkout = useCallback(async () => {
    if (!activeWorkout) return;

    stopTimer(); // Clear all intervals
    setIsWorkoutActive(false);

    try {

      // Update AsyncStorage with paused state
      await AsyncStorage.setItem(
        'activeWorkout',
        JSON.stringify({
          ...activeWorkout,
          isPaused: true,
          updated_at: new Date().toISOString(),
        })
      );

      // Update notification to show paused status
      await updateNotificationWithWorkoutStatus(
        activeWorkout.routineName,
        currentDuration,
        true
      );
    } catch (error) {
      console.error('Error pausing workout:', error);
    }
  }, [activeWorkout, stopTimer, currentDuration, updateNotificationWithWorkoutStatus]);

  // Resume the paused workout
  const resumeWorkout = useCallback(async () => {
    if (!activeWorkout) return;

    try {
      // If we have a start time reference, adjust it to account for pause time
      if (startTimeRef.current) {
        const now = new Date();
        const elapsedSoFar = currentDuration;
        // Recalculate start time to ensure consistent timing
        startTimeRef.current = new Date(now.getTime() - (elapsedSoFar * 1000));
      } else {
        // If no start time (shouldn't happen), set one now
        startTimeRef.current = new Date(Date.now() - (currentDuration * 1000));
      }

      // Start timers
      startRealTimeTimer();
      startNotificationTimer(activeWorkout.routineName);
      setIsWorkoutActive(true);

      // Update AsyncStorage
      await AsyncStorage.setItem(
        'activeWorkout',
        JSON.stringify({
          ...activeWorkout,
          isPaused: false,
          updated_at: new Date().toISOString(),
          workoutStartTime: startTimeRef.current.toISOString(),
        })
      );

      // Update notification
      await updateNotificationWithWorkoutStatus(
        activeWorkout.routineName,
        currentDuration,
        false
      );
    } catch (error) {
      console.error('Error resuming workout:', error);
    }
  }, [
    activeWorkout,
    currentDuration,
    startRealTimeTimer,
    startNotificationTimer,
    updateNotificationWithWorkoutStatus
  ]);

  // Update an exercise in the workout
  const updateExercise = useCallback(
    async (exerciseId: string, updatedExercise: Partial<Exercise>) => {
      if (!activeWorkout) return;

      try {
        // Find and update the exercise
        const updatedExercises = activeWorkout.exercises.map((exercise) =>
          exercise.exercise_id === exerciseId
            ? { ...exercise, ...updatedExercise } // Merge updates
            : exercise
        );

        // Create the updated workout
        // Create the updated workout
        const updatedWorkout: Workout = {
          ...activeWorkout,
          exercises: updatedExercises,
          updated_at: new Date().toISOString(),
        };

        // Update state and AsyncStorage
        setActiveWorkout(updatedWorkout);
        await AsyncStorage.setItem('activeWorkout', JSON.stringify(updatedWorkout));
      } catch (error) {
        console.error('Error updating exercise:', error);
      }
    },
    [activeWorkout]
  );

  const addSetToExercise = useCallback(async (exerciseId: string, set: Set) => {
    if (!activeWorkout) return;

    const updatedExercises = activeWorkout.exercises.map(exercise => {
      if (exercise.exercise_id === exerciseId) {
        return { ...exercise, sets: [...exercise.sets, set] };
      }
      return exercise;
    });

    const updatedWorkout: Workout = {
      ...activeWorkout,
      exercises: updatedExercises,
      updated_at: new Date().toISOString()
    };

    setActiveWorkout(updatedWorkout);
    await AsyncStorage.setItem('activeWorkout', JSON.stringify(updatedWorkout));
  }, [activeWorkout]);

  

  const discardWorkout = useCallback(async () => {
    // 1. Stop all timers
    stopTimer();  
  
    // 2. Dismiss any active notifications
    await Notifications.dismissAllNotificationsAsync();
    
    // 3. Reset state completely
    setActiveWorkout(null);
    setIsWorkoutActive(false);
    
    // 4. Reset timer and related refs
    resetTimer();
    
    // 5. Clear AsyncStorage
    await AsyncStorage.removeItem('activeWorkout');
  }, [stopTimer, resetTimer]);


  const contextValue = useMemo(() => ({
    activeWorkout,
    isWorkoutActive,
    currentDuration,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    endWorkout,
    discardWorkout,
    formatDuration,
    addSetToExercise,
    updateExercise,
    getTotalVolume,
    getTotalSets,
    syncTimerWithBackground,
    addExercisesToWorkout,
    removeExerciseFromWorkout,
    updateWorkout,
  }), [
    activeWorkout,
    isWorkoutActive,
    currentDuration,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    endWorkout,
    discardWorkout,
    formatDuration,
    addSetToExercise,
    updateExercise,
    getTotalVolume,
    getTotalSets,
    syncTimerWithBackground,
    addExercisesToWorkout, 
    removeExerciseFromWorkout,
    updateWorkout,
  ]);

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error('useWorkout must be used within a WorkoutProvider');
  return context;
};