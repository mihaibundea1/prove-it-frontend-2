import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/screens/home/HomeScreen/HomeScreen';
import { ExerciseHomeScreen } from '@/screens/home/ExerciseHomeScreen/ExerciseHomeScreen';
import { useExercisePreloader } from '@/services/api/endpoints/exercise/hooks/useExercisePreloader';

const Stack = createStackNavigator();

const HomeStack = () => {
  useExercisePreloader();

  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ExerciseHomeScreen" component={ExerciseHomeScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;