import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types/navigationTypes';
import Header from './Header';
import { Dumbbell } from 'lucide-react-native';
import { useWorkoutData } from '@/contexts/WorkoutDataContext';
import { useWorkoutService } from '@/services/api/endpoints/workout/hooks/useWorkoutService';
import { useUserContext } from '@/contexts/UserContext';
import { ScheduledWorkout, Workout } from '@/services/api/endpoints/workout/types/workout.types';
import { debounce } from 'lodash';
import ScheduleWorkoutModal from './ScheduleWorkoutModal';

type ScheduleExistingWorkoutsScreen = NativeStackScreenProps<HomeStackParamList, 'ScheduleExistingWorkoutsScreen'>;

export const ScheduleExistingWorkoutsScreen: React.FC<ScheduleExistingWorkoutsScreen> = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { allUserWorkouts } = useWorkoutData();
  const savedWorkouts = allUserWorkouts.saved;
  const { getSavedWorkouts, createScheduledWorkout } = useWorkoutService();
  const { user } = useUserContext();
  const userId = user?._id;
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const { addScheduledWorkout } = useWorkoutData();

  const abortControllerRef = useRef(new AbortController());

  const fetchSavedWorkouts = useCallback(debounce(async (signal: AbortSignal) => {
    try {
      if (userId) {
        await getSavedWorkouts(userId);
      }
    } catch (error) {
      if (!signal.aborted) {
        console.error('Failed to load workouts:', error);
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, 500), [userId, getSavedWorkouts]);

  useEffect(() => {
    if (!userId) {
      console.error('User ID is missing');
      return;
    }
    const controller = abortControllerRef.current;
    if (!savedWorkouts?.length) {
      fetchSavedWorkouts(controller.signal);
    } else {
      setIsLoading(false);
    }

    return () => {
      controller.abort();
      fetchSavedWorkouts.cancel(); // Cancel the debounced function
    };
  }, [fetchSavedWorkouts, savedWorkouts]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    fetchSavedWorkouts(controller.signal);
  }, [fetchSavedWorkouts]);


  const handleTimeSelect = (hours: number, minutes: number) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(hours, minutes, 0, 0); // Preserve the date part, only update time
    setSelectedDate(newDate);
  };

  const handleConfirmSchedule = async (utcDateTime: string) => {
    if (!selectedWorkout) return;

    setModalVisible(false);

    let aux = selectedWorkout as ScheduledWorkout;
    aux.scheduled_date_time = utcDateTime; // Use datetime from modal

    try {
      const createdWorkout = await createScheduledWorkout(aux);
      addScheduledWorkout(aux);
      console.log('Scheduled for:', aux.scheduled_date_time, 'Workout:', aux.routineName);
    } catch (error) {
      console.error('Error scheduling workout:', error);
    }
  };

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => {
        setSelectedWorkout(item);
        setModalVisible(true);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.workoutHeader}>
        <View style={[styles.iconContainer, { backgroundColor: '#f8f8f8' }]}>
          <Dumbbell size={20} color="#ee4444" />
        </View>
        <Text style={styles.workoutName}>{item.routineName}</Text>
      </View>
      <View style={styles.workoutDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailText}>{item.created_at}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Loading workouts...</Text>
      </SafeAreaView>
    );
  }

  if (!savedWorkouts || savedWorkouts.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>No saved workouts found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <LinearGradient
        colors={['#ffffff', '#f8f8f8']}
        style={styles.container}
      >
        <Header
          title="Saved Workouts"
          subtitle="Choose from your previous workouts"
        />

        <FlatList
          data={savedWorkouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item._id!}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#ee4444']}
              tintColor={'#ee4444'}
            />
          }
        />

        <ScheduleWorkoutModal
          isVisible={isModalVisible}
          initialDate={new Date()} // Pass current date as initial
          onConfirmSchedule={handleConfirmSchedule} // Now expects a UTC string
          onClose={() => {
            setModalVisible(false);
            setSelectedWorkout(null);
          }}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: isIOS ? 0 : StatusBar.currentHeight,
  },
  container: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    paddingTop: isIOS ? 40 : 20,
  },
  listContent: {
    paddingBottom: 30,
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#2D2D2D',
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  typePill: {
    borderRadius: 10,
    backgroundColor: '#ee4444',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  typePillText: {
    color: '#fff',
    fontSize: 14,
  },
});
