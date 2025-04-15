import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  AppState,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, SkipForward, Check, Info, Pen, Trash2, Plus } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, HomeStackScreenProps } from '@/navigation/types/navigationTypes';
import { useNavigation } from '@react-navigation/native';
import { useWorkout } from '@/contexts/WorkoutContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type WorkoutScreenProps = NativeStackScreenProps<HomeStackParamList, 'WorkoutScreen'>;

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({ route }) => {
  const { workout: routine } = route.params;
  const navigation = useNavigation<HomeStackScreenProps<'SeeYourWorkoutsScreen'>['navigation']>();
  const appState = useRef(AppState.currentState);
  const [discardedWorkoutTimestamp, setDiscardedWorkoutTimestamp] = useState<number | null>(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dropAnim = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const waterDropAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // Workout context
  const {
    activeWorkout,
    isWorkoutActive,
    currentDuration,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    endWorkout,
    discardWorkout,
    formatDuration,
  } = useWorkout();

  // Local state
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [finalDuration, setFinalDuration] = useState(0);

  // Memoized current exercise and set
  const currentExercise = useMemo(() => {
    if (!activeWorkout?.exercises?.length) return null;
    return activeWorkout.exercises[currentExerciseIndex] || null;
  }, [activeWorkout, currentExerciseIndex]);

  const currentSet = useMemo(() => {
    if (!currentExercise?.sets?.length) return null;
    return currentExercise.sets[currentSetIndex] || null;
  }, [currentExercise, currentSetIndex]);

  const handleDiscardWorkout = useCallback(() => {
    Alert.alert(
      'Discard Workout',
      'Are you sure you want to discard this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: async () => {
            await discardWorkout();
            setDiscardedWorkoutTimestamp(Date.now());
            navigation.replace('HomeScreen');
          },
        },
      ]
    );
  }, [discardWorkout, navigation]);

  const handleEditWorkout = useCallback(() => {
    if (!activeWorkout) return;
    navigation.navigate('EditWorkoutScreen', { workout: activeWorkout });
  }, [activeWorkout, navigation]);

  // Manual workout start handler
  const handleStartWorkout = useCallback(async () => {
    if (activeWorkout) return;

    try {
      await startWorkout(
        routine?._id || "",
        routine?.routineName || 'Custom Workout',
        routine?.exercises?.map((ex) => ({
          ...ex,
          sets: ex.sets?.map((set) => ({
            weight: set.weight,
            reps: set.reps,
            completed: false,
          })) || [],
        })) || []
      );
    } catch (error) {
      console.error("Failed to start workout:", error);
      Alert.alert('Error', 'Failed to start workout');
    }
  }, [routine, activeWorkout, startWorkout]);

  // Initial fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Completion animation
  const playCompletionAnimation = useCallback(() => {
    dropAnim.setValue(-SCREEN_HEIGHT);
    scaleAnim.setValue(0);
    waterDropAnim.setValue(0);
    overlayAnim.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(dropAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(waterDropAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start(async () => {
      await endWorkout(true);
      setTimeout(() => navigation.replace('HomeScreen'), 100);
    });
  }, [dropAnim, overlayAnim, waterDropAnim, scaleAnim, endWorkout, navigation]);

  // Rest timer logic
  useEffect(() => {
    let restTimer: NodeJS.Timeout;
    if (isResting) {
      restTimer = setInterval(() => {
        setRestTimeRemaining(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }
    return () => clearInterval(restTimer);
  }, [isResting]);

  const proceedToNextSet = useCallback(() => {
    setIsResting(false);
    
    setCurrentSetIndex(prev => {
      if (prev + 1 < (currentExercise?.sets?.length || 0)) return prev + 1;
      
      setCurrentExerciseIndex(exIndex => {
        if (exIndex + 1 < (activeWorkout?.exercises?.length || 0)) return exIndex + 1;
        
        pauseWorkout();
        setFinalDuration(currentDuration);
        setIsWorkoutComplete(true);
        playCompletionAnimation();
        return exIndex;
      });
      return 0;
    });
  }, [currentExercise, activeWorkout, currentDuration, pauseWorkout, playCompletionAnimation]);

  const handleCompleteSet = useCallback(() => {
    if (isResting) {
      setRestTimeRemaining(0);
      setIsResting(false);
      return proceedToNextSet();
    }

    const restSeconds = parseInt(currentExercise?.restTimer?.toString().match(/\d+/)?.[0] || '0', 10);
    restSeconds > 0 ? (setRestTimeRemaining(restSeconds), setIsResting(true)) : proceedToNextSet();
  }, [isResting, currentExercise, proceedToNextSet]);

  const handlePauseResume = useCallback(() => {
    isWorkoutActive ? pauseWorkout() : resumeWorkout();
  }, [isWorkoutActive, pauseWorkout, resumeWorkout]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.View className="flex-1 p-5" style={{ opacity: fadeAnim }}>
        {activeWorkout ? (
          <>
            <View className="items-center mt-5">
              <Text className="text-5xl font-bold text-gray-900">
                {formatDuration(isWorkoutComplete ? finalDuration : currentDuration)}
              </Text>
              <Text className="text-lg text-gray-500 mt-1">Workout Time</Text>
            </View>

            <TouchableOpacity
              onPress={handleEditWorkout}
              className="mt-6 p-5 bg-gray-100 rounded-xl flex-row justify-between items-center"
            >
              <View>
                <Text className="text-xl font-bold text-gray-900">
                  {activeWorkout.routineName}
                </Text>
                <Text className="text-gray-500 mt-1">Tap to edit workout</Text>
              </View>
              <Pen size={wp('6%')} color="#E63600" />
            </TouchableOpacity>

            {activeWorkout.exercises?.length > 0 ? (
              <View className="mt-6 p-5 bg-gray-200 rounded-xl">
                <View className="flex-row justify-between items-center">
                  <Text className="text-2xl font-bold text-gray-900">
                    {currentExercise?.exercise_name || 'Unnamed Exercise'}
                  </Text>
                  {currentExercise?.exercise_id && (
                    <TouchableOpacity onPress={() => navigation.navigate('ExerciseDetailsScreen', {
                      exerciseId: currentExercise.exercise_id,
                    })}>
                      <Info size={wp('6%')} color="#6b7280" />
                    </TouchableOpacity>
                  )}
                </View>
                {currentSet && (
                  <>
                    <Text className="text-lg text-gray-500 mt-2">
                      Set {currentSetIndex + 1} of {currentExercise?.sets?.length}
                    </Text>
                    <Text className="text-xl font-semibold text-red-600 mt-2">
                      {currentSet.weight}kg × {currentSet.reps} reps
                    </Text>
                  </>
                )}
              </View>
            ) : (
              <View className="mt-6 p-5 bg-gray-100 rounded-xl items-center">
                <Text className="text-lg text-gray-500">No exercises in this workout</Text>
              </View>
            )}

            {isResting && (
              <View className="mt-4 p-4 bg-gray-100 rounded-xl items-center mx-4">
                <View className="flex-row items-center justify-center space-x-3">
                  <Text className="text-3xl font-bold text-gray-900">{restTimeRemaining}s</Text>
                  <View className="h-px w-6 bg-gray-300" />
                  <TouchableOpacity className="flex-row items-center p-2" onPress={proceedToNextSet}>
                    <SkipForward color="#E63600" size={wp('5%')} />
                    <Text className="text-red-600 font-semibold ml-1.5" style={{ fontSize: wp('3.8%') }}>
                      Skip
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text className="text-sm text-gray-500 mt-1">Rest Interval</Text>
              </View>
            )}

            <View className="absolute bottom-0 left-0 right-0 bg-white pt-4 pb-8 px-6 border-t border-gray-100">
              <View className="flex-row justify-between items-center">
                <TouchableOpacity onPress={handleDiscardWorkout} className="p-3">
                  <Trash2 size={wp('6%')} color="#E63600" strokeWidth={2.5} />
                </TouchableOpacity>

                <View className="flex-row items-center space-x-6" style={{ marginLeft: wp('2%') }}>
                  <TouchableOpacity onPress={handlePauseResume} className="p-4">
                    {isWorkoutActive ? (
                      <Pause size={wp('6.8%')} color="#E63600" fill="#E63600" strokeWidth={2.5} />
                    ) : (
                      <Play size={wp('6.8%')} color="#E63600" fill="#E63600" strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleCompleteSet}
                    className="rounded-full"
                    style={{ backgroundColor: '#E63600', padding: wp('5.5%'), marginHorizontal: wp('1%') }}
                  >
                    <Check size={wp('7%')} color="white" strokeWidth={2.8} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate('ExerciseHomeScreen')}
                  className="flex-row items-center bg-white rounded-full pr-3 pl-4 py-2"
                >
                  <Text className="text-red-600 font-semibold mr-2" style={{ fontSize: wp('3.8%') }}>
                    Add
                  </Text>
                  <View className="bg-red-100 p-2 rounded-full">
                    <Plus size={wp('5.2%')} color="#E63600" strokeWidth={2.8} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            <TouchableOpacity
              onPress={handleStartWorkout}
              className="bg-red-600 px-8 py-4 rounded-lg items-center justify-center"
            >
              <Text className="text-white text-xl font-bold">Start Workout</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {isWorkoutComplete && (
        <Animated.View style={[styles.completionOverlay, { opacity: overlayAnim }]}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: '#E63600',
                transform: [
                  { translateY: dropAnim },
                  { scale: waterDropAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 3] }) },
                ],
                borderRadius: waterDropAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [SCREEN_WIDTH / 2, 0],
                }),
              },
            ]}
          />
          <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: scaleAnim }}>
            <Text className="text-white text-4xl font-bold text-center mb-4">Workout Complete!</Text>
            <Text className="text-white text-xl text-center opacity-90">
              Great job pushing your limits today
            </Text>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  completionOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WorkoutScreen;