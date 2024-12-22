import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert, RefreshControl } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import type { Workout } from '@/types/workout.types'; // Import the shared Workout type
import QuickActions from './components/QuickActions';
import QuickStats from './components/QuickStats';
import WorkoutHistory from './components/WorkoutHistory';
// import OverlayLoading from '@/components/OverlayLoading';

interface WorkoutHookReturn {
  handleGetWorkoutHistory: (userId: string) => Promise<void>;
  historyData: Workout[]; // Use the imported Workout type
  error: Error | null;
}

const useWorkout = (): WorkoutHookReturn => {
  // Mock implementation of the workout hook
  return {
    handleGetWorkoutHistory: async (userId: string) => {
      console.log('Fetching workout history for user:', userId);
    },
    historyData: [], // This should return proper Workout[] data
    error: null
  };
};

const HomeScreen: React.FC = () => {
  const { userId } = useAuth();
  const { handleGetWorkoutHistory, historyData, error } = useWorkout();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      handleGetWorkoutHistory(userId)
        .finally(() => setLoading(false));
    }
  }, [userId]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', 'Failed to fetch workout history. Please try again.');
    }
  }, [error]);

  const onRefresh = useCallback(() => {
    if (userId) {
      setRefreshing(true);
      handleGetWorkoutHistory(userId)
        .finally(() => setRefreshing(false));
    }
  }, [handleGetWorkoutHistory, userId]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* <OverlayLoading loading={loading} /> */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000000"
            title="Pull to refresh..."
            titleColor="#000000"
          />
        }
      >
        <View className="p-6">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-3xl font-semibold text-black">Workout Planner</Text>
          </View>
          
          <QuickActions />
          <QuickStats />
          <WorkoutHistory workouts={historyData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;