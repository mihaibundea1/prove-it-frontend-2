import React, { memo, useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  LayoutChangeEvent,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedScrollHandler,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import * as Lucide from 'lucide-react-native';
import { Exercise } from '@/types/exercise.types';
import { ExerciseCard } from './ExerciseCard';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { GestureHandlerGestureEvent } from 'react-native-gesture-handler';


interface ExerciseListProps {
  exercises: Exercise[];
  isExerciseSelected: (exercise: Exercise) => boolean;
  onExercisePress: (exercise: Exercise) => void;
  onExerciseInfo: (exercise: Exercise) => void;
  onFilterPress: () => void;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Exercise>);
const SCROLLBAR_WIDTH = 14; // Increased from 8
const SCROLLBAR_MARGIN = 2; // Increased from 4
const SCROLLBAR_VISIBLE_WIDTH = 12; // Increased from 16
const SCROLLBAR_MIN_HEIGHT = 50; // Added minimum thumb height
const ITEM_HEIGHT = 80;

const MemoizedExerciseCard = memo(({ 
  exercise, 
  isSelected, 
  onPress, 
  onInfoPress 
}: { 
  exercise: Exercise; 
  isSelected: boolean; 
  onPress: () => void; 
  onInfoPress: () => void; 
}) => (
  <ExerciseCard
    exercise={exercise}
    onPress={onPress}
    onInfoPress={onInfoPress}
    isSelected={isSelected}
  />
));

export const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  isExerciseSelected,
  onExercisePress,
  onExerciseInfo,
  onFilterPress,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerTop, setContainerTop] = useState(0);
  const scrollOffset = useSharedValue(0);
  const isScrolling = useSharedValue(false);
  const scrollbarOpacity = useSharedValue(0);
  const scrollbarActive = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
    onBeginDrag: () => {
      isScrolling.value = true;
      scrollbarOpacity.value = withTiming(1);
    },
    onEndDrag: () => {
      isScrolling.value = false;
      scrollbarOpacity.value = withTiming(0, { duration: 500 }); // Change delay to duration
    }    
  });

  const scrollbarStyle = useAnimatedStyle(() => {
    if (contentHeight <= containerHeight) return { opacity: 0 };
  
    const visibleRatio = containerHeight / contentHeight;
    let thumbHeight = containerHeight * visibleRatio;
    thumbHeight = Math.max(SCROLLBAR_MIN_HEIGHT, thumbHeight); // Enforce minimum height
    const maxScroll = contentHeight - containerHeight;
    const thumbPosition = interpolate(
      scrollOffset.value,
      [0, maxScroll],
      [0, containerHeight - thumbHeight]
    );
  
    return {
      opacity: scrollbarOpacity.value,
      height: thumbHeight,
      transform: [{ translateY: thumbPosition }],
    };
  });

  const panGestureHandler = useCallback((event) => {
    'worklet';
    if (contentHeight <= containerHeight) return;
  
    // Get accurate container position
    const touchY = event.y - (SCROLLBAR_MIN_HEIGHT / 2); // Center thumb under finger
    const scrollableRatio = contentHeight / containerHeight;
    const maxScroll = contentHeight - containerHeight;
    
    // Calculate scroll position with thumb centering
    const scrollPosition = Math.min(
      maxScroll,
      Math.max(0, (touchY / containerHeight) * contentHeight)
    );
  
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: scrollPosition,
        animated: false,
      });
    }
  }, [contentHeight, containerHeight, SCROLLBAR_MIN_HEIGHT]);

  const renderItem = useCallback(
    ({ item }: { item: Exercise }) => {
      const isSelected = isExerciseSelected(item);
      return (
        <MemoizedExerciseCard
          exercise={item}
          onPress={() => onExercisePress(item)}
          onInfoPress={() => onExerciseInfo(item)}
          isSelected={isSelected}
        />
      );
    },
    [isExerciseSelected, onExercisePress, onExerciseInfo]
  );

  const handleContentSizeChange = useCallback((_: number, h: number) => {
    setContentHeight(h);
  }, []);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerHeight(event.nativeEvent.layout.height);
    // Measure actual screen position of the container
    event.target.measureInWindow((_, y) => {
      setContainerTop(y);
    });
  }, []);

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
          activeOpacity={0.7}
        >
          <Lucide.SlidersHorizontal size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <View className="flex-1" onLayout={handleContainerLayout}>
        <AnimatedFlatList
          ref={flatListRef}
          data={exercises}
          keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
          renderItem={renderItem}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          onContentSizeChange={handleContentSizeChange}
          removeClippedSubviews
          windowSize={11}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
        />

        <PanGestureHandler
          onGestureEvent={(event) => {
            panGestureHandler(event.nativeEvent);
          }}
          onBegan={() => {
            scrollbarActive.value = true;
            scrollbarOpacity.value = withTiming(1);
          }}
          onEnded={() => {
            scrollbarActive.value = false;
            scrollbarOpacity.value = withTiming(0, { delay: 1000 });
          }}
        >
          <Animated.View
            style={[
              styles.scrollbarTrack,
              {
                height: containerHeight,
                opacity: scrollbarOpacity,
              },
            ]}
          >
            <Animated.View style={[styles.scrollbarThumb, scrollbarStyle]} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollbarTrack: {
    position: 'absolute',
    right: SCROLLBAR_MARGIN,
    top: 0,
    width: SCROLLBAR_VISIBLE_WIDTH,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: SCROLLBAR_WIDTH / 2,
    // Add touch expansion
    paddingVertical: 8,
    marginVertical: -8, // Compensate for padding
  },
  scrollbarThumb: {
    position: 'absolute',
    right: (SCROLLBAR_VISIBLE_WIDTH - SCROLLBAR_WIDTH) / 2,
    width: SCROLLBAR_WIDTH,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: SCROLLBAR_WIDTH / 2,
    // Add subtle shadow for better visibility
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    
  },
});