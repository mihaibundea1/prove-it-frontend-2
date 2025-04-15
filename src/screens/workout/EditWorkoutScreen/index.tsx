import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useUserContext } from '@/contexts/UserContext';
import { HomeStackParamList } from '@/navigation/types/navigationTypes';
import { Workout } from '@/services/api/endpoints/workout/types/workout.types';
import { useWorkoutService } from '@/services/api/endpoints/workout/hooks/useWorkoutService';
import { useWorkout } from '@/contexts/WorkoutContext'; // Import WorkoutContext
import { Header } from '@/components/shared/Header';

type EditWorkoutScreenProps = NativeStackScreenProps<HomeStackParamList, 'EditWorkoutScreen'>;

export const EditWorkoutScreen: React.FC<EditWorkoutScreenProps> = ({ route, navigation }) => {
  const { workout } = route.params;
  const { user } = useUserContext();
  const userId = user?._id;
  const { updateSavedWorkout, isLoading, error } = useWorkoutService();
  const { updateWorkout } = useWorkout(); // Replace updateActiveWorkout
  const [editedWorkout, setEditedWorkout] = useState<Workout>(workout);
  const [isSaving, setIsSaving] = useState(false);

  // Determine if this is an active workout (no _id) or a saved workout
  const isActiveWorkout = !editedWorkout._id || editedWorkout._id === "";

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleRoutineNameChange = (newName: string) => {
    setEditedWorkout(prev => ({
      ...prev,
      routineName: newName
    }));
  };

  const handleUpdateSet = (
    exerciseId: string,
    setIndex: number,
    field: 'weight' | 'reps',
    value: string
  ) => {
    const updatedExercises = editedWorkout.exercises.map(exercise => {
      if (exercise.exercise_id === exerciseId) {
        const updatedSets = exercise.sets?.map((set, idx) =>
          idx === setIndex ? { ...set, [field]: Number(value) } : set
        );
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });

    setEditedWorkout(prev => ({ ...prev, exercises: updatedExercises }));
  };

  const handleAddSet = (exerciseId: string) => {
    const updatedExercises = editedWorkout.exercises.map(exercise => {
      if (exercise.exercise_id === exerciseId) {
        const lastSet = exercise.sets?.[exercise.sets.length - 1];
        return {
          ...exercise,
          sets: [...(exercise.sets || []), {
            ...lastSet,
            set_id: Date.now().toString(),
            weight: lastSet?.weight || 0,
            reps: lastSet?.reps || 0
          }]
        };
      }
      return exercise;
    });

    setEditedWorkout(prev => ({ ...prev, exercises: updatedExercises }));
  };

  const handleSave = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsSaving(true);
    try {
      await updateWorkout(editedWorkout);
      if (editedWorkout._id) {
        // Handle saved workout update
        const response = await updateSavedWorkout(
          editedWorkout._id,
          {
            routineName: editedWorkout.routineName,
            exercises: editedWorkout.exercises,
          }
        );
      }
      navigation.navigate('WorkoutScreen', { workout: editedWorkout });
    } catch (err) {
      console.error("Error saving workout:", err);
      Alert.alert('Error', 'Failed to save workout changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header
        title="Edit Workout"
        onBackPress={() => navigation.goBack()}
        rightContent={
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving || isLoading}
            className="bg-[#E63600] px-4 py-2 rounded-full"
          >
            <Text className={`text-white font-medium ${(isSaving || isLoading) ? 'opacity-50' : ''}`}>
              {(isSaving || isLoading) ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Add Workout Name Input */}
          <View className="mb-6 bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-sm text-gray-500 mb-2">Workout Name</Text>
            <TextInput
              style={{ textAlignVertical: 'center' }}
              className="text-l font-semibold text-gray-900 p-3 bg-gray-100 rounded-lg text-center"
              value={editedWorkout.routineName}
              onChangeText={handleRoutineNameChange}
              placeholder="Enter workout name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Existing exercises list */}
          {editedWorkout.exercises.map((exercise) => (
            <View key={exercise.exercise_id} className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
              <Text className="text-xl font-semibold mb-4 text-gray-900">
                {exercise.exercise_name}
              </Text>

              <View className="mb-4">
                <View className="flex-row items-center mb-3 px-2">
                  <Text className="w-12 text-gray-500 text-sm">Set</Text>
                  <Text className="flex-1 text-gray-500 text-sm ml-2">Weight</Text>
                  <Text className="flex-1 text-gray-500 text-sm ml-2">Reps</Text>
                </View>

                {exercise.sets?.map((set, setIndex) => (
                  <View
                    key={`set-${exercise.exercise_id}-${setIndex}`}
                    className="flex-row items-center mb-3"
                  >
                    <View className="w-12 h-8 bg-gray-100 rounded-lg justify-center items-center">
                      <Text className="text-sm font-medium text-gray-600">{setIndex + 1}</Text>
                    </View>
                    <TextInput
                      className="flex-1 h-8 bg-gray-100 mx-2 px-4 rounded-lg text-center font-medium"
                      value={String(set.weight)}
                      onChangeText={(v) => handleUpdateSet(exercise.exercise_id, setIndex, 'weight', v)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                    />
                    <TextInput
                      className="flex-1 h-8 bg-gray-100 px-4 rounded-lg text-center font-medium"
                      value={String(set.reps)}
                      onChangeText={(v) => handleUpdateSet(exercise.exercise_id, setIndex, 'reps', v)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                ))}
              </View>

              <TouchableOpacity
                className="bg-gray-100 py-3 rounded-xl items-center"
                onPress={() => handleAddSet(exercise.exercise_id)}
              >
                <Text className="text-[#E63600] font-medium">Add Set</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditWorkoutScreen;