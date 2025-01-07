// components/TargetMuscles.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface TargetMusclesProps {
  primaryMuscles: string[];
  secondaryMuscles: string[];
}

export const TargetMuscles: React.FC<TargetMusclesProps> = ({
  primaryMuscles,
  secondaryMuscles
}) => (
  <View className="bg-gray-100 rounded-lg p-4 mb-4">
    <Text className="text-xl font-semibold mb-2 text-[#E63600]">Target Muscles</Text>
    <Text className="font-semibold text-gray-700">Primary:</Text>
    <Text className="mb-2 text-gray-600">{primaryMuscles.join(', ')}</Text>
    <Text className="font-semibold text-gray-700">Secondary:</Text>
    <Text className="text-gray-600">{secondaryMuscles.join(', ')}</Text>
  </View>
);