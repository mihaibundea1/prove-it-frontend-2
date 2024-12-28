import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
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

export const ExerciseHomeScreen: React.FC = () => {
  // Local state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigation = useNavigation();
  
  // Folosim contextul în loc de preloader
  const { 
    exercisesTypes,
    allExercises,
    selectedExercises,
    loadingExercises,
    error,
    toggleExercise,
    applyFilters
  } = useExercises();

  // Filtrăm exercițiile bazat pe search query
  const filteredExercises = useMemo(() => {
    if (!searchQuery) return exercisesTypes;

    return exercisesTypes.filter(exercise =>
      exercise.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exercisesTypes, searchQuery]);

  // Handler pentru selectarea exercițiilor
  const handleExercisePress = useCallback((exercise: Exercise) => {
    toggleExercise(exercise);
  }, [toggleExercise]);

  const handleExerciseInfo = useCallback((exercise: Exercise) => {
    // navigation.navigate('ExerciseDetailsScreen', { exerciseId: exercise.id });
  }, [navigation]);

  // Handler pentru aplicarea filtrelor
  const handleFilterApply = useCallback((newFilters: Filters) => {
    applyFilters(newFilters);
  }, [applyFilters]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <FlatList
        ListHeaderComponent={
          <>
            <Header />
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </>
        }
        data={[{ key: 'content' }]}
        renderItem={() => (
          <ExerciseList
            exercises={filteredExercises}
            selectedExercises={selectedExercises}
            onExercisePress={handleExercisePress}
            onExerciseInfo={handleExerciseInfo}
            onFilterPress={() => setFilterModalVisible(true)}
          />
        )}
        contentContainerStyle={{ paddingBottom: hp(2) }}
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleFilterApply}
        filters={{}} // Reset filters when modal opens
      />

      <OverlayLoading loading={loadingExercises} />

      {error && (
        <View className="absolute bottom-8 left-4 right-4 bg-red-500 p-3 rounded-lg">
          <Text className="text-white">{error}</Text>
        </View>
      )}

      <CreateWorkoutButton 
        selectedCount={selectedExercises.length}
        onPress={() => navigation.navigate('CreateWorkoutScreen' as never)}
      />
    </View>
  );
};