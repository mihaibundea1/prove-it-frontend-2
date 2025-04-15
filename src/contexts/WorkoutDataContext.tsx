import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Workout, ScheduledWorkout, CompletedWorkout } from '@/services/api/endpoints/workout/types/workout.types';
import { useWorkoutService } from '@/services/api/endpoints/workout/hooks/useWorkoutService';
import { useAuth } from '@clerk/clerk-expo';
import { useUserContext } from './UserContext';

export interface allUserWorkouts {
  saved: Workout[] | null;
  scheduled: ScheduledWorkout[] | null;
  completed: CompletedWorkout[] | null;
}

interface WorkoutDataContextType {
  allUserWorkouts: allUserWorkouts;
  refreshWorkouts: () => Promise<void>;
  isRefreshing: boolean;
  updateSavedWorkout: (workout: Workout) => void;
  updateScheduledWorkout: (workout: ScheduledWorkout) => void;
  updateCompletedWorkout: (workout: CompletedWorkout) => void;
  addSavedWorkout: (workout: Workout) => void;
  addScheduledWorkout: (workout: ScheduledWorkout) => void;
  addCompletedWorkout: (workout: CompletedWorkout) => void;
  deleteSavedWorkout: (workoutId: string) => void;
  deleteScheduledWorkout: (workoutId: string) => void;
  deleteCompletedWorkout: (workoutId: string) => void;
}

const WorkoutDataContext = createContext<WorkoutDataContextType | undefined>(undefined);

export const WorkoutDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId: clerkUserId } = useAuth();
  const { user } = useUserContext();
  const [allUserWorkouts, setUserWorkouts] = useState<allUserWorkouts>({
    saved: null,
    scheduled: null,
    completed: null,
  });
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const { getScheduledWorkouts, getSavedWorkouts, getCompletedWorkouts } = useWorkoutService();

  const fetchWorkouts = useCallback(async () => {
    if (!clerkUserId || !user?._id) {
      return;
    }

    setIsRefreshing(true);
    try {
      console.log("Fetching workouts for user:", user._id);

      // Fetch all workouts
      const [scheduled, saved, completed] = await Promise.all([
        getScheduledWorkouts(user._id),
        getSavedWorkouts(user._id),
        getCompletedWorkouts(user._id),
      ]);

      // Update allUserWorkouts state
      setUserWorkouts({ scheduled, saved, completed });

    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setIsRefreshing(false);
      setLastRefresh(Date.now());
    }
  }, [clerkUserId, user?._id]);

  // Initial fetch on mount or when user changes
  useEffect(() => {
    if (clerkUserId && user?._id) {
      fetchWorkouts();
    }
  }, [clerkUserId, user?._id]);

  // Public refresh function with debounce protection
  const refreshWorkouts = useCallback(async () => {
    const now = Date.now();
    if (isRefreshing || (now - lastRefresh < 2000)) {
      console.log("Skipping refresh - already refreshing or refreshed recently");
      return;
    }
    await fetchWorkouts();
  }, [fetchWorkouts, isRefreshing, lastRefresh]);

  // Update functions for each workout type
  const updateSavedWorkout = useCallback((updatedWorkout: Workout) => {
    setUserWorkouts(prev => {
      if (!prev.saved) return prev;
      
      const updatedWorkouts = prev.saved.map(workout => 
        workout._id === updatedWorkout._id ? updatedWorkout : workout
      );
      
      return { ...prev, saved: updatedWorkouts };
    });
  }, []);
  
  const updateScheduledWorkout = useCallback((updatedWorkout: ScheduledWorkout) => {
    setUserWorkouts(prev => {
      if (!prev.scheduled) return prev;
      
      const updatedWorkouts = prev.scheduled.map(workout => 
        workout._id === updatedWorkout._id ? updatedWorkout : workout
      );
      
      return { ...prev, scheduled: updatedWorkouts };
    });
  }, []);
  
  const updateCompletedWorkout = useCallback((updatedWorkout: CompletedWorkout) => {
    setUserWorkouts(prev => {
      if (!prev.completed) return prev;
      
      const updatedWorkouts = prev.completed.map(workout => 
        workout._id === updatedWorkout._id ? updatedWorkout : workout
      );
      
      return { ...prev, completed: updatedWorkouts };
    });
  }, []);

  // Add functions for each workout type
  const addSavedWorkout = useCallback((newWorkout: Workout) => {
    setUserWorkouts(prev => {
      const currentWorkouts = prev.saved || [];
      return { ...prev, saved: [...currentWorkouts, newWorkout] };
    });
  }, []);
  
  const addScheduledWorkout = useCallback((newWorkout: ScheduledWorkout) => {
    setUserWorkouts(prev => {
      const currentWorkouts = prev.scheduled || [];
      return { ...prev, scheduled: [...currentWorkouts, newWorkout] };
    });
  }, []);
  
  const addCompletedWorkout = useCallback((newWorkout: CompletedWorkout) => {
    setUserWorkouts(prev => {
      const currentWorkouts = prev.completed || [];
      return { ...prev, completed: [...currentWorkouts, newWorkout] };
    });
  }, []);

  // Delete functions for each workout type
  const deleteSavedWorkout = useCallback((workoutId: string) => {
    setUserWorkouts(prev => {
      if (!prev.saved) return prev;
      
      const filteredWorkouts = prev.saved.filter(workout => workout._id !== workoutId);
      return { ...prev, saved: filteredWorkouts };
    });
  }, []);
  
  const deleteScheduledWorkout = useCallback((workoutId: string) => {
    setUserWorkouts(prev => {
      if (!prev.scheduled) return prev;
      
      const filteredWorkouts = prev.scheduled.filter(workout => workout._id !== workoutId);
      return { ...prev, scheduled: filteredWorkouts };
    });
  }, []);
  
  const deleteCompletedWorkout = useCallback((workoutId: string) => {
    setUserWorkouts(prev => {
      if (!prev.completed) return prev;
      
      const filteredWorkouts = prev.completed.filter(workout => workout._id !== workoutId);
      return { ...prev, completed: filteredWorkouts };
    });
  }, []);

  return (
    <WorkoutDataContext.Provider value={{ 
      allUserWorkouts, 
      refreshWorkouts, 
      isRefreshing,
      updateSavedWorkout,
      updateScheduledWorkout,
      updateCompletedWorkout,
      addSavedWorkout,
      addScheduledWorkout,
      addCompletedWorkout,
      deleteSavedWorkout,
      deleteScheduledWorkout,
      deleteCompletedWorkout
    }}>
      {children}
    </WorkoutDataContext.Provider>
  );
};

export const useWorkoutData = () => {
  const context = useContext(WorkoutDataContext);
  if (!context) {
    throw new Error('useWorkoutData must be used within a WorkoutDataProvider');
  }
  return context;
};