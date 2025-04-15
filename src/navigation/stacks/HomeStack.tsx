import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/screens/home/HomeScreen/HomeScreen';
import { ExerciseHomeScreen } from '@/screens/home/ExerciseHomeScreen/ExerciseHomeScreen';
import ExerciseDetailsScreen from '@/screens/home/ExerciseDetailsScreen/ExerciseDetailsScreen';
import { ExerciseProvider } from '@/contexts/ExerciseContext';
import { HomeStackParamList } from '@/navigation/types/navigationTypes';
import { CreateWorkoutScreen } from '@/screens/workout/CreateWorkoutScreen/CreateWorkoutScreen';
import { WorkoutScreen } from '@/screens/workout/WorkoutScreen/index';
import { SeeYourWorkoutsScreen } from '@/screens/workout/SeeYourWorkoutsScreen/index';
import { WorkoutDetailsScreen } from '@/screens/workout/WorkoutDetailsScreen/index';
import { EditWorkoutScreen } from '@/screens/workout/EditWorkoutScreen';
import { ScheduleWorkoutScreen } from '@/screens/workout/ScheduleWorkoutScreen';
import { ScheduleExistingWorkoutsScreen } from '@/screens/workout/ScheduleWorkoutScreen/components/ScheduleExistingWorkoutsScreen';
import { QuestionsScreen } from '@/screens/questions/QuestionsScreen';
import CreateAIWorkoutScreen from '@/screens/aiWorkout/CreateAIWorkoutScreen/CreateAIWorkoutScreen';
import { useUserContext } from '@/contexts/UserContext'; // Importă contextul pentru a verifica starea întrebărilor
import { AllGoalsScreen } from '@/screens/home/GoalsScreens/AllGoalsScreen';
import { AddGoalScreen } from '@/screens/home/GoalsScreens/AddGoalScreen';
import { EditGoalScreen } from '@/screens/home/GoalsScreens/EditGoalScreen';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  const { user } = useUserContext(); // Access the user context
  const [initialRoute, setInitialRoute] = useState<keyof HomeStackParamList | null>(null); // Set initial route to null

  useEffect(() => {
    if (user) {
      if (!user.questions_completed) {
        setInitialRoute("QuestionsScreen");
      } else {
        setInitialRoute("HomeScreen");
      }
    }
  }, [user]); // Run effect when `user` changes

  // Ensure navigator renders only when initialRoute is set
  if (initialRoute === null) {
    return null; // Prevent rendering until initialRoute is set
  }

  return (
    <ExerciseProvider>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ExerciseHomeScreen" component={ExerciseHomeScreen} />
        <Stack.Screen name="ExerciseDetailsScreen" component={ExerciseDetailsScreen} />
        <Stack.Screen name="CreateWorkoutScreen" component={CreateWorkoutScreen} />
        <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
        <Stack.Screen name="SeeYourWorkoutsScreen" component={SeeYourWorkoutsScreen} />
        <Stack.Screen name="WorkoutDetailsScreen" component={WorkoutDetailsScreen} />
        <Stack.Screen name="EditWorkoutScreen" component={EditWorkoutScreen} />
        <Stack.Screen name="CreateAIWorkoutScreen" component={CreateAIWorkoutScreen} />
        <Stack.Screen name="ScheduleWorkoutScreen" component={ScheduleWorkoutScreen} />
        <Stack.Screen name="ScheduleExistingWorkoutsScreen" component={ScheduleExistingWorkoutsScreen} />
        <Stack.Screen name="QuestionsScreen" component={QuestionsScreen} />
        <Stack.Screen name="AllGoalsScreen" component={AllGoalsScreen} />
        <Stack.Screen name="AddGoalScreen" component={AddGoalScreen} />
        <Stack.Screen name="EditGoalScreen" component={EditGoalScreen} />
      </Stack.Navigator>
    </ExerciseProvider>
  );
};



export default HomeStack;