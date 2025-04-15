import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "@/contexts/UserContext";
import { useUserService } from "@/services/api/endpoints/user/hooks/useUserService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/navigation/types/navigationTypes";
import { format } from "date-fns";

// Define navigation type
type AddGoalScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "HomeScreen"
>;

interface GoalToAdd {
  name: string;
  unit: string;
  target: number;
  target_day: Date;
}

const UNITS = ["kg", "workouts", "days", "km", "miles", "calories", "minutes", "hours"];

export const AddGoalScreen: React.FC = () => {
  const { user } = useUserContext();
  const { createGoal } = useUserService();
  const navigation = useNavigation<AddGoalScreenNavigationProp>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newGoal, setNewGoal] = useState<GoalToAdd>({
    name: "",
    unit: UNITS[0],
    target: 1,
    target_day: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days from now
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handler for the date picker change event
  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios"); // on Android, always hide after selection
    if (selectedDate) {
      setNewGoal((prev) => ({ ...prev, target_day: selectedDate }));
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.name.trim()) {
      Alert.alert("Missing Information", "Please enter a goal name");
      return;
    }
    if (!newGoal.target || isNaN(newGoal.target) || newGoal.target <= 0) {
      Alert.alert("Invalid Target", "Please enter a valid target value");
      return;
    }
    try {
      setIsSubmitting(true);
      console.log("user", user);
      if (user?._id) {
        console.log("newGoal", newGoal);
        await createGoal(user._id, newGoal);
      } else {
        Alert.alert("Error", "User not found. Please try again.");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to add goal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-6 py-4 border-b border-gray-100 flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
            className="py-1"
          >
            <Text className="text-[#ee4444] font-medium">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold">New Goal</Text>
          <TouchableOpacity
            onPress={handleAddGoal}
            disabled={isSubmitting || !newGoal.name.trim() || !newGoal.target}
            className={`px-3 py-1 rounded-full ${
              !isSubmitting && newGoal.name.trim() && newGoal.target
                ? "bg-[#ee4444]"
                : "bg-gray-200"
            }`}
          >
            <Text
              className={`font-medium ${
                !isSubmitting && newGoal.name.trim() && newGoal.target
                  ? "text-white"
                  : "text-gray-500"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Goal Name */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Goal Name</Text>
            <TextInput
              value={newGoal.name}
              onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
              placeholder="e.g., Lose Weight, Run 5K"
              className="p-4 border border-gray-200 rounded-xl text-base bg-white"
              placeholderTextColor="#9CA3AF"
              autoFocus
            />
          </View>

          {/* Target Value */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Target Value</Text>
            <TextInput
              value={newGoal.target.toString()}
              onChangeText={(text) =>
                setNewGoal({
                  ...newGoal,
                  target: Number(text.replace(/[^0-9.]/g, "")),
                })
              }
              placeholder="Enter your target"
              keyboardType="numeric"
              className="p-4 border border-gray-200 rounded-xl text-base bg-white"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Unit Selection */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Unit</Text>
            <View className="flex-row flex-wrap">
              {UNITS.map((unit) => (
                <TouchableOpacity
                  key={unit}
                  onPress={() => setNewGoal({ ...newGoal, unit })}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                    newGoal.unit === unit ? "bg-[#ee4444]" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      newGoal.unit === unit ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Target Date */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Target Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="p-4 border border-gray-200 rounded-xl bg-white"
            >
              <Text className="text-base text-gray-800">
                {format(newGoal.target_day, "yyyy-MM-dd")}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newGoal.target_day}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeDate}
                minimumDate={new Date()}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddGoalScreen;
