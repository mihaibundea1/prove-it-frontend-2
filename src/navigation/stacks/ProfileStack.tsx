import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../screens/profile/ProfileScreen";
import SettingsStack from "./SettingsStack";
import {
  ProfileStackParamList,
  TabParamList,
} from "@/navigation/types/navigationTypes";
import { RouteProp } from "@react-navigation/native";
import { WorkoutScreen } from "../../screens/workout/WorkoutScreen/index";
import AllRecentWorkouts from "@/screens/profile/AllRecentWorkouts";
import { AllGoalsScreen } from '@/screens/home/GoalsScreens/AllGoalsScreen';
import { AddGoalScreen } from '@/screens/home/GoalsScreens/AddGoalScreen';
import { EditGoalScreen } from "@/screens/home/GoalsScreens/EditGoalScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

// Define correct props type
type ProfileStackProps = {
  route?: RouteProp<TabParamList, "ProfileTab">;
};

const ProfileStack: React.FC<ProfileStackProps> = ({ route }) => {
  // Get the userId from route.params
  const initialParams = route?.params;

  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: true }}
        initialParams={initialParams}
      />
      <Stack.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
      <Stack.Screen
        name="AllRecentWorkouts"
        component={AllRecentWorkouts}
        options={{ title: "All Recent Workouts", headerShown: true }}
      />

      <Stack.Screen
        name="AllGoalsScreen"
        component={AllGoalsScreen}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="AddGoalScreen"
        component={AddGoalScreen}
        options={{ headerShown: false }} />

      <Stack.Screen
        name="EditGoalScreen"
        component={EditGoalScreen}
        options={{ headerShown: false }} />

    </Stack.Navigator>
  );
};

export default ProfileStack;
