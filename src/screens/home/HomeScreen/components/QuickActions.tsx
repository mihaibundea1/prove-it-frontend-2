import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dumbbell, Zap, Target, PlayCircle } from 'lucide-react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../types';

const QuickActions: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View className="grid grid-cols-2 gap-4 mb-6">
      <TouchableOpacity
        className="bg-[#3C2C28] p-4 rounded-lg items-center shadow-md"
        onPress={() => navigation.navigate('ExerciseHomeScreen')}
      >
        <Dumbbell size={wp(5)} color="#fff" />
        <Text className="text-white mt-2 font-medium">Create Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-[#E63600] p-4 rounded-lg items-center shadow-md"
        onPress={() => navigation.navigate('AiSuggestionsScreen')}
      >
        <Zap size={wp(6)} color="#fff" />
        <Text className="text-white mt-2 font-medium">AI Suggestions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-[#914730] p-4 rounded-lg items-center shadow-md"
        onPress={() => navigation.navigate('StartWorkoutScreen')}
      >
        <PlayCircle size={wp(6)} color="#fff" />
        <Text className="text-white mt-2 font-medium">Start Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className="bg-[#BB441F] p-4 rounded-lg items-center shadow-md"
        onPress={() => navigation.navigate('Questions')}
      >
        <Target size={wp(6)} color="#fff" />
        <Text className="text-white mt-2 font-medium">Update Goals</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuickActions;