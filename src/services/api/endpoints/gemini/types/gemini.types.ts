import { Workout, Exercise, Set } from "@/services/api/endpoints/workout/types/workout.types";

export interface WorkoutSpecifications {
  user_id: string;
  workoutType: "Single Workout" | "Full Routine";
  selectedMuscles: string[];
  useInitialSettings: boolean;
  difficulty?: "Beginner" | "Intermediate" | "Advanced"; // Explicit union type
  exerciseCount?: number;
  repRange?: string;
  routineDays?: number;
  equipment?: string[];
  workoutDuration?: string;
  workoutIntensity?: "Low" | "Moderate" | "High";
  medicalConditions?: boolean;
  workoutEnvironment?: "Gym" | "Home";
}

export interface WorkoutResponse {
  content: string; // Raw response content
  workout: Workout; // Workout object
  usage?: {
    prompt_tokens: number;
    response_tokens: number;
    total_tokens: number;
  };
  error?: string; // Error message if present
}