// CreateWorkoutScreen.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { WorkoutHeader } from "./WorkoutHeader";
import { WorkoutTitle } from "./WorkoutTitle";
import { ExerciseItem } from "./ExerciseItem";
import { TimerPicker } from "./TimerPicker";
import { Exercise } from "@/types/exercise.types";
import { useExercises } from "@/contexts/ExerciseContext";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/navigation/types/navigationTypes";
import { useWorkoutService } from "@/services/api/endpoints/workout/hooks/useWorkoutService";
import { useNavigation } from '@react-navigation/native';
import { HomeStackScreenProps } from '@/navigation/types/navigationTypes';
import { useUserContext } from '@/contexts/UserContext'; // Use UserContext instead of useUserService
import { Workout } from "@/services/api/endpoints/workout/types/workout.types";


// Enable LayoutAnimation on Android (experimental)
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
type CreateWorkoutScreen = NativeStackScreenProps<HomeStackParamList, 'CreateWorkoutScreen'>;

export const CreateWorkoutScreen: React.FC<CreateWorkoutScreen> = () => {
  // Local state for routine name and exercises list
  const [routineName, setRoutineName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const [selectedTimerIndex, setSelectedTimerIndex] = useState<number>(-1);
  const { createSavedWorkout, isLoading: isSaving } = useWorkoutService();
  const {
    user, // Renamed from userData to user
  } = useUserContext();

  const navigation = useNavigation<HomeStackScreenProps<'CreateWorkoutScreen'>['navigation']>();


  // Get exercises from context
  const { selectedExercises, setSelectedExercises } = useExercises();

  // Synchronize local exercises with context
  useEffect(() => {
    if (selectedExercises.length > 0) {
      setExercises(selectedExercises);
    }
  }, [selectedExercises]);

  // Add a new set to the exercise at the given index
  const handleAddSet = useCallback((exerciseIndex: number) => {
    setExercises((prevExercises) => {
      const newExercises = [...prevExercises];
      const currentSets = newExercises[exerciseIndex].sets ?? [];
      newExercises[exerciseIndex].sets = [...currentSets, { weight: "", reps: "" }];
      return newExercises;
    });
  }, []);

  // Remove all sets from the exercise at the given index
  const handleRemoveAllSets = useCallback((exerciseIndex: number) => {
    setExercises((prevExercises) => {
      const newExercises = [...prevExercises];
      newExercises[exerciseIndex].sets = [];
      return newExercises;
    });
  }, []);

  // Update a specific set field (weight or reps) for an exercise
  const handleInputChange = useCallback(
    (
      exerciseIndex: number,
      setIndex: number,
      field: "weight" | "reps",
      value: string
    ) => {
      setExercises((prevExercises) => {
        const newExercises = [...prevExercises];
        // Ensure the sets array exists
        if (!newExercises[exerciseIndex].sets) {
          newExercises[exerciseIndex].sets = [];
        }
        if (newExercises[exerciseIndex].sets![setIndex]) {
          newExercises[exerciseIndex].sets![setIndex][field] = value;
        }
        return newExercises;
      });
    },
    []
  );

  // Delete an exercise by its index
  const handleDeleteExercise = useCallback((exerciseIndex: number) => {
    setExercises((prevExercises) => {
      const newExercises = [...prevExercises];
      newExercises.splice(exerciseIndex, 1);
      // Also update the context
      setSelectedExercises(newExercises);
      return newExercises;
    });
  }, [setSelectedExercises]);

  // Save handler (implement as needed)
  // Update the handleSave function
  const handleSave = async () => {
    if (!routineName.trim()) {
      alert('Please enter a routine name');
      return;
    }

    if (exercises.length === 0) {
      alert('Please add at least one exercise to the routine');
      return;
    }

    if (!user?._id) {
      alert('User data is missing. Please try again.');
      return;
    }

    try {
      const workoutData: Omit<Workout, "_id" | "created_at" | "updated_at"> = {
        user_id: user._id, // Use ObjectId type for user_id
        routineName: routineName.trim(),
        exercises: exercises.map((exercise, index) => ({
          exercise_id: exercise.id,
          exercise_name: exercise.title,
          sets: (exercise.sets ?? []).map(set => ({
            weight: parseFloat(set.weight) || 0,
            reps: parseInt(set.reps) || 0,
          })),
          restTimer: exercise.restTimer === "OFF" ? 0 : parseInt(exercise.restTimer || "0") || 0,          order: index,
        })),
        notes: "", // Optional: Add notes if needed
      };

      const savedWorkout = await createSavedWorkout(workoutData);
      console.log('Saved workout:', savedWorkout, "workoutData", workoutData);
      if (savedWorkout) {
        // Reset state after successful save
        setSelectedExercises([]);
        setExercises([]);
        setRoutineName('');
        alert('Workout saved successfully!');

        // Navigate back or to another screen
        navigation.goBack();
      }
      else {
        alert('There was an error saving the workout. Please try again later.');

      }
    } catch (error) {
      alert('Failed to save workout. Please try again.');
    }
  };

  // Add a new exercise with default values
  const handleAddExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      title: "New Exercise",
      images: [],
      thumbnail: null,
      category: "",
      equipment: "",
      level: "",
      force: null,
      mechanic: null,
      primaryMuscles: [],
      secondaryMuscles: [],
      instructions: [],
      sets: [],
      restTimer: "OFF",
    };
    setExercises((prevExercises) => {
      const newExercises = [...prevExercises, newExercise];
      setSelectedExercises(newExercises);
      return newExercises;
    });
  };

  // Render each exercise item using its array index
  const renderItem = useCallback(
    (params: RenderItemParams<Exercise>) => {
      const { item, drag, isActive } = params;
      const index = exercises.findIndex(ex => ex.id === item.id); // Calculăm indexul

      return (
        <ExerciseItem
          index={index} // Acum indexul este determinat corect
          item={item}
          drag={drag}
          isActive={isActive}
          onDelete={handleDeleteExercise}
          onTimerPress={(exerciseIndex: number) => {
            setSelectedTimerIndex(exerciseIndex);
            setShowTimerPicker(true);
          }}
          onInputChange={handleInputChange}
          onAddSet={handleAddSet}
          onRemoveAllSets={handleRemoveAllSets}
        />
      );
    },
    [handleDeleteExercise, handleInputChange, handleAddSet, handleRemoveAllSets, exercises]
  );


  return (
    <SafeAreaView className="flex-1 bg-white">
      <WorkoutHeader onSave={handleSave} isSaving={isSaving} />

      <View className="flex-1 px-4 pt-4">
        <WorkoutTitle routineName={routineName} setRoutineName={setRoutineName} />

        <DraggableFlatList
          data={exercises}
          onDragEnd={({ data }) => {
            // Animate the reordering for a smooth transition
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setExercises(data);
            setSelectedExercises(data);
          }}
          keyExtractor={(item: Exercise) => item.id}
          renderItem={renderItem}
          scrollEnabled={true}
          contentContainerStyle={{
            paddingBottom: hp(40), // Increased bottom padding
            minHeight: '100%' // Ensures scrollable area even with few items
          }}
        />
      </View>

      <TouchableOpacity
        onPress={handleAddExercise}
        className="absolute bottom-8 right-8 bg-[#ee4444] w-16 h-16 rounded-full justify-center items-center shadow-lg"
      >
        <Text className="text-white text-3xl font-semibold">+</Text>
      </TouchableOpacity>

      <TimerPicker
        visible={showTimerPicker}
        onClose={() => setShowTimerPicker(false)}
        selectedValue={
          selectedTimerIndex >= 0 ? exercises[selectedTimerIndex]?.restTimer ?? "OFF" : "OFF"
        }
        onValueChange={(value) => {
          setExercises((prevExercises) => {
            const newExercises = [...prevExercises];
            if (selectedTimerIndex >= 0) {
              newExercises[selectedTimerIndex].restTimer = value;
            }
            return newExercises;
          });
        }}
      />
    </SafeAreaView>
  );
};
