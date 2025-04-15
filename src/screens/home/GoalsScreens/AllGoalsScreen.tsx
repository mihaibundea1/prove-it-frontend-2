// AllGoalsScreen.tsx - Separate screen to view all goals
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from "react-native";
import { format } from "date-fns";
import { useUserContext } from "@/contexts/UserContext";

interface Goal {
  goal_id: string | null;
  name: string;
  unit: string;
  target: number;
  current: number;
  created_at: Date | string;
  updated_at: Date | string;
  target_day: Date | string;
}

interface Props {
  navigation: any;
}

export const AllGoalsScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useUserContext();
  const fitnessGoals = user?.goals || [];

  // Helper function to calculate progress percentage
  const calculateProgress = (goal: Goal) => (goal.current / goal.target) * 100;

  // Helper function to safely format dates
  const safeFormatDate = (date: Date | string) => {
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  // Helper function to calculate days left
  const getDaysLeft = (targetDate: Date | string) => {
    try {
      const timeDiff = new Date(targetDate).getTime() - Date.now();
      return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    } catch {
      return 0;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Screen Header */}
      <View className="px-6 py-4 border-b border-gray-100 flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="py-1"
        >
          <Text className="text-[#ee4444] font-medium">Back</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold">All Goals</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddGoalScreen")}
          className="bg-[#ee4444] px-3 py-1 rounded-full"
        >
          <Text className="text-white font-medium">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Goals List */}
      <ScrollView className="flex-1 px-6">
        {fitnessGoals.map((goal) => (
          <TouchableOpacity
            key={goal.goal_id}
            onPress={() => navigation.navigate("EditGoalScreen", { goal })}
            className="my-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
              elevation: 1
            }}
          >
            {/* Goal Header */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="font-semibold text-gray-800 text-base">
                {goal.name}
              </Text>
              <View className="bg-gray-50 px-2 py-1 rounded-lg">
                <Text className="text-sm font-medium text-gray-800">
                  {goal.current}/{goal.target}{goal.unit}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, calculateProgress(goal))}%`,
                  backgroundColor: calculateProgress(goal) >= 100 ? "#34C759" : "#007AFF"
                }}
              />
            </View>

            {/* Progress Details */}
            <View className="flex-row justify-between items-center mb-4 mt-1">
              <Text className="text-xs text-gray-500">
                {Math.round(calculateProgress(goal))}% Complete
              </Text>
              <Text className="text-xs text-gray-500">
                {getDaysLeft(goal.target_day)} days left
              </Text>
            </View>

            {/* Dates */}
            <View className="flex-row justify-between pt-2 border-t border-gray-100">
              <Text className="text-xs text-gray-400">
                Created: {safeFormatDate(goal.created_at)}
              </Text>
              <Text className="text-xs text-gray-400">
                Target: {safeFormatDate(goal.target_day)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
