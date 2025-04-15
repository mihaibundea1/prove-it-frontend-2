// src/types/workout.types.ts
import type { Exercise } from "./exercise.types";
export interface Workout {
    id: string;
    name: string;
    startTime: string;
    pauseTime?: string;
    exercises: Exercise[]; 
}

export interface WorkoutContextState {
    activeWorkout: Workout | null;
    duration: number;
    volume: number;
    sets: number;
    isWorkoutActive: boolean;
}

export interface WorkoutContextValue extends WorkoutContextState {
    startWorkout: () => Promise<void>;
    pauseWorkout: () => Promise<void>;
    resumeWorkout: () => Promise<void>;
    endWorkout: () => Promise<void>;
    formatDuration: (seconds: number) => string;
    setVolume: (volume: number) => void;
    setSets: (sets: number) => void;
}
