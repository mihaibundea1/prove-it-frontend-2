import React from 'react';
import { View, Text } from 'react-native';
import { BarChart, Calendar, Clock } from 'lucide-react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { QuickStatsProps } from '../types';

const QuickStats: React.FC<QuickStatsProps> = () => (
  <View className="bg-white p-6 rounded-lg mb-8 shadow-md">
    <Text className="text-lg font-bold mb-2 text-black">Quick Stats</Text>
    <View className="flex-row justify-between items-center">
      <View className="items-center">
        <BarChart size={wp(6)} color="black" />
        <Text className="text-gray-700 mt-1">Progress</Text>
      </View>
      <View className="items-center">
        <Calendar size={wp(6)} color="black" />
        <Text className="text-gray-700 mt-1">Streak</Text>
      </View>
      <View className="items-center">
        <Clock size={wp(6)} color="black" />
        <Text className="text-gray-700 mt-1">Time</Text>
      </View>
    </View>
  </View>
);

export default QuickStats;