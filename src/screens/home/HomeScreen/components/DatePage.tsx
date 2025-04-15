// DatePage.tsx
import React from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import { ScheduledWorkout } from '@/services/api/endpoints/workout/types/workout.types';
import DateHeader from './DateHeader';
import WorkoutItem from './WorkoutItem';

interface DatePageProps {
  date: Date;
  workouts: ScheduledWorkout[] | undefined;
  isLoading: boolean;
  onWorkoutPress: (workout: ScheduledWorkout) => void; // Add this prop
  onCheckToggle: (workoutId: string) => void; // Add this prop
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DatePage: React.FC<DatePageProps> = ({
  date,
  workouts,
  isLoading,
  onWorkoutPress,
  onCheckToggle,
}) => {
  // Determine the render state for this date
  const renderState = isLoading
    ? 'loading'
    : workouts
      ? workouts.length === 0
        ? 'noWorkouts'
        : 'workouts'
      : 'noWorkouts';

  return (
    <View className="flex-1 px-5" style={{ width: SCREEN_WIDTH }} key={date.toDateString()}>
      <DateHeader date={date} />

      {renderState === 'loading' ? (
        <Text className="text-lg text-gray-500 text-center mt-5">Loading workouts...</Text>
      ) : renderState === 'noWorkouts' ? (
        <Text className="text-lg text-gray-500 text-center mt-5">Schedule some workouts!</Text>
      ) : (
        <FlatList
          data={workouts}
          renderItem={({ item }) => (
            <WorkoutItem
              workout={item}
              onPress={() => onWorkoutPress(item)} // Pass the onPress handler
              onCheckToggle={() => onCheckToggle(item._id!)} // Pass the onCheckToggle handler with `id`
            />
          )}
          keyExtractor={(item) => item._id?.toString() ?? ''}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
};

export default DatePage;