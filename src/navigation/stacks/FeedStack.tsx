// src/navigation/stacks/FeedStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from '../../screens/feed/FeedScreen';
import { FeedProvider } from '../../contexts/FeedContext';

const Stack = createStackNavigator();

const FeedStack = () => {
  return (
    <FeedProvider>
      <Stack.Navigator initialRouteName="FeedScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="FeedScreen" component={FeedScreen} />
        {/* Add other screens specific to Feed tab here */}
      </Stack.Navigator>
    </FeedProvider>
  );
};

export default FeedStack;