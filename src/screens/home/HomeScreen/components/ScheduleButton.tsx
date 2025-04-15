// ScheduleButton.tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface ScheduleButtonProps {
  onPress: () => void;
}

const ScheduleButton: React.FC<ScheduleButtonProps> = ({ onPress }) => {
  return (
    <View className="absolute bottom-5 left-5 right-5 items-center">
      <TouchableOpacity
        onPress={onPress}
        className="bg-red-500 py-4 px-8 rounded-xl w-full items-center"
      >
        <Text className="text-base text-white font-semibold">Schedule Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScheduleButton;