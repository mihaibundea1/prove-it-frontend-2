import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { Exercise } from '@/types/exercise.types';
import { useExercisePreloader } from '@/services/api/endpoints/exercise/hooks/useExercisePreloader';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ExerciseList } from './components/ExerciseList';
import { FilterModal } from './components/FilterModal';
import { CreateWorkoutButton } from '@/components/shared/CreateWorkoutButton';
import { OverlayLoading } from '@/components/shared/OverlayLoading';
import { Filters } from './types/exercise.types';

export const ExerciseHomeScreen: React.FC = () => {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filters>({});
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  const navigation = useNavigation();
  const { loadExercises, exercises, loading: loadingExercises, error } = useExercisePreloader();

  const filteredExercises = useMemo(() => {
    if (!Array.isArray(exercises)) {
      return [];
    }

    let filtered = [...exercises];

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value) return;
      
      filtered = filtered.filter(exercise => {
        const exerciseValue = exercise[key as keyof Exercise]?.toString().toLowerCase();
        return exerciseValue === value.toLowerCase();
      });
    });

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(exercise =>
        exercise.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [exercises, activeFilters, searchQuery]);

  const handleExercisePress = useCallback((exercise: Exercise) => {
    setSelectedExercises(prev => {
      const isSelected = prev.some(ex => ex.id === exercise.id);
      if (isSelected) {
        return prev.filter(ex => ex.id !== exercise.id);
      }
      return [...prev, exercise];
    });
  }, []);

  const handleExerciseInfo = useCallback((exercise: Exercise) => {
    // navigation.navigate('ExerciseDetailsScreen');
  }, [navigation]);

  const handleFilterApply = useCallback((newFilters: Filters) => {
    setActiveFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

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
        filters={activeFilters}
        onApplyFilters={handleFilterApply}
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