import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { Exercise } from '@/types/exercise.types';
import { useExercises } from '@/contexts/ExerciseContext';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ExerciseList } from './components/ExerciseList';
import { FilterModal } from './components/FilterModal/index';
import { CreateWorkoutButton } from '@/components/shared/CreateWorkoutButton';
import { OverlayLoading } from '@/components/shared/OverlayLoading';
import { Filters } from '@/services/api/endpoints/exercise/types/exercise.types';
import { HomeStackScreenProps }  from '@/navigation/types/navigationTypes';

export const ExerciseHomeScreen: React.FC = () => {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = useNavigation<HomeStackScreenProps<'HomeScreen'>['navigation']>();


  const {
    exercisesTypes,
    allExercises,
    selectedExercises,
    loadingExercises,
    error,
    toggleExercise,
    applyFilters
  } = useExercises();  

  const filteredExercises = useMemo(() => {
    if (!searchQuery) return allExercises;
    return allExercises.filter(exercise =>
      exercise.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allExercises, searchQuery]);

  const handleExercisePress = useCallback((exercise: Exercise) => {
    toggleExercise(exercise);
  }, [toggleExercise]);

  const handleExerciseInfo = useCallback((exercise: Exercise) => {
    navigation.navigate('ExerciseDetailsScreen', { exerciseId: exercise.id });
  }, [navigation]);

  const handleFilterApply = useCallback((newFilters: Filters) => {
    applyFilters(newFilters);
  }, [applyFilters]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <Header />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Render exercises */}
      <ExerciseList
        exercises={filteredExercises}
        selectedExercises={selectedExercises}
        onExercisePress={handleExercisePress}
        onExerciseInfo={handleExerciseInfo}
        onFilterPress={() => setFilterModalVisible(true)}
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleFilterApply}
        filters={{}}
      />

      <OverlayLoading loading={loadingExercises} />

      {error && (
        <View className="absolute bottom-8 left-4 right-4 bg-red-500 p-3 rounded-lg">
          <Text className="text-white">{error}</Text>
        </View>
      )}

      <CreateWorkoutButton
        selectedCount={selectedExercises.length}
        onPress={() => navigation.navigate('CreateWorkoutScreen')}
      />
    </View>
  );
};
