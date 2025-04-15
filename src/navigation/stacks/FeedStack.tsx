// src/navigation/stacks/FeedStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedScreen from "../../screens/feed/FeedScreen";
import NewPostScreen from "../../screens/feed/NewPostScreen";
import ProfileScreen from "@/screens/profile/ProfileScreen";
import SearchScreen from "@/screens/feed/SearchScreen";
import { FeedStackParamList } from "@/navigation/types/navigationTypes";
import { FeedProvider } from "../../contexts/FeedContext";
import { WorkoutScreen } from "../../screens/workout/WorkoutScreen/index";
import { WorkoutDetailsScreen } from "@/screens/workout/WorkoutDetailsScreen";
import AllRecentWorkouts from "@/screens/profile/AllRecentWorkouts";

const Stack = createNativeStackNavigator<FeedStackParamList>();

const FeedStack = () => {
  return (
    <FeedProvider>
      <Stack.Navigator
        initialRouteName="FeedScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="FeedScreen" component={FeedScreen} />
        <Stack.Screen name="NewPost" component={NewPostScreen} />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerTitle: "Profile" }}
        />
        <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
        <Stack.Screen
          name="AllRecentWorkouts"
          component={AllRecentWorkouts}
          options={{ title: "All Recent Workouts", headerShown: true }}
        />
        <Stack.Screen
          name="WorkoutDetailsScreen"
          component={WorkoutDetailsScreen}
        />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
      </Stack.Navigator>
    </FeedProvider>
  );
};

export default FeedStack;
