import React from 'react';
import { useSession } from '@clerk/clerk-expo';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './stacks/AuthStack';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoaded, session } = useSession();

  console.log('AppNavigator State:', {
    isLoaded,
    hasSession: !!session,
    sessionId: session?.id
  });

  if (!isLoaded) {
    console.log("App Navigator: Clerk not loaded");
    return null; 
  }

  const initialRoute = session ? "MainTabs" : "AuthStack";
  console.log("Selecting initial route:", initialRoute);

  return (
    <Stack.Navigator 
      initialRouteName={initialRoute} 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: false 
      }}
    >
      {session ? (
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator} 
          options={{ animationEnabled: false }}
        />
      ) : (
        <Stack.Screen 
          name="AuthStack" 
          component={AuthStack} 
          options={{ animationEnabled: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;