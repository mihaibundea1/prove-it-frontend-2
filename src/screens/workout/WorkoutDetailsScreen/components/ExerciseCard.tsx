import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Exercise } from '@/services/api/endpoints/workout/types/workout.types';

interface ExerciseCardProps {
  exercise: Exercise;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const totalVolume = exercise.sets?.reduce((acc, set) => acc + (set.weight * set.reps), 0) || 0;

  return (
    <View className="bg-white rounded-xl p-4 mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-2">
        {exercise.exercise_name}
      </Text>
      
      <View className="flex-row justify-between mb-4">
        <View>
          <Text className="text-gray-500 text-sm">Total Sets</Text>
          <Text className="text-gray-900 font-semibold">{exercise.sets?.length || 0}</Text>
        </View>
        <View>
          <Text className="text-gray-500 text-sm">Volume</Text>
          <Text className="text-gray-900 font-semibold">{totalVolume} kg</Text>
        </View>
        <View>
          <Text className="text-gray-500 text-sm">Max Weight</Text>
          <Text className="text-gray-900 font-semibold">
            {Math.max(...(exercise.sets?.map(set => set.weight) || [0]))} kg
          </Text>
        </View>
      </View>

      {/* Sets Detail */}
      <View className="bg-gray-50 rounded-lg p-3">
        <Text className="text-sm font-medium text-gray-700 mb-2">Sets Detail</Text>
        <View className="space-y-2">
          {exercise.sets?.map((set, idx) => (
            <View key={idx} className="flex-row justify-between items-center">
              <Text className="text-gray-600">Set {idx + 1}</Text>
              <View className="flex-row items-center space-x-6">
                <Text className="text-gray-900">{set.reps} reps</Text>
                <Text className="text-gray-900 w-16 text-right">{set.weight} kg</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ExerciseCard;