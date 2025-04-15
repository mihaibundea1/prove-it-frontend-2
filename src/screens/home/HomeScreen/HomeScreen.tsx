import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Button,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QuickActions from './components/QuickActions';
import QuickStats from './components/QuickStats';
import { useUserContext } from '@/contexts/UserContext';
import { useWorkoutData } from '@/contexts/WorkoutDataContext';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { CacheManager } from '@/services/cache/CacheManager';
import WeeklyCalendar from './components/WeeklyCalendar';
import WorkoutSwipeModal from './components/WorkoutSwipeModal';
import ActiveWorkoutMiniCard from '@/components/shared/ActiveWorkoutMiniCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types/navigationTypes';
import FitnessGoals from '@/components/shared/FitnessGoals';
import Achievements from '@/components/shared/Achievements';


type HomeStackNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;


const HomeScreen: React.FC = () => {
  const {
    user,
    isLoading: isUserLoading,
    error,
    refreshUser,
  } = useUserContext();

  const {
    allUserWorkouts,
    refreshWorkouts,
    isRefreshing: isWorkoutsRefreshing,
  } = useWorkoutData();

  const navigation = useNavigation<HomeStackNavigationProp>();

  console.log("user:", user);

  const scheduledWorkouts = allUserWorkouts.scheduled || [];
  const workoutDates = scheduledWorkouts.map(workout => {
    const date = new Date(workout.scheduled_date_time);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const debounceRefresh = (fn: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(fn, 500);
  };

  const handleRefresh = useCallback(() => {
    debounceRefresh(async () => {
      // Refresh both user data and workouts data in parallel
      await Promise.all([
        refreshUser(),
        refreshWorkouts(),
      ]);
    });
  }, [refreshUser, refreshWorkouts]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }, [error]);

  const debugDatabase = async () => {
    await CacheManager.getInstance().debugDatabase();
    console.log("Debugging database...");
  };

  const clearDatabase = async () => {
    await CacheManager.getInstance().clear();
    console.log("Cleared database...");
  };

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  // Determine if any loading is happening
  const isLoading = isUserLoading || isWorkoutsRefreshing;

  // Show loading if still loading or if no user
  if (isUserLoading && !user) {
    return <LoadingOverlay />;
  }

  // Wait one second after user data is loaded, then check questions_completed.
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        if (user.questions_completed === false) {
          console.log("Redirecting to questions screen");
          navigation.reset({
            index: 0,
            routes: [{ name: 'QuestionsScreen' }],
          });
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, navigation]);
  
  const getFormattedAchievements = () => {
  if (!user || !user.achievements) {
    return [];
  }
  
  try {
    return user.achievements.map(achievement => ({
      ...achievement,
      status: achievement.status === 'ACHIEVED' ? 'achieved' as 'achieved' : 'in progress' as 'in progress'
    }));
  } catch (error) {
    console.error('Error formatting achievements:', error);
    return [];
  }
};

// Then replace your Achievements component with:
<Achievements achievements={getFormattedAchievements()} />

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#000000"
            title="Pull to refresh..."
            titleColor="#000000"
          />
        }
      >
        <View className="p-5">
          <Text className="text-3xl font-semibold text-black">Workout Planner</Text>
        </View>

        <WeeklyCalendar onDatePressed={handleDatePress} workoutDates={workoutDates} />
        <View className="p-6">
          <QuickActions _id={user?._id} />
          {/* <QuickStats /> */}
          {/* Uncomment below to debug or clear database if needed
          <Button title="Debug Database" onPress={debugDatabase} color="red" />
          <Button title="Clear Database" onPress={clearDatabase} color="blue" /> */}
          <FitnessGoals
            fitnessGoals={user?.goals?.filter(goal => goal.goal_id !== null) || []}
            navigation={navigation}
          />
			<Achievements achievements={(user?.achievements || []).map(achievement => ({
			  ...achievement,
			  status: achievement.status === 'ACHIEVED' ? 'achieved' : 'in progress'
			}))} 
			/>
        </View>
      </ScrollView>

      {/* Active Workout Mini Card - Floating */}
      <View className="absolute bottom-5 left-4 right-4">
        <ActiveWorkoutMiniCard />
      </View>

      {selectedDate && (
        <WorkoutSwipeModal
          visible={modalVisible}
          initialDate={selectedDate}
          onClose={() => setModalVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
