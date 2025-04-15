// src/screens/WorkoutScreen/components/ActionButtons.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Play, Pause, Plus, X } from 'lucide-react-native';

interface ActionButtonsProps {
  isWorkoutActive: boolean;
  isPaused: boolean;
  onStartStop: () => void;
  onAddExercise: () => void;
  onDiscard: () => void;
  onCompleteSet: () => void; // Adăugați această linie

}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isWorkoutActive,
  isPaused,
  onStartStop,
  onAddExercise,
  onDiscard,
}) => {
  return (
    <View className="w-full space-y-4">
      <TouchableOpacity 
        className={`py-4 rounded-xl flex-row justify-center items-center space-x-2
          ${isWorkoutActive ? 'bg-gray-100' : 'bg-[#E63600]'}`}
        onPress={onStartStop}
      >
        {isWorkoutActive ? (
          <>
            {isPaused ? (
              <Play color="#E63600" size={24} />
            ) : (
              <Pause color="#E63600" size={24} />
            )}
            <Text className="text-[#E63600] text-lg font-semibold">
              {isPaused ? 'Resume Workout' : 'Pause Workout'}
            </Text>
          </>
        ) : (
          <>
            <Play color="white" size={24} />
            <Text className="text-white text-lg font-semibold">Start Workout</Text>
          </>
        )}
      </TouchableOpacity>

      {isWorkoutActive && (
        <TouchableOpacity 
          className="bg-[#E63600] py-4 rounded-xl flex-row justify-center items-center space-x-2"
          onPress={onAddExercise}
        >
          <Plus color="white" size={24} />
          <Text className="text-white text-lg font-semibold">Add Exercise</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        className="py-4 rounded-xl flex-row justify-center items-center"
        onPress={onDiscard}
      >
        <X color="#E63600" size={24} />
        <Text className="text-[#E63600] text-lg font-semibold ml-2">
          Discard Workout
        </Text>
      </TouchableOpacity>
    </View>
  );
};