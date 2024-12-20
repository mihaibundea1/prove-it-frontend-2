import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Only use this
import ProfileScreen from "../../screens/profile/ProfileScreen";
import SettingsStack from "./SettingsStack";
import { ProfileStackParamList } from "../../types/navigation";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }} // Hides the header for ProfileScreen
      />
      <Stack.Screen
        name="SettingsStack"
        component={SettingsStack} // SettingsStack is a component here
        options={{ headerShown: false }} // Optional: Hides the nested stack header
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
