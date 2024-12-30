import { Workout as BaseWorkout} from '../../../../types/workout.types';
import { HomeStackScreenProps } from '../../../../navigation/types/navigationTypes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../../navigation/types/navigationTypes';

// Add this type for useNavigation
export type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export interface UserCredentials {
  _id: string;
}

export interface WorkoutHookReturn {
  handleGetWorkoutHistory: (userId: string) => Promise<void>;
  historyData: BaseWorkout[];
  error: Error | null;
}

// Component Props
export interface QuickActionsProps {
  navigation: HomeScreenNavigationProp; // Use the new type here
}

export interface QuickStatsProps {}

export interface WorkoutCardProps {
  workout: BaseWorkout;
  onPress: () => void;
}

export interface WorkoutDetailProps {
  workout: BaseWorkout;
  visible: boolean;
  onClose: () => void;
}

export interface WorkoutHistoryProps {
  workouts?: BaseWorkout[];
}

export interface SetItemProps {
  item: {
    reps: number;
    weight: number;
  };
  index: number;
}

// Screen Props
export type HomeScreenProps = HomeStackScreenProps<'HomeScreen'>;

export type { Workout } from '@/types/workout.types';
