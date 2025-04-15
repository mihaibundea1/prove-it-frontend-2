import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Workout } from '@/services/api/endpoints/workout/types/workout.types';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  onStartPress: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onPress, onStartPress }) => {
  const totalSets = workout.exercises?.reduce((acc, ex) => acc + (ex.sets?.length || 0), 0) || 0;

  const totalVolume = workout.exercises?.reduce((acc, ex) => {
    return acc + (ex.sets?.reduce((setAcc, set) => setAcc + ((set?.weight || 0) * (set?.reps || 0)), 0) || 0);
  }, 0) || 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white mx-4 mb-4 rounded-xl shadow-sm p-4"
    >
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-lg font-semibold text-gray-900">
            {workout?.routineName ?? 'Unnamed Workout'}
          </Text>

          <Text className="text-sm text-gray-500 mt-1">
            {workout?.created_at
              ? new Date(workout.created_at).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Unknown Date'}
          </Text>
        </View>
        <View className="flex-row items-center space-x-2">
          <View className="bg-blue-50 px-3 py-1 rounded-full">
            <Text className="text-blue-600 font-medium">
              {workout?.exercises?.length ?? 0} exercises
            </Text>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onStartPress();
            }}
            className="bg-orange-50 px-3 py-1 rounded-full"
          >
            <Text className="text-orange-600 font-medium">Start</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-between mt-2 pt-3 border-t border-gray-100">
        <View>
          <Text className="text-gray-500 text-sm">Total Sets</Text>
          <Text className="text-gray-900 font-semibold">{totalSets}</Text>
        </View>
        <View>
          <Text className="text-gray-500 text-sm">Volume</Text>
          <Text className="text-gray-900 font-semibold">{totalVolume} kg</Text>
        </View>
        <View>
          <Text className="text-gray-500 text-sm">Duration</Text>
          <Text className="text-gray-900 font-semibold">45 min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WorkoutCard;