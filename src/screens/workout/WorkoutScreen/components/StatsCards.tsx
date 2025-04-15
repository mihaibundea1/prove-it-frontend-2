// src/screens/WorkoutScreen/components/StatsCards.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { WorkoutStats } from '../types';

interface StatsCardsProps {
  stats: WorkoutStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <View className="flex-row justify-around px-6 mt-8">
      <View className="bg-gray-50 p-4 rounded-2xl w-36 items-center">
        <Text className="text-gray-500">Volume</Text>
        <Text className="text-2xl font-bold text-gray-900">{stats.volume}</Text>
        <Text className="text-gray-500">kg</Text>
      </View>
      <View className="bg-gray-50 p-4 rounded-2xl w-36 items-center">
        <Text className="text-gray-500">Sets</Text>
        <Text className="text-2xl font-bold text-gray-900">{stats.sets}</Text>
        <Text className="text-gray-500">total</Text>
      </View>
    </View>
  );
};