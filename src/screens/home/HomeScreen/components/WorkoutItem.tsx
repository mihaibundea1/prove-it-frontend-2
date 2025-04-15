import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { ScheduledWorkout } from '@/services/api/endpoints/workout/types/workout.types';
import { format } from 'date-fns';

interface WorkoutItemProps {
  workout: ScheduledWorkout;
  onPress: () => void;
  onCheckToggle: () => void;
}

const WorkoutItem: React.FC<WorkoutItemProps> = ({ workout, onPress, onCheckToggle }) => {  
  const time = format(new Date(workout.scheduled_date_time), 'h:mm a');

  return (
    <TouchableOpacity
      className={`${workout.completed ? 'bg-green-50' : 'bg-gray-50'} rounded-xl my-1.5 p-4`}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {/* Checkbox to toggle completed state */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onCheckToggle();
            }}
            className={`w-6 h-6 rounded-full ${workout.completed ? 'bg-green-500' : 'bg-gray-200'} items-center justify-center mr-3`}
          >
            {workout.completed && <Text className="text-white text-base font-semibold">✓</Text>}
          </TouchableOpacity>

          {/* Workout name */}
          <Text className={`text-base ${workout.completed ? 'text-green-500' : 'text-black'}`}>
            {workout.routineName}
          </Text>
        </View>

        {/* Workout Time */}
        {time && (
          <Text className={`text-sm ${workout.completed ? 'text-green-400' : 'text-gray-500'}`}>
            {time}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default WorkoutItem;