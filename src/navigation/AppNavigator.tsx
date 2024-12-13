import React from 'react';
import { useSession } from '@clerk/clerk-expo';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './stacks/AuthStack';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoaded, session } = useSession();

  if (!isLoaded) {
    return null; 
  }

  return (
    <Stack.Navigator initialRouteName={session ? "MainTabs" : "AuthStack"} screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;