import React, { useState, useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useExercises } from '@/contexts/ExerciseContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Exercise as WorkoutExercise } from '@/services/api/endpoints/workout/types/workout.types';
import { Exercise } from '@/services/api/endpoints/exercise/types/exercise.types';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ExerciseList } from './components/ExerciseList';
import { FilterModal } from './components/FilterModal';
import { CreateWorkoutButton } from '@/components/shared/CreateWorkoutButton';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { Filters } from './components/types/filter.types';
import { HomeStackScreenProps } from '@/navigation/types/navigationTypes';

export const ExercisesTab: React.FC = () => {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filters>({});

  const navigation = useNavigation<HomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { activeWorkout, addExercisesToWorkout } = useWorkout();
  const {
    allExercises,
    exercisesTypes,
    selectedExercises,
    loadingExercises,
    error,
    toggleExercise,
    applyFilters
  } = useExercises();

  const filterOptionsExercises = exercisesTypes;

  const finalFilteredExercises = useMemo(() => {
    if (!searchQuery) return filterOptionsExercises;
    return filterOptionsExercises.filter(exercise =>
      exercise.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filterOptionsExercises, searchQuery]);

  const isExerciseInActiveWorkout = useCallback((exerciseId: string) => {
    return activeWorkout?.exercises.some(ex => ex.exercise_id === exerciseId) ?? false;
  }, [activeWorkout]);

  const handleExercisePress = useCallback((exercise: Exercise) => {
    if (activeWorkout) {
      if (isExerciseInActiveWorkout(exercise.id)) return;
      
      const nextOrder = activeWorkout.exercises.length
        ? Math.max(...activeWorkout.exercises.map(ex => ex.order)) + 1
        : 1;
      
      const workoutExercise: WorkoutExercise = {
        exercise_id: exercise.id,
        exercise_name: exercise.title,
        order: nextOrder,
        sets: []
      };
      addExercisesToWorkout([workoutExercise]);
    } else {
      toggleExercise(exercise);
    }
  }, [activeWorkout, addExercisesToWorkout, toggleExercise, isExerciseInActiveWorkout]);

  const getIsExerciseSelected = useCallback((exercise: Exercise) => {
    return activeWorkout
      ? isExerciseInActiveWorkout(exercise.id)
      : selectedExercises.some(e => e.id === exercise.id);
  }, [activeWorkout, selectedExercises, isExerciseInActiveWorkout]);

  const handleExerciseInfo = useCallback((exercise: Exercise) => {
    navigation.navigate('ExerciseDetailsScreen', { exerciseId: exercise.id });
  }, [navigation]);

  const handleFilterApply = useCallback((newFilters: Filters) => {
    setActiveFilters(newFilters);
    applyFilters(newFilters);
  }, [applyFilters]);

  const handleButtonPress = useCallback(() => {
    activeWorkout
      ? navigation.navigate('WorkoutScreen', { workout: null })
      : navigation.navigate('CreateWorkoutScreen');
  }, [activeWorkout, navigation]);

  const buttonLabel = activeWorkout ? 'Add to Workout' : 'Create Workout';

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header Section */}
      <View className="pt-4 px-4">
        <Header />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      {/* Scrollable Content Area */}
      <View className="flex-1">
        <ExerciseList
          exercises={finalFilteredExercises}
          isExerciseSelected={getIsExerciseSelected}
          onExercisePress={handleExercisePress}
          onExerciseInfo={handleExerciseInfo}
          onFilterPress={() => setFilterModalVisible(true)}
        />
      </View>

      {/* Bottom Components */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleFilterApply}
        filters={activeFilters}
      />

      {loadingExercises && <LoadingOverlay />}

      {error && (
        <View className="absolute bottom-8 left-4 right-4 bg-red-500 p-3 rounded-lg z-50">
          <Text className="text-white">{error}</Text>
        </View>
      )}

      <CreateWorkoutButton
        selectedCount={activeWorkout?.exercises.length ?? selectedExercises.length}
        onPress={handleButtonPress}
        label={buttonLabel}
      />
    </View>
  );
};