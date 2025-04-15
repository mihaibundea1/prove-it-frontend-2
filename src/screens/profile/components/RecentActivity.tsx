import { ProfileStackParamList } from "@/navigation/types/navigationTypes";
import { CompletedWorkout } from "@/services/api/endpoints/workout/types/workout.types";
import { FeedStackParamList } from "@/navigation/types/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  recentWorkouts: CompletedWorkout[];
  isMyProfile: boolean;
}

const RecentActivity: React.FC<Props> = ({ recentWorkouts, isMyProfile }) => {
  const myNavigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const otherNavigation =
    useNavigation<NativeStackNavigationProp<FeedStackParamList>>();
  const formatRelativeTime = (dateString: string | undefined) => {
    if (!dateString) return "Unknown time"; // Handle undefined case

    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true }); // This will return "5 minutes ago", "2 days ago", etc.
    } catch (error) {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  const viewAllRecentWorkouts = () => {
    if (isMyProfile) {
      myNavigation.navigate("AllRecentWorkouts", {
        workouts: recentWorkouts,
        isMyProfile,
      });
    } else {
      otherNavigation.navigate("AllRecentWorkouts", {
        workouts: recentWorkouts,
        isMyProfile,
      });
    }
  };

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-800">Recent Activity</Text>
        <TouchableOpacity onPress={viewAllRecentWorkouts}>
          <Text className="text-[#E63600] font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {recentWorkouts && recentWorkouts.length > 0 ? (
          [...recentWorkouts] // Create a copy of the array to avoid mutating the original
            .sort((a, b) => {
              // Sort by end_date_time in descending order (newest first)
              const dateA = a.end_date_time
                ? new Date(a.end_date_time).getTime()
                : 0;
              const dateB = b.end_date_time
                ? new Date(b.end_date_time).getTime()
                : 0;
              return dateB - dateA; // This will sort newest dates first
            })
            .slice(0, 3) // Then take the first 3 items
            .map((workout) => (
              <View key={workout._id} className="p-4 border-b border-gray-100">
                {/* Workout item content with fixed layout */}
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center flex-1 mr-3">
                    <View className="w-10 h-10 rounded-full bg-[#E63600]/10 items-center justify-center mr-3">
                      <Text>🔥</Text>
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-semibold text-gray-800"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {workout.routineName}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {formatRelativeTime(workout.end_date_time)}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end min-w-20">
                    <Text className="font-semibold text-gray-800">
                      {workout.volume} cal
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {workout.duration} Min
                    </Text>
                  </View>
                </View>
              </View>
            ))
        ) : (
          <View className="p-4">
            <Text className="text-gray-500">No recent workouts found</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default RecentActivity;
