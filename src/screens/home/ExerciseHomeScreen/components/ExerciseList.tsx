import React, { memo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AdjustmentsHorizontalIcon } from "react-native-heroicons/outline";
import { Exercise } from '@/types/exercise.types';
import { ExerciseCard } from './ExerciseCard';

interface ExerciseListProps {
  exercises: Exercise[];
  selectedExercises: Exercise[];
  onExercisePress: (exercise: Exercise) => void;
  onExerciseInfo: (exercise: Exercise) => void;
  onFilterPress: () => void;
}

export const ExerciseList: React.FC<ExerciseListProps> = memo(({
  exercises,
  selectedExercises,
  onExercisePress,
  onExerciseInfo,
  onFilterPress,
}) => {
  const keyExtractor = useCallback((item: Exercise) => 
    item?.id?.toString() || Math.random().toString()
  , []);

  const renderExerciseCard = useCallback(({ item }: { item: Exercise }) => {
    const isSelected = selectedExercises?.some(ex => ex.id === item.id);
    return (
      <ExerciseCard
        exercise={item}
        onPress={() => onExercisePress(item)}
        onInfoPress={() => onExerciseInfo(item)}
        isSelected={isSelected}
      />
    );
  }, [selectedExercises, onExercisePress, onExerciseInfo]);

  if (!exercises?.length) {
    return (
      <View className="mb-12">
        <Text className="text-gray-500 text-center">No exercises available</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mx-4 mb-4">
        <Text className="text-black text-2xl font-semibold">All Exercises</Text>
        <TouchableOpacity
          className="p-2 bg-gray-100 rounded-full"
          onPress={onFilterPress}
        >
          <AdjustmentsHorizontalIcon size={hp(2.5)} color="gray" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={exercises}
        renderItem={renderExerciseCard}
        keyExtractor={keyExtractor}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={7}
        showsVerticalScrollIndicator={true}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
});