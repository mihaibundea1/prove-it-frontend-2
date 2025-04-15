import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { ChevronLeft, Play, Calendar } from "lucide-react-native";
import {
  useNavigation,
  NavigationProp,
  StackActions,
  useFocusEffect,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ExerciseCard from "./components/ExerciseCard";
import WorkoutSummary from "./components/WorkoutSummary";
import VolumeChart from "./components/VolumeChart";
import { HomeStackParamList } from "@/navigation/types/navigationTypes";
import ScheduleWorkoutModal from "../ScheduleWorkoutScreen/components/ScheduleWorkoutModal";
import { useWorkoutService } from "@/services/api/endpoints/workout/hooks/useWorkoutService";
import {
  ScheduledWorkout,
  Workout,
} from "@/services/api/endpoints/workout/types/workout.types";
import { useWorkoutData } from "@/contexts/WorkoutDataContext";
import { useUserContext } from "@/contexts/UserContext";

type Props = NativeStackScreenProps<HomeStackParamList, "WorkoutDetailsScreen">;

export const WorkoutDetailsScreen: React.FC<Props> = ({ route }) => {
  const { workout, schedule } = route.params;
  const previousScreen = route.params?.previousScreen || "HomeScreen";
  const navigation =
    useNavigation<NavigationProp<HomeStackParamList, "WorkoutScreen">>();
  const { user } = useUserContext();
  const { createScheduledWorkout } = useWorkoutService();
  const { addScheduledWorkout } = useWorkoutData();

  // Modal and scheduling state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calculate workout summary
  const totalVolume = workout.exercises.reduce((acc, exercise) => {
    return (
      acc +
      (exercise.sets?.reduce(
        (setAcc, set) => setAcc + set.weight * set.reps,
        0
      ) || 0)
    );
  }, 0);

  const totalSets = workout.exercises.reduce(
    (acc, exercise) => acc + (exercise.sets?.length || 0),
    0
  );

  const handleStartWorkout = () => {
    navigation.navigate("WorkoutScreen", {
      workout: {
        _id: " ",
        ...workout,
      },
    });
  };

  const handleConfirmSchedule = async (utcDateTime: string) => {
    try {
      const scheduledWorkout: ScheduledWorkout = {
        user_id: user!._id,
        ...workout,
        scheduled_date_time: utcDateTime, // Use the UTC datetime from the modal
        completed: false,
      };

      const createdWorkout = await createScheduledWorkout(scheduledWorkout);

      if (createdWorkout && createdWorkout.scheduled_date_time) {
        addScheduledWorkout(createdWorkout);
      }

      console.log(
        "Scheduled for:",
        utcDateTime,
        "Workout:",
        workout.routineName
      );
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error scheduling workout:", error);
    }
  };

  const handleScheduleWorkout = () => {
    setSelectedDate(new Date()); // Reset to current date/time when opening modal
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => {
              if (previousScreen === "MyRecentActivity") {
                navigation.navigate("ProfileTab");

                if (navigation.canGoBack()) {
                  navigation.dispatch(StackActions.pop(1));
                }
              } else if (previousScreen === "OthersRecentActivity") {
                navigation.navigate("FeedTab");

                if (navigation.canGoBack()) {
                  navigation.dispatch(StackActions.pop(1));
                }
              } else {
                navigation.goBack();
              }
            }}
            className="p-2"
          >
            <ChevronLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900 ml-2">
            Workout Details
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <View className="p-4">
          <WorkoutSummary
            workout={workout}
            totalVolume={totalVolume}
            totalSets={totalSets}
          />
          <VolumeChart workout={workout} />

          <Text className="text-xl font-semibold text-gray-900 mb-4">
            Exercises
          </Text>
          {workout.exercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} />
          ))}
        </View>
      </ScrollView>

      {/* Floating Button */}
      {previousScreen === "HomeScreen" && (
        <TouchableOpacity
          onPress={schedule ? handleScheduleWorkout : handleStartWorkout}
          className="absolute bottom-6 right-6 p-5 rounded-full shadow-lg flex-row items-center"
          style={{
            backgroundColor: "#DC2626",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          {schedule ? (
            <Calendar size={24} color="white" />
          ) : (
            <Play size={24} color="white" />
          )}
          <Text className="text-white font-semibold ml-2">
            {schedule ? "Schedule" : "Start Workout"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Schedule Modal */}
      <ScheduleWorkoutModal
        isVisible={isModalVisible}
        initialDate={selectedDate}
        onConfirmSchedule={handleConfirmSchedule}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
};
