import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { WorkoutHistoryProps, Workout, HomeScreenNavigationProp } from '../types';
import WorkoutCard from './WorkoutCard';
import WorkoutDetail from './WorkoutDetail';

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ workouts = [] }) => {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const recentWorkouts = workouts.slice(0, 3);

  const renderEmptyState = () => (
    <View className="bg-gray-50 rounded-xl p-6 items-center justify-center">
      <AlertCircle size={48} color="#9CA3AF" />
      <Text className="text-gray-500 mt-3 text-center">
        No workout history available
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Recent Workouts
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AllWorkoutsScreen')}
            className="bg-gray-100 px-4 py-2 rounded-lg"
          >
            <Text className="text-gray-900 font-medium">View All</Text>
          </TouchableOpacity>
        </View>

        {recentWorkouts.length === 0 ? (
          renderEmptyState()
        ) : (
          <View>
            {recentWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id} // Handle both ID formats
                workout={workout}
                onPress={() => setSelectedWorkout(workout)}
              />
            ))}
          </View>
        )}
      </View>

      {selectedWorkout && (
        <WorkoutDetail
          workout={selectedWorkout}
          visible={!!selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
    </SafeAreaView>
  );
};

export default WorkoutHistory;