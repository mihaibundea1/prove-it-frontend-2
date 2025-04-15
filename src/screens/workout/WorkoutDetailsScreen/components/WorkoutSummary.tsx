import React from 'react';
import { View, Text } from 'react-native';
import { Calendar, Dumbbell, BarChart2, TrendingUp } from 'lucide-react-native';
import { Workout } from '@/services/api/endpoints/workout/types/workout.types';

interface WorkoutSummaryProps {
  workout: Workout;
  totalVolume: number;
  totalSets: number;
}

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({ workout, totalVolume, totalSets }) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-4">
      <Text className="text-2xl font-bold text-gray-900">
        {workout.routineName}
      </Text>
      
      <View className="flex-row items-center mt-2">
        <Calendar size={16} color="#6B7280" />
        <Text className="text-gray-500 ml-2">
          {new Date(workout.created_at).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </View>

      <View className="flex-row justify-between mt-6">
        <View className="items-center">
          <Dumbbell size={24} color="#E63600" />
          <Text className="text-gray-500 text-sm mt-1">Exercises</Text>
          <Text className="text-gray-900 font-bold text-lg">
            {workout.exercises.length}
          </Text>
        </View>
        <View className="items-center">
          <BarChart2 size={24} color="#E63600" />
          <Text className="text-gray-500 text-sm mt-1">Sets</Text>
          <Text className="text-gray-900 font-bold text-lg">{totalSets}</Text>
        </View>
        <View className="items-center">
          <TrendingUp size={24} color="#E63600" />
          <Text className="text-gray-500 text-sm mt-1">Volume</Text>
          <Text className="text-gray-900 font-bold text-lg">
            {totalVolume} kg
          </Text>
        </View>
      </View>
    </View>
  );
};

export default WorkoutSummary;