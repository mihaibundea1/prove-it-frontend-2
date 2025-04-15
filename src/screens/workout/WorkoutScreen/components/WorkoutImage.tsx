// src/screens/WorkoutScreen/components/WorkoutImage.tsx
import React from 'react';
import { View } from 'react-native';

type WorkoutImageProps = {
    color1: string;
    color2: string;
  };

  export const WorkoutImage: React.FC<WorkoutImageProps> = ({ color1, color2 }) => (
    <View className="w-16 h-16 rounded-full overflow-hidden">
    <View className="absolute inset-0 flex-row" style={{ transform: [{ rotate: '45deg' }] }}>
      <View className="flex-1" style={{ backgroundColor: color1 }} />
      <View className="flex-1" style={{ backgroundColor: color2 }} />
    </View>
  </View>
);