import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/screens/home/HomeScreen/HomeScreen';
import { ExerciseHomeScreen } from '@/screens/home/ExerciseHomeScreen/ExerciseHomeScreen';
import { ExerciseProvider } from '@/contexts/ExerciseContext';

const Stack = createStackNavigator();

const HomeStack = () => {

  return (
    <ExerciseProvider>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ExerciseHomeScreen" component={ExerciseHomeScreen} />
      </Stack.Navigator>
    </ExerciseProvider>
  );
};

export default HomeStack;