import { useState, useRef } from "react";
import { WorkoutService } from "../WorkoutService";
import { useAuth } from "@clerk/clerk-expo";
import {
  Workout,
  UserWorkouts,
  CompletedWorkout,
  ScheduledWorkout,
  PredefinedWorkout,
} from "../types/workout.types";
import { ApiResponse } from "@/types/api.types";

export const useWorkoutService = () => {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const serviceRef = useRef(new WorkoutService(getToken));

  const handleWorkoutOperation = async <T>(
    operation: () => Promise<ApiResponse<T>>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await operation();
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data || null;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to perform operation";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkoutOperationWithSave = async <T>(
    operation: () => Promise<ApiResponse<T>>,
    setState: (data: T) => void
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await operation();
      if (response.error) {
        setError(response.error);
        return null;
      }
      if (response.data) {
        setState(response.data); // Set data directly to context
      }
      return response.data || null;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to perform operation"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getCompletedWorkouts = async (userId: string) => {
    return handleWorkoutOperation<CompletedWorkout[]>(() =>
      serviceRef.current.getCompletedWorkouts(userId)
    );
  };

  const getScheduledWorkouts = async (userId: string) => {
    return handleWorkoutOperation<ScheduledWorkout[]>(() =>
      serviceRef.current.getScheduledWorkouts(userId)
    );
  };

  const getSavedWorkouts = async (userId: string) => {
    return handleWorkoutOperation<Workout[]>(() =>
      serviceRef.current.getSavedWorkouts(userId)
    );
  };

  // ==================== Saved Workouts ====================
  const createSavedWorkout = async (
    workoutData: Omit<Workout, "_id" | "created_at" | "updated_at">
  ) => {
    return handleWorkoutOperation<Workout>(() =>
      serviceRef.current.createSavedWorkout(workoutData)
    );
  };

  const getSavedWorkoutById = async (workoutId: string) => {
    return handleWorkoutOperation<Workout>(() =>
      serviceRef.current.getSavedWorkoutById(workoutId)
    );
  };

  const updateSavedWorkout = async (
    workoutId: string,
    updates: Partial<Workout>
  ) => {
    return handleWorkoutOperation<Workout>(() =>
      serviceRef.current.updateSavedWorkout(workoutId, updates)
    );
  };

  const deleteSavedWorkout = async (workoutId: string) => {
    return handleWorkoutOperation<void>(() =>
      serviceRef.current.deleteSavedWorkout(workoutId)
    );
  };

  // ==================== Scheduled Workouts ====================

  const createScheduledWorkout = async (workoutData: ScheduledWorkout) => {
    const { _id, created_at, updated_at, ...sanitizedWorkoutData } =
      workoutData as ScheduledWorkout;
    return handleWorkoutOperation<ScheduledWorkout>(() =>
      serviceRef.current.createScheduledWorkout(sanitizedWorkoutData)
    );
  };

  const getScheduledWorkoutById = async (workoutId: string) => {
    return handleWorkoutOperation<ScheduledWorkout>(() =>
      serviceRef.current.getScheduledWorkoutById(workoutId)
    );
  };

  const updateScheduledWorkout = async (
    workoutId: string,
    updates: Partial<ScheduledWorkout>
  ) => {
    return handleWorkoutOperation<ScheduledWorkout>(() =>
      serviceRef.current.updateScheduledWorkout(workoutId, updates)
    );
  };

  const deleteScheduledWorkout = async (workoutId: string) => {
    return handleWorkoutOperation<void>(() =>
      serviceRef.current.deleteScheduledWorkout(workoutId)
    );
  };

  // ==================== Completed Workouts ====================

  const createCompletedWorkout = async (
    workoutData: Omit<CompletedWorkout, "_id" | "created_at" | "updated_at">
  ) => {
    return handleWorkoutOperation<CompletedWorkout>(() =>
      serviceRef.current.createCompletedWorkout(workoutData)
    );
  };

  const getCompletedWorkoutById = async (workoutId: string) => {
    return handleWorkoutOperation<CompletedWorkout>(() =>
      serviceRef.current.getCompletedWorkoutById(workoutId)
    );
  };

  const updateCompletedWorkout = async (
    workoutId: string,
    updates: Partial<CompletedWorkout>
  ) => {
    return handleWorkoutOperation<CompletedWorkout>(() =>
      serviceRef.current.updateCompletedWorkout(workoutId, updates)
    );
  };

  const deleteCompletedWorkout = async (workoutId: string) => {
    return handleWorkoutOperation<void>(() =>
      serviceRef.current.deleteCompletedWorkout(workoutId)
    );
  };

  const getPredefinedWorkouts = async () => {
    return handleWorkoutOperation<PredefinedWorkout[]>(() =>
      serviceRef.current.getPredefinedWorkouts().then(response => ({
        ...response,
        data: response.data ? [response.data] : null,
      }))
    );
  };

  // ==================== Return All Methods ====================

  return {
    isLoading,
    error,
    // Saved Workouts
    createSavedWorkout,
    getSavedWorkouts,
    getSavedWorkoutById,
    updateSavedWorkout,
    deleteSavedWorkout,
    // Scheduled Workouts
    createScheduledWorkout,
    getScheduledWorkouts,
    getScheduledWorkoutById,
    updateScheduledWorkout,
    deleteScheduledWorkout,
    // Completed Workouts
    createCompletedWorkout,
    getCompletedWorkouts,
    getCompletedWorkoutById,
    updateCompletedWorkout,
    deleteCompletedWorkout,

    // Predefined Workouts
    getPredefinedWorkouts,
  };
};
