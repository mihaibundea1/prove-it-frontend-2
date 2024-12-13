import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HomeStack from "./stacks/HomeStack";
import ProfileStack from "./stacks/ProfileStack";
import FeedStack from "./stacks/FeedStack";

type BottomTabParamList = {
  HomeTab: undefined;
  FeedTab: undefined;
  ProfileTab: undefined;
};

// Create the Bottom Tab Navigator
const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigator = () => {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: hp(9),
          paddingBottom: hp(1),
          elevation: hp(0),
          shadowOpacity: hp(0),
          backgroundColor: "#FFFFFF",
        },
        tabBarLabelStyle: {
          fontSize: hp(2),
        },
        tabBarActiveTintColor: "#E63600",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={wp(6)} />
          ),
        }}
      />
      <BottomTab.Screen
        name="FeedTab"
        component={FeedStack}
        options={{
          tabBarLabel: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" color={color} size={wp(6)} />
          ),
        }}
      />
      <BottomTab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={wp(6)} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default TabNavigator;
