import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight, LogOut, User, Key, Bell, Shield, HelpCircle, CreditCard, Download, Globe, Trash } from "lucide-react-native";
import { useClerk } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParamList } from "../../types/navigation"; // Make sure to adjust the path to your navigation types

// Define navigation types
type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileScreen'>;

const SettingsScreen = () => {
  const clerk = useClerk();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  // Menu items for settings
  const settingsMenuItems = [
    { label: "Edit Profile", icon: <User color="#e63600" size={24} />, onPress: () => navigation.navigate("SettingsStack", { screen: "EditProfileScreen" }) },
    { label: "Change Password", icon: <Key color="#e63600" size={24} />, onPress: () => navigation.navigate("SettingsStack", { screen: "ChangePasswordScreen" }) },
    { label: "Notification Preferences", icon: <Bell color="#e63600" size={24} />, onPress: () => navigation.navigate("SettingsStack", { screen: "NotificationSettingsScreen" }) },
    { label: "Privacy Settings", icon: <Shield color="#e63600" size={24} />, onPress: () => navigation.navigate("SettingsStack", { screen: "PrivacySettingsScreen" }) },
    { label: "Manage Subscriptions", icon: <CreditCard color="#e63600" size={24} />, onPress: () => navigation.navigate("SettingsStack", { screen: "SubscriptionScreen" }) },
    { label: "Data Export", icon: <Download color="#e63600" size={24} />, onPress: () => navigation.navigate("SettingsStack", { screen: "DataExportScreen" }) },
    { label: "Language", icon: <Globe color="#e63600" size={24} />, onPress: () => navigation.navigate("SettingsStack", { screen: "LanguageScreen" }) },
    { label: "Delete Account", icon: <Trash color="#e63600" size={24} />, onPress: () => navigation.navigate("SettingsStack", { screen: "DeleteAccountScreen" }) },
    { label: "Help Center", icon: <HelpCircle color="#e63600" size={24} />, onPress: () => navigation.navigate("SettingsStack", { screen: "HelpCenterScreen" }) },
    { label: "Logout", icon: <LogOut color="#e63600" size={24} />, onPress: () => clerk.signOut() },
  ];

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        {settingsMenuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            className="flex-row justify-between items-center p-4 border-b border-gray-200"
          >
            <View className="flex-row items-center">
              {item.icon}
              <Text className="ml-4 text-black text-base">{item.label}</Text>
            </View>
            <ChevronRight color="#666" size={24} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SettingsScreen;
