// DateHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface DateHeaderProps {
  date: Date;
}

const DateHeader: React.FC<DateHeaderProps> = ({ date }) => {
  const isToday = new Date().toDateString() === date.toDateString();
  
  return (
    <View className="items-center py-5">
      <Text className="text-sm text-gray-500 mb-1">
        {date.toLocaleDateString('en-US', { weekday: 'long' })}
      </Text>
      <Text className={`text-3xl font-bold mb-1 ${isToday ? 'text-red-500' : 'text-black'}`}>
        {date.getDate()}
      </Text>
      <Text className="text-sm text-gray-500">
        {date.toLocaleDateString('en-US', { month: 'long' })}
      </Text>
    </View>
  );
};

export default DateHeader;