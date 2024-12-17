import React from 'react';
import { View, Text } from 'react-native';
import { Trophy, Activity, Users } from 'lucide-react-native';

const ProfileStats = () => {
  const profileStats = [
    { icon: <Trophy color="#e63600" size={24} />, label: 'Total Workouts', value: '42' },
    { icon: <Activity color="#e63600" size={24} />, label: 'Calories Burned', value: '3,654' },
    { icon: <Users color="#e63600" size={24} />, label: 'Fitness Buddies', value: '24' },
  ];

  return (
    <View className="flex-row justify-center space-x-4 mb-6">
      {profileStats.map((stat, index) => (
        <View 
          key={index} 
          className="bg-gray-100 p-4 rounded-lg items-center w-28"
        >
          {stat.icon}
          <Text className="text-lg font-bold mt-2 text-black">{stat.value}</Text>
          <Text className="text-gray-500 text-xs">{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default ProfileStats;
