// services/api/endpoints/workout/types/workout.types.ts
export interface Exercise {
    id: string;
    name: string;
    sets: Array<{
      weight: number;
      reps: number;
    }>;
  }
  
  export interface WorkoutState {
    id: string;
    startTime: string;
    pauseTime?: string | null;
    exercises: Exercise[];
  }
  
  export interface WorkoutNotification {
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }
  
  export interface WorkoutContextState {
    activeWorkout: WorkoutState | null;
    duration: number;
    volume: number;
    sets: number;
    isWorkoutActive: boolean;
  }
  
  export interface WorkoutApiResponse {
    success: boolean;
    data?: WorkoutState;
    error?: string;
  }