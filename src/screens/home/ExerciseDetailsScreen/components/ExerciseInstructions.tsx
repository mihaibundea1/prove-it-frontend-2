// components/Instructions.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface InstructionsProps {
  instructions: string[];
}

export const ExerciseInstructions: React.FC<InstructionsProps> = ({ instructions }) => (
  <View className="bg-gray-100 rounded-lg p-4">
    <Text className="text-xl font-semibold mb-2 text-[#E63600]">How to do it?</Text>
    <Text className="text-gray-600">{instructions.join('\n\n')}</Text>
  </View>
);