// Helper type for MongoDB ObjectId
export type ObjectId = {
  $oid: string;
};

// Model for a set within an exercise
export interface Set {
  weight: number; // Weight used in kg/lbs
  reps: number;   // Number of repetitions
}

// Model for an exercise within a workout
export interface Exercise {
  exercise_id: string;       // Unique identifier for the exercise
  exercise_name: string;     // Name of the exercise
  sets: Set[];               // List of sets
  restTimer?: number;        // Rest time in seconds (0 if OFF)
  order: number;             // Order of the exercise within the workout
}

// Base model for a workout
export interface Workout {
  _id?: string ;               // string for ObjectID (optional for new entries)
  user_id?: string;           // User identifier
  routineName: string;       // Workout name or routine title
  exercises: Exercise[];     // List of exercises in the workout
  notes?: string;            // Additional notes about the workout
  created_at: string;        // ISO date string (timestamp when the workout was created)
  updated_at: string;        // ISO date string (timestamp when the workout was last updated)
  volume?: number;           // Total volume lifted (weight * reps * sets)
  sets?: number;             // Total number of sets performed
  muscleGroups?: string[]; // Optional as it might come from different sources
  workoutStartTime?: string; // Optional as it might come from different sources
  workoutEndTime?: string; // Optional as it might come from different sources
  workoutDuration?: number;         // Total duration of the workout in seconds
}

export interface PredefinedWorkout {
  id: number;                      // MySQL autoincrement primary key
  workout_name: string;           // Name of the workout
  duration?: number;              // Duration in minutes (optional)
  calories_burned?: number;       // Estimated calories burned (optional)
  exercises: String[];          // Stored as JSON string in DB, parsed into array here
  recommended_sets?: number;      // Default 3 (optional)
  targeted_muscles?: string[];    // Stored as JSON array in DB (e.g., ["chest", "legs"])
}

// Model for a completed workout
export interface CompletedWorkout extends Workout {
  start_date_time: string;   // ISO date string (time when the workout started)
  end_date_time?: string;    // ISO date string (time when the workout ended, optional)
  duration?: number;         // Total duration of the workout in seconds
  saved_workout_id: string;  // Unique identifier for the saved workout
}

// Model for a scheduled workout
export interface ScheduledWorkout extends Workout {
  scheduled_date_time: string; // ISO date string (scheduled date and time for the workout)
  completed: boolean;        // Flag indicating if the workout has been completed
}

// Represents a user's workouts in the database
export interface UserWorkouts {
  user_id: ObjectId;         // User identifier
  created_at: string;        // ISO date string (timestamp when the user's workouts were created)
  updated_at: string;        // ISO date string (timestamp when the user's workouts were last updated)
  workouts: Workout[];       // List of workouts associated with the user
}

// Type guard to validate if an object is a valid Workout
export function isValidWorkout(data: any): data is Workout {
  return (
    typeof data === 'object' &&
    (data._id === undefined || typeof data._id.$oid === 'string') &&
    typeof data.user_id.$oid === 'string' &&
    typeof data.routineName === 'string' &&
    Array.isArray(data.exercises) &&
    typeof data.created_at === 'string'
  );
}

// Type guard to validate if an object is a valid CompletedWorkout
export function isValidCompletedWorkout(data: any): data is CompletedWorkout {
  return (
    isValidWorkout(data) &&
    typeof (data as CompletedWorkout).start_date_time === 'string' &&
    ((data as CompletedWorkout).end_date_time === undefined || typeof (data as CompletedWorkout).end_date_time === 'string')
  );
}

// Type guard to validate if an object is a valid ScheduledWorkout
export function isValidScheduledWorkout(data: any): data is ScheduledWorkout {
  return (
    isValidWorkout(data) &&
    typeof (data as ScheduledWorkout).scheduled_date_time === 'string'
  );
}