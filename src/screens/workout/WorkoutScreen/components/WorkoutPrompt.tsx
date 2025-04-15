// src/screens/WorkoutScreen/components/WorkoutPrompt.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Dumbbell } from 'lucide-react-native';

export const WorkoutPrompt: React.FC = () => {
  return (
    <>
      <Dumbbell size={48} color="#E63600" className="mb-4" />
      <Text className="text-xl font-semibold text-gray-900 mb-2">Ready to start?</Text>
      <Text className="text-gray-500 text-center mb-8">
        Press the button below to begin tracking your workout
      </Text>
    </>
  );
};