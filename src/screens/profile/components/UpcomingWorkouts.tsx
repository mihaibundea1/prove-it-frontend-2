import { ScheduledWorkout } from "@/services/api/endpoints/workout/types/workout.types";
import { format, isMonday } from "date-fns";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  isMyProfile: boolean;
  upcomingWorkouts: ScheduledWorkout[];
}

const UpcomingWorkouts: React.FC<Props> = ({
  upcomingWorkouts,
  isMyProfile,
}) => {
  const formatWorkoutDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      const isToday = new Date().toDateString() === date.toDateString();
      const isTomorrow =
        new Date(
          new Date().setDate(new Date().getDate() + 1)
        ).toDateString() === date.toDateString();

      // Format the day part
      let dayText = format(date, "EEEE"); // Full day name
      if (isToday) dayText = "Today";
      else if (isTomorrow) dayText = "Tomorrow";

      // Format the time part
      const timeText = format(date, "h:mm a"); // e.g., "7:30 PM"

      return { day: dayText, time: timeText };
    } catch (error) {
      return { day: "Unknown", time: "Unknown" };
    }
  };

  return (
    <View className="mb-6 mt-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-800">
          Upcoming Workouts
        </Text>
        <TouchableOpacity>
          <Text className="text-[#E63600] font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {upcomingWorkouts && upcomingWorkouts.length > 0 ? (
          upcomingWorkouts
            .filter(
              (workout) =>
                !workout.completed &&
                new Date(workout.scheduled_date_time) > new Date()
            )
            .sort(
              (a, b) =>
                new Date(a.scheduled_date_time).getTime() -
                new Date(b.scheduled_date_time).getTime()
            )
            .slice(0, 3)
            .map((workout) => {
              const { day, time } = formatWorkoutDateTime(
                workout.scheduled_date_time
              );
              return (
                <View
                  key={workout._id}
                  className="p-4 border-b border-gray-100 flex-row justify-between items-center"
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-[#E63600]/10 items-center justify-center mr-3">
                      <Text>🏋️</Text>
                    </View>
                    <View>
                      <Text className="font-semibold text-gray-800">
                        {workout.routineName}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {day} at {time}
                      </Text>
                    </View>
                  </View>
                  {/* <TouchableOpacity className="bg-[#E63600] px-3 py-1 rounded-full">
                    <Text className="text-white font-medium text-sm">Join</Text>
                  </TouchableOpacity> */}
                </View>
              );
            })
        ) : (
          <View className="p-4">
            <Text className="text-gray-500">
              No upcoming workouts scheduled
            </Text>
          </View>
        )}
        {isMyProfile && (
          <TouchableOpacity className="p-4 flex-row justify-center items-center">
            <View className="w-5 h-5 rounded-full bg-[#E63600] items-center justify-center mr-2">
              <Text className="text-white text-xs">+</Text>
            </View>
            <Text className="text-[#E63600] font-medium">Schedule Workout</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default UpcomingWorkouts;
