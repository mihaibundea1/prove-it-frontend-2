import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { CompletedWorkout } from "@/services/api/endpoints/workout/types/workout.types";
import { Workout } from "@/services/api/endpoints/workout/types/workout.types";
import { Goal } from "@/services/api/endpoints/user/types/user.types";

// Root Stack (Top level)
export type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: undefined;
};

// Auth Stack
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  VerifyCode: undefined;
};

// Tab Navigator
export type TabParamList = {
  HomeTab: undefined;
  FeedTab: undefined;
  ProfileTab: { userId: string };
};

// Individual Stack Params for each tab
export type HomeStackParamList = {
  HomeScreen: undefined;
  ExerciseHomeScreen: undefined; // Make sure to import Exercise type
  ExerciseDetailsScreen: { exerciseId: string }; // Make sure to import Exercise type
  CreateWorkoutScreen: undefined; // <-- Added new screen here
  WorkoutScreen: {
    workout?: Workout | null;
  };
  SeeYourWorkoutsScreen: { _id: string };
  WorkoutDetailsScreen: { workout: Workout, schedule?: boolean, previousScreen?: string };
  EditWorkoutScreen: { workout: Workout };
  CreateAIWorkoutScreen: { schedule: boolean };
  WorkoutSwipeModal: undefined;
  ScheduleWorkoutScreen: undefined;
  ScheduleExistingWorkoutsScreen: undefined;
  ScheduleDateTimeScreen: { workoutId: string }; // assuming we pass the workout ID
  // StartWorkoutScreen: undefined;
  QuestionsScreen: undefined;
  // AllWorkoutsScreen: undefined;
  AllGoalsScreen: { navigation: any };
  AddGoalScreen: undefined;
  EditGoalScreen: { goal: Goal };
};

export type FeedStackParamList = {
  FeedScreen: undefined;
  ProfileScreen: { userId: string }; // Use the same screen name as in ProfileStack
  WorkoutScreen: { workout?: Workout }; // Adăugat în FeedStack
  NewPost: undefined;
  SearchScreen: undefined;
  WorkoutDetailsScreen: { workout: Workout, schedule?: boolean, previousScreen?: string };
  AllRecentWorkouts: {workouts: CompletedWorkout[], isMyProfile: boolean};


};

export type ProfileStackParamList = {
  ProfileScreen: { userId: string }; // Pass userId as a parameter
  SettingsStack: { screen: keyof SettingsStackParamList } | undefined;
  WorkoutScreen: { workout?: Workout }; // Adăugat în FeedStack
  AllRecentWorkouts: {workouts: CompletedWorkout[], isMyProfile: boolean};
  AllGoalsScreen: { navigation: any };
  AddGoalScreen: undefined;
  EditGoalScreen: { goal: Goal };
  WorkoutDetailsScreen: { workout: Workout, schedule?: boolean, previousScreen?: string };

};

export type SettingsStackParamList = {
  SettingsScreen: undefined;
  EditProfileScreen: undefined;
  ChangePasswordScreen: undefined;
  NotificationSettingsScreen: undefined;
  PrivacySettingsScreen: undefined;
  SubscriptionScreen: undefined;
  DataExportScreen: undefined;
  LanguageScreen: undefined;
  DeleteAccountScreen: undefined;
  HelpCenterScreen: undefined;
};

// Screen Props Types
export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, Screen>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type TabScreenProps<Screen extends keyof TabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, Screen>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type HomeStackScreenProps<Screen extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, Screen>,
    TabScreenProps<keyof TabParamList>
  >;

export type ProfileStackScreenProps<
  Screen extends keyof ProfileStackParamList
> = NativeStackScreenProps<ProfileStackParamList, Screen>;

// Global declaration for type safety
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
