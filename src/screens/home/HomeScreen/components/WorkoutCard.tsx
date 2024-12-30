import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dumbbell, ChevronRight } from 'lucide-react-native';
import { WorkoutCardProps } from '../types';

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onPress }) => {
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white mb-4 rounded-xl shadow-sm p-4"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-4">
          <View className="h-12 w-12 rounded-full bg-orange-100 items-center justify-center">
            <Dumbbell size={24} color="#EA580C" />
          </View>
          <View>
            <Text className="font-semibold text-lg text-gray-900">
              {workout.name}
            </Text>
            <Text className="text-sm text-gray-500">
              {new Date(workout.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-center space-x-6">
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-900">
              {workout.exercises.length}
            </Text>
            <Text className="text-xs text-gray-500">Exercises</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-900">{totalSets}</Text>
            <Text className="text-xs text-gray-500">Sets</Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WorkoutCard;