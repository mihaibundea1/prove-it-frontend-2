import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/screens/home/HomeScreen/HomeScreen';
import { ExerciseHomeScreen } from '@/screens/home/ExerciseHomeScreen/ExerciseHomeScreen';
import ExerciseDetailsScreen from '@/screens/home/ExerciseDetailsScreen/ExerciseDetailsScreen';
import { ExerciseProvider } from '@/contexts/ExerciseContext';
import { HomeStackParamList } from '@/navigation/types/navigationTypes';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <ExerciseProvider>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ExerciseHomeScreen" component={ExerciseHomeScreen} />
        <Stack.Screen name="ExerciseDetailsScreen" component={ExerciseDetailsScreen} />
      </Stack.Navigator>
    </ExerciseProvider>
  );
};

export default HomeStack;