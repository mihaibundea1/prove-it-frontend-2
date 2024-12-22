// src/types/workout.types.ts
export interface Workout {
    id: string;
    startTime: string;
    pauseTime?: string;
    exercises: Array<any>; // Define Exercise type based on your needs
    name: string;
    createdAt: string;
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
