import React from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { Workout } from '@/services/api/endpoints/workout/types/workout.types';

interface VolumeChartProps {
  workout: Workout;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ workout }) => {
  const screenWidth = Dimensions.get('window').width;
  const contentWidth = screenWidth - 48; // Account for container padding
  
  // Calculate volume for each exercise
  const exerciseVolumes = workout.exercises.map(exercise => ({
    name: exercise.exercise_name,
    volume: exercise.sets?.reduce((acc, set) => acc + (set.weight * set.reps), 0) || 0
  }));
  
  // Sort exercises by volume (descending)
  exerciseVolumes.sort((a, b) => b.volume - a.volume);
  
  // Find maximum volume for scaling
  const maxVolume = Math.max(...exerciseVolumes.map(ex => ex.volume), 1); // Use at least 1 to avoid division by zero
  
  // Text width depends on the longest number
  const maxVolumeLength = Math.max(...exerciseVolumes.map(ex => ex.volume.toLocaleString().length));
  const valueWidth = Math.max(45, maxVolumeLength * 9); // Estimate 9px per digit
  
  // Fixed widths for text elements
  const nameWidth = Math.min(120, (contentWidth - valueWidth) * 0.4); // 40% of remaining space, max 120px
  
  // Calculate available width for the bar
  const maxBarWidth = contentWidth - nameWidth - valueWidth - 16; // 16px for margins
  
  return (
    <View className="bg-white rounded-xl p-4 mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Volume per Exercise
      </Text>
      <ScrollView 
        horizontal={false} 
        showsVerticalScrollIndicator={true}
        style={{ maxHeight: 300 }}
      >
        {exerciseVolumes.map((exercise, index) => {
          // Calculate bar width proportional to value
          const barWidth = exercise.volume > 0 
            ? (exercise.volume / maxVolume) * maxBarWidth 
            : 0;
          
          return (
            <View key={index} className="flex-row items-center my-2">
              <Text 
                className="text-sm text-gray-800 mr-2" 
                numberOfLines={1} 
                ellipsizeMode="tail"
                style={{ width: nameWidth }}
              >
                {exercise.name}
              </Text>
              <View className="flex-1 flex-row">
                {exercise.volume > 0 ? (
                  <View style={{ width: barWidth }} className="h-6 bg-orange-600 rounded-md" />
                ) : (
                  <Text className="text-xs text-gray-500 italic">No volume</Text>
                )}
              </View>
              <Text 
                className="text-sm text-gray-800 ml-2"
                style={{ width: valueWidth, textAlign: 'right' }}
              >
                {exercise.volume > 0 ? exercise.volume.toLocaleString() : '-'}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default VolumeChart;