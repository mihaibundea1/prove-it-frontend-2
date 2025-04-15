import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Clock, Play, Pause } from 'lucide-react-native';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { Workout } from '@/services/api/endpoints/workout/types/workout.types';

const ActiveWorkoutMiniCard: React.FC = () => {
  const { 
    currentDuration, 
    activeWorkout, 
    isWorkoutActive, 
    formatDuration, 
    pauseWorkout, 
    resumeWorkout 
  } = useWorkout();

  const navigation = useNavigation();

  // Dacă nu există un antrenament activ, componenta nu se afișează
  if (!activeWorkout) return null;

  const navigateToWorkout = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'WorkoutScreen',
        params: { workout: activeWorkout as Workout }
      })
    );
  };

  return (
    <TouchableOpacity 
      className="bg-[#E63600] m-4 p-4 rounded-xl"
      onPress={navigateToWorkout}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Clock color="white" size={20} />
          <Text className="text-white font-semibold ml-2">Active Workout</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-white mr-4">{formatDuration(currentDuration)}</Text>
          <TouchableOpacity
            onPress={isWorkoutActive ? pauseWorkout : resumeWorkout}
            className="bg-white/20 p-2 rounded-full"
          >
            {isWorkoutActive ? (
              <Pause color="white" size={16} />
            ) : (
              <Play color="white" size={16} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ActiveWorkoutMiniCard;
