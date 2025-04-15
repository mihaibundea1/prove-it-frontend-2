import { useState, useRef } from "react";
import { GeminiService } from "../GeminiService";
import { useAuth } from "@clerk/clerk-expo";
import { WorkoutSpecifications, WorkoutResponse } from "../types/gemini.types";
import { useNavigation } from "@react-navigation/native";
import { HomeStackScreenProps } from "@/navigation/types/navigationTypes";
import { useWorkoutService } from "@/services/api/endpoints/workout/hooks/useWorkoutService";
import { Workout } from "@/services/api/endpoints/workout/types/workout.types";
import { useUserContext } from "@/contexts/UserContext";

export const useGeminiService = () => {
  const navigation =
    useNavigation<HomeStackScreenProps<"WorkoutDetailsScreen">["navigation"]>();
  const { getToken } = useAuth();
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const serviceRef = useRef(new GeminiService(getToken));
  const { createSavedWorkout } = useWorkoutService();
  const { user } = useUserContext();

  const generateWorkoutPlan = async (
    specs: WorkoutSpecifications
  ): Promise<WorkoutResponse | null> => {
    try {
      const response = await serviceRef.current.generateAIWorkout(specs);
      return response.data;
    } catch (error) {
      console.error("Error in generateWorkoutPlan:", error);
      return null;
    }
  };

  const handleGenerateWorkout = async (
    requestData: {
      user_id: string;
      workoutType: string;
      selectedMuscles: string[];
      useInitialSettings: boolean | null;
      difficulty?: string;
      exerciseCount?: string;
      repRange?: string;
      routineDays?: string;
    },
    schedule: boolean // Add schedule as a parameter
  ) => {
    setIsLoading(true);
    setError(null);
  
    // Structure parameters according to backend expectations
    const workoutSpecs: WorkoutSpecifications = {
      user_id: requestData.user_id,
      workoutType: requestData.workoutType as WorkoutSpecifications["workoutType"],
      selectedMuscles: requestData.selectedMuscles,
      useInitialSettings: requestData.useInitialSettings as boolean,
      ...(!requestData.useInitialSettings && {
        difficulty: requestData.difficulty as WorkoutSpecifications["difficulty"],
        exerciseCount: requestData.exerciseCount
          ? parseInt(requestData.exerciseCount.split("-")[1])
          : 6,
        repRange: requestData.repRange || "Medium (8-12)",
        ...(requestData.workoutType === "Full Routine" && {
          routineDays: parseInt(requestData.routineDays || "4"),
        }),
      }),
    };
  
    const response = await generateWorkoutPlan(workoutSpecs);
    console.log(response?.workout);
    setIsLoading(false);
  
    if (response?.workout) {
      try {
        const workoutData = response.workout;
        console.log("Workout data:", workoutData);
  
        // Navigate with the schedule included
        navigation.navigate("WorkoutDetailsScreen", {
          workout: workoutData as Workout,
          schedule: schedule, // Pass schedule
        });
  
        setWorkoutPlan(JSON.stringify(workoutData, null, 2));
        return workoutData; // Return the generated workout
      } catch (error) {
        console.error("Processing error:", error);
        setError("Failed to process workout data");
      }
    } else {
      setError("Failed to generate workout plan");
    }
    return null;
  };
  

  return {
    isLoading,
    error,
    workoutPlan,
    generateWorkoutPlan,
    handleGenerateWorkout,
  };
};
