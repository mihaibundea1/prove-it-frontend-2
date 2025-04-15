import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Calendar, Filter, Search } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWorkoutService } from '@/services/api/endpoints/workout/hooks/useWorkoutService';
import WorkoutCard from './components/WorkoutCard';
import { Workout, ScheduledWorkout } from '@/services/api/endpoints/workout/types/workout.types';
import { HomeStackParamList } from '@/navigation/types/navigationTypes';
import { HomeStackScreenProps } from '@/navigation/types/navigationTypes';
import { useWorkoutData } from '@/contexts/WorkoutDataContext';

type WorkoutScreenProps = NativeStackScreenProps<HomeStackParamList, 'SeeYourWorkoutsScreen'>;

export const SeeYourWorkoutsScreen: React.FC<WorkoutScreenProps> = ({ route }) => {
  const { _id : userId } = route.params;
  const { getSavedWorkouts, getScheduledWorkouts, isLoading } = useWorkoutService();
  const [historyData, setHistoryData] = useState<Workout[]>([]); // Saved workouts
  const [scheduledData, setScheduledData] = useState<ScheduledWorkout[]>([]); // Scheduled workouts
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state
  const navigation = useNavigation<HomeStackScreenProps<'SeeYourWorkoutsScreen'>['navigation']>();
  const { allUserWorkouts, refreshWorkouts } = useWorkoutData();
  

  const loadWorkouts = async () => {
    try {
      setHistoryData(allUserWorkouts.saved!);
      setError(null); // Clear error on successful fetch
    } catch (err) {
      setError('Failed to load workouts');
      console.error('API Error:', err);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, [userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshWorkouts();
    loadWorkouts().finally(() => setRefreshing(false));
  }, []);

  // Render header
  const renderHeader = () => (
    <View className="p-4 space-y-4">
      {/* Header content */}
    </View>
  );

  // Render error state
  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">{error}</Text>
        <TouchableOpacity onPress={loadWorkouts} className="mt-4 p-2 bg-gray-200 rounded">
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render empty state
  if (!isLoading && !historyData.length && !scheduledData.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500 text-lg">No workouts found</Text>
      </View>
    );
  }

  // Render main content
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2"
          >
            <ChevronLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900 ml-2">
            Saved Workouts
          </Text>
        </View>
      </View>
      <FlatList
        data={[...historyData, ...scheduledData]} // Merge saved and scheduled workouts
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            onPress={() => navigation.navigate('WorkoutDetailsScreen', { workout: item })}
            onStartPress={() => navigation.navigate('WorkoutScreen', { workout: item })}
          />
        )}
        keyExtractor={(item, index) => (item._id ? item._id.toString() : index.toString())}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#111827"
            title="Pull to refresh..."
            titleColor="#111827"
          />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {isLoading && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </SafeAreaView>
  );
};
