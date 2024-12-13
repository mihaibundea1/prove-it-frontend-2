import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../../screens/profile/ProfileScreen';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="ProfileScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      {/* Add other screens specific to Home tab here */}
    </Stack.Navigator>
  );
};

export default ProfileStack;