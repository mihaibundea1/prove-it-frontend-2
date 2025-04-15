// FitnessGoals.tsx - Main dashboard component
import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity 
} from "react-native";
import { format } from "date-fns";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList, ProfileStackParamList } from "@/navigation/types/navigationTypes";

// Create a composite type combining ProfileStack and Tab navigator types.
type FitnessGoalsNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>, // adjust key if needed
  NativeStackNavigationProp<ProfileStackParamList>
>;
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
  fitnessGoals: Goal[] | [];
  navigation: any;
}

const FitnessGoals: React.FC<Props> = ({ fitnessGoals }) => {
  const navigation = useNavigation<FitnessGoalsNavigationProp>();

  const transformGoals = (goals: Goal[]): Goal[] => {
    return goals.map(goal => ({
      ...goal,
      progress: (goal.current / goal.target) * 100
    }));
  };

  fitnessGoals = transformGoals(fitnessGoals);

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

  return (
    <View className="mb-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-xl font-semibold text-gray-800">My Goals</Text>
        <TouchableOpacity onPress={() => navigation.navigate({ name: "AllGoalsScreen" } as never)}>
        <Text className="text-[#ee4444] font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pb-2"
        contentContainerStyle={{ paddingRight: 24 }}
      >
        {fitnessGoals.length > 0 ? (
          fitnessGoals.map((goal) => (
            <View
              key={goal.goal_id}
              className="mr-4 p-4 bg-white rounded-2xl w-64 shadow-sm"
              style={{ 
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2
              }}
            >
              {/* Goal Header */}
              <View className="flex-row justify-between items-center mb-3">
                <Text className="font-semibold text-gray-800 flex-1 text-base">
                  {goal.name}
                </Text>
                <Text className="text-sm font-medium text-gray-900 ml-2">
                  {goal.current}
                  <Text className="text-gray-500">/{goal.target}{goal.unit}</Text>
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <View
                  className="h-full rounded-full"
                  style={{ 
                    width: `${Math.min(100, calculateProgress(goal))}%`,
                    backgroundColor: calculateProgress(goal) >= 100 ? "#34C759" : "#007AFF" 
                  }}
                />
              </View>

              {/* Progress Text */}
              <Text className="text-xs text-gray-500 text-right mb-4">
                {Math.round(calculateProgress(goal))}% Completed
              </Text>

              {/* Target Date */}
              <View className="flex-row items-center pt-1 border-t border-gray-100">
                <Text className="text-xs text-gray-500 mt-2">
                  Target: {safeFormatDate(goal.target_day)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-6 px-4 bg-gray-50 rounded-2xl mr-4 w-64">
            <Text className="text-gray-400 text-base mb-3">No goals yet</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate({ name: "AllGoalsScreen" } as never)}
              className="bg-[#007AFF] px-4 py-2 rounded-full"
            >
              <Text className="text-white font-medium">Create Goal</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FitnessGoals;
