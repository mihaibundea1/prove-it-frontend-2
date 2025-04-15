// WorkoutSwipeModal.tsx
import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  Modal,
  Dimensions,
  Animated,
  FlatList,
  PanResponder,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/navigation/types/navigationTypes";
import { HomeStackScreenProps } from "@/navigation/types/navigationTypes";
import { useWorkoutService } from "@/services/api/endpoints/workout/hooks/useWorkoutService";
import { useUserContext } from "@/contexts/UserContext";
import { ScheduledWorkout } from "@/services/api/endpoints/workout/types/workout.types";
import { debounce } from "lodash";
import { useWorkoutData } from "@/contexts/WorkoutDataContext";

import Card from "./Card";
import DatePage from "./DatePage";
import ModalHeader from "./ModalHeader";
import ScheduleButton from "./ScheduleButton";

interface WorkoutSwipeModalProps {
  visible: boolean;
  initialDate: Date;
  onClose: () => void;
}

type WorkoutSwipeModal = NativeStackScreenProps<
  HomeStackParamList,
  "WorkoutSwipeModal"
>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const daysBefore = 15;
const daysAfter = 15;
const DRAG_THRESHOLD = 100;

const WorkoutSwipeModal: React.FC<WorkoutSwipeModalProps> = ({
  visible,
  initialDate,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation =
    useNavigation<HomeStackScreenProps<"CreateWorkoutScreen">["navigation"]>();
  const [currentDate, setCurrentDate] = useState(initialDate);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [workoutsCache, setWorkoutsCache] = useState<
    Record<string, ScheduledWorkout[]>
  >({});
  const [loadingDates, setLoadingDates] = useState<Record<string, boolean>>({});
  const { user, refreshUser } = useUserContext();
  const user_id = user?._id;
  const { getScheduledWorkouts, updateScheduledWorkout } = useWorkoutService();
  const { allUserWorkouts } = useWorkoutData();
  const scheduledWorkouts = allUserWorkouts.scheduled;

  const onWorkoutPress = (workout: ScheduledWorkout) => {
    navigation.navigate("WorkoutScreen", { workout: workout });
    onClose();
  };

  const onCheckToggle = async (workoutId: string) => {
    const dateString = currentDate.toDateString();
    
    // Instantaneously update local state
    setWorkoutsCache((prevCache) => {
      const updatedWorkouts = prevCache[dateString].map((workout) => 
        workout._id === workoutId 
          ? { ...workout, completed: !workout.completed } 
          : workout
      );
      
      return {
        ...prevCache,
        [dateString]: updatedWorkouts,
      };
    });
  
    try {
      // Perform server update in background
      await updateScheduledWorkout(workoutId, {
        completed: !workoutsCache[dateString].find(w => w._id === workoutId)?.completed,
      });
      
      // Refresh user data after successful update
      refreshUser();
    } catch (error) {
      // Rollback local state if server update fails
      setWorkoutsCache((prevCache) => {
        const updatedWorkouts = prevCache[dateString].map((workout) => 
          workout._id === workoutId 
            ? { ...workout, completed: !workout.completed } 
            : workout
        );
        
        return {
          ...prevCache,
          [dateString]: updatedWorkouts,
        };
      });
  
      // Optional: Show error to user
      console.error('Failed to update workout', error);
    }
  };

  const debouncedSetCurrentDate = useCallback(
    debounce(
      (date: Date) => {
        setCurrentDate(date);
      },
      300,
      { leading: false, trailing: true }
    ),
    []
  );

  // Cancel debounced calls on unmount
  useEffect(() => {
    return () => {
      debouncedSetCurrentDate.cancel();
    };
  }, [debouncedSetCurrentDate]);

  // Fetch workouts for the selected date
  // const fetchWorkouts = useCallback(
  //   debounce(async (date: Date) => {
  //     const dateString = date.toDateString();

  //     if (workoutsCache[dateString]) {
  //       return; // Already cached, no need to fetch
  //     }

  //     setLoadingDates((prev) => ({ ...prev, [dateString]: true }));
  //     const fetchedWorkouts = await getScheduledWorkouts(user_id ?? '');

  //     console.log("fetchedWorkouts", fetchedWorkouts);

  //     const filteredWorkouts = fetchedWorkouts?.filter(workout => {
  //       const workoutDate = new Date(workout.scheduled_date_time);
  //       return workoutDate.toDateString() === dateString;
  //     }) ?? [];

  //     console.log(filteredWorkouts);

  //     setWorkoutsCache((prevCache) => ({
  //       ...prevCache,
  //       [dateString]: filteredWorkouts,
  //     }));
  //     setLoadingDates((prev) => ({ ...prev, [dateString]: false }));
  //   }, 300),
  //   [workoutsCache, getScheduledWorkouts, user]
  // );

  // useEffect(() => {
  //   if (visible) {
  //     fetchWorkouts(currentDate);
  //   }
  // }, [currentDate, visible, fetchWorkouts]);

  // Update workouts cache when scheduledWorkouts or currentDate changes
  useEffect(() => {
    if (visible && scheduledWorkouts && scheduledWorkouts.length > 0) {
      // Process all dates in the cache
      const newWorkoutsCache: Record<string, ScheduledWorkout[]> = {};

      // Group workouts by date
      scheduledWorkouts.forEach((workout) => {
        const workoutDate = new Date(workout.scheduled_date_time);
        const dateString = workoutDate.toDateString();

        if (!newWorkoutsCache[dateString]) {
          newWorkoutsCache[dateString] = [];
        }

        newWorkoutsCache[dateString].push(workout);
      });

      // Update the cache with all dates at once
      setWorkoutsCache(newWorkoutsCache);
    }
  }, [scheduledWorkouts, visible]);

  // Add this effect to update the UI when current date changes
  useEffect(() => {
    if (visible) {
      // This ensures the current date's workouts will be displayed
      // The data is already in the cache, so no fetch needed
      const dateString = currentDate.toDateString();
      // We can set loading state if needed
      setLoadingDates((prev) => ({ ...prev, [dateString]: false }));
    }
  }, [currentDate, visible]);

  const dates = useMemo(() => {
    const arr: Date[] = [];
    for (let i = -daysBefore; i <= daysAfter; i++) {
      const d = new Date(initialDate);
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [initialDate]);

  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const index = Math.round(value / SCREEN_WIDTH);
      const newDate = dates[index];
      debouncedSetCurrentDate(newDate); // Debounce the date update
    });

    return () => scrollX.removeListener(listener);
  }, [dates, debouncedSetCurrentDate]);

  const handleSchedulePress = () => {
    onClose();
    setTimeout(() => {
      navigation.navigate("ScheduleWorkoutScreen");
    }, 50);
  };

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DRAG_THRESHOLD) {
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: SCREEN_HEIGHT,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onClose();
            slideAnim.setValue(0);
          });
        } else {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const renderPage = useCallback(
    ({ item }: { item: Date }) => {
      const dateString = item.toDateString();
      const cachedWorkouts = workoutsCache[dateString];
      const isLoading = loadingDates[dateString];

      return (
        <DatePage
          date={item}
          workouts={cachedWorkouts}
          isLoading={isLoading}
          onCheckToggle={onCheckToggle}
          onWorkoutPress={onWorkoutPress}
        />
      );
    },
    [workoutsCache, loadingDates]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            justifyContent: "flex-end",
          },
          { opacity: fadeAnim },
        ]}
      >
        <Animated.View
          style={[
            { height: SCREEN_HEIGHT, width: "100%" },
            { transform: [{ translateY: slideAnim }] },
          ]}
          {...panResponder.panHandlers}
        >
          <Card className="flex-1 rounded-t-3xl overflow-hidden">
            <ModalHeader
              onClose={onClose}
              slideAnim={slideAnim}
              fadeAnim={fadeAnim}
            />

            <FlatList
              data={dates}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={daysBefore}
              getItemLayout={(_, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
              })}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderPage}
              decelerationRate="fast"
              snapToInterval={SCREEN_WIDTH}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
            />

            <ScheduleButton onPress={handleSchedulePress} />
          </Card>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default WorkoutSwipeModal;
