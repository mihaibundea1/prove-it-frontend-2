import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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

  const selectedExerciseIds = useMemo(() => 
    new Set(selectedExercises.map(ex => ex.id))
  , [selectedExercises]);

  const renderExerciseCard = useCallback(({ item }: { item: Exercise }) => {
    const isSelected = selectedExerciseIds.has(item.id);
    return (
      <ExerciseCard
        exercise={item}
        onPress={() => onExercisePress(item)}
        onInfoPress={() => onExerciseInfo(item)}
        isSelected={isSelected}
      />
    );
  }, [selectedExerciseIds, onExercisePress, onExerciseInfo]);

  const getItemLayout = useCallback((_ : any, index: number) => ({
    length: hp(8), // Adjust based on your ExerciseCard height
    offset: hp(8) * index,
    index,
  }), []);

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
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={30}
        updateCellsBatchingPeriod={50}
        initialNumToRender={30}
        windowSize={7}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 20 }}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10
        }}
      />
    </View>
  );
});
