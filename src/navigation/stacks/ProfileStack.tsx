import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyProfileScreen from '../../screens/auth/MyProfileScreen'
const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="MyProfileScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />
      {/* Add other screens specific to Home tab here */}
    </Stack.Navigator>
  );
};

export default ProfileStack;