import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Only use this
import SettingsScreen from "../../screens/profile/SettingsScreen";
import EditProfileScreen from "../../screens/profile/settings/EditProfileScreen";
import ChangePasswordScreen from "../../screens/profile/settings/ChangePasswordScreen";
import NotificationSettingsScreen from "../../screens/profile/settings/NotificationSettingsScreen";
import PrivacySettingsScreen from "../../screens/profile/settings/PrivacySettingsScreen";
import SubscriptionScreen from "../../screens/profile/settings/SubscriptionScreen";
import DataExportScreen from "../../screens/profile/settings/DataExportScreen";
import LanguageScreen from "../../screens/profile/settings/LanguageScreen";
import DeleteAccountScreen from "../../screens/profile/settings/DeleteAccountScreen";
import HelpCenterScreen from "../../screens/profile/settings/HelpCenterScreen";
import { SettingsStackParamList } from "@/navigation/types/navigationTypes";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{
        title: "Settings",
        headerStyle: {
          backgroundColor: "#e63600",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{title: "Edit Profile"}}/>
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{title: "Change Password"}}/>
      <Stack.Screen name="NotificationSettingsScreen" component={NotificationSettingsScreen} options={{title: "Notification Preferences"}}/>
      <Stack.Screen name="PrivacySettingsScreen" component={PrivacySettingsScreen} options={{title: "Privacy"}}/>
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} options={{title: "Subscriptions"}}/>
      <Stack.Screen name="DataExportScreen" component={DataExportScreen} options={{title: "Data Export"}}/>
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} options={{title: "Language"}}/>
      <Stack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen} options={{title: "Delete Account"}}/>
      <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} options={{title: "Help Center"}}/>
    </Stack.Navigator>
  );
};

export default SettingsStack;
