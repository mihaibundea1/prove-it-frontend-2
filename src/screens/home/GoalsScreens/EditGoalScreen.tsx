import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { format } from 'date-fns';
import { useUserContext } from '@/contexts/UserContext';
import { useUserService } from '@/services/api/endpoints/user/hooks/useUserService';

import { HomeStackScreenProps, ProfileStackScreenProps } from '@/navigation/types/navigationTypes';

interface Goal {
  goal_id: string;
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
  route: {
    params: {
      goal: Goal;
    };
  };
}
type EditGoalScreenProps =
| HomeStackScreenProps<"EditGoalScreen">
| ProfileStackScreenProps<"EditGoalScreen">;

export const EditGoalScreen: React.FC<EditGoalScreenProps> = ({ navigation, route }) => {
  const { goal } = route.params;
  const { updateGoal } = useUserService();
  const { user, refreshUser } = useUserContext();
  
  const [currentProgress, setCurrentProgress] = useState(goal.current.toString());
  const [progressAnimation] = useState(new Animated.Value(0));

  // Calculate progress percentage
  const calculateProgress = () => {
    const progress = (parseFloat(currentProgress) / goal.target) * 100;
    return Math.min(progress, 100);
  };

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: calculateProgress(),
      duration: 500,
      useNativeDriver: false
    }).start();
  }, [currentProgress]);

  // Handle goal update
  const handleUpdateGoal = async () => {
    const numericProgress = parseFloat(currentProgress);
  
    if (isNaN(numericProgress) || numericProgress < 0) {
      alert("Please enter a valid progress value.");
      return;
    }
  
    if (!user?._id || !goal.goal_id) {
      alert("Missing user or goal ID.");
      return;
    }
  
    try {
      await updateGoal(user._id, goal.goal_id, {
        current: numericProgress,
        updated_at: new Date().toISOString(), // Ensure timestamp update
      });

      refreshUser();
  
      navigation.goBack();
    } catch (error) {
      console.error("Error updating goal:", error);
      alert("An error occurred. Please try again.");
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
          <Text className="text-[#ee4444] font-medium">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Edit Goal</Text>
        <TouchableOpacity
          onPress={handleUpdateGoal}
          className="bg-[#ee4444] px-3 py-1 rounded-full"
        >
          <Text className="text-white font-medium">Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-6">
          {/* Goal Details */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {goal.name}
            </Text>
            <Text className="text-gray-500 mb-4">
              Target: {goal.target}{goal.unit} by {format(new Date(goal.target_day), "MMM dd, yyyy")}
            </Text>

            {/* Progress Visualization */}
            <View className="mb-4">
              <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <Animated.View
                  className="h-full rounded-full"
                  style={{
                    width: progressAnimation.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%']
                    }),
                    backgroundColor: calculateProgress() >= 100 ? "#34C759" : "#ee4444"
                  }}
                />
              </View>
              <Text className="text-xs text-gray-500 mt-2 text-right">
                {Math.round(calculateProgress())}% Complete
              </Text>
            </View>

            {/* Progress Input */}
            <View className="bg-gray-50 rounded-xl p-4 flex-row items-center">
              <Text className="text-gray-800 mr-3 text-base">Current</Text>
              <TextInput
                value={currentProgress}
                onChangeText={setCurrentProgress}
                keyboardType="numeric"
                className="flex-1 text-gray-800 text-base font-semibold"
                placeholder={`Enter progress (0-${goal.target})`}
              />
              <Text className="text-gray-500 ml-2">{goal.unit}</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};