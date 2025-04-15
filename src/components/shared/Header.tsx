// src/screens/WorkoutScreen/components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  rightContent?: React.ReactNode;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  rightContent,
  onBackPress 
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-100">
      <View className="flex-row items-center space-x-4">
        <TouchableOpacity onPress={handleBackPress}>
          <ChevronLeft color="#1C1C1E" size={24} />
        </TouchableOpacity>
        <Text className="text-gray-900 text-xl font-semibold">{title}</Text>
      </View>
      
      {rightContent && (
        <View className="flex-row items-center">
          {rightContent}
        </View>
      )}
    </View>
  );
};