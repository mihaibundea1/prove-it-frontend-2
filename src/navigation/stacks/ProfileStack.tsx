import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyProfileScreen from '../../screens/profile/MyProfileScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="MyProfileScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />
      {/* Add other screens specific to Home tab here */}
    </Stack.Navigator>
  );
};

export default ProfileStack;