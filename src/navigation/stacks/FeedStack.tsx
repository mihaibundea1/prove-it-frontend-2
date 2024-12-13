import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from '../../screens/feed/FeedScreen';

const Stack = createStackNavigator();

const FeedStack = () => {
  return (
    <Stack.Navigator initialRouteName="FeedScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FeedScreen" component={FeedScreen} />
      {/* Add other screens specific to Home tab here */}
    </Stack.Navigator>
  );
};

export default FeedStack;