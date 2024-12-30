// services/api/endpoints/workout/WorkoutService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { BaseApiService } from '../../core/BaseApiService';
import { ApiResponse } from '../../core/types/api.types';
import { WORKOUT_ENDPOINTS } from './constants/workout.endpoints';
import { WorkoutState, WorkoutNotification } from './types/workout.types';

export class WorkoutService extends BaseApiService {
  private WORKOUT_NOTIFICATION_ID = 'workout-notification';
  private STORAGE_KEY = 'activeWorkout';

  constructor(getToken?: () => Promise<string | null>) {
    super(WORKOUT_ENDPOINTS.BASE, getToken);
  }

  async loadWorkoutState(): Promise<WorkoutState | null> {
    try {
      const savedWorkout = await AsyncStorage.getItem(this.STORAGE_KEY);
      return savedWorkout ? JSON.parse(savedWorkout) : null;
    } catch (error) {
      console.error('Error loading workout state:', error);
      return null;
    }
  }

  async saveWorkoutState(workout: WorkoutState): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(workout));
    } catch (error) {
      console.error('Error saving workout state:', error);
      throw error;
    }
  }

  async clearWorkoutState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      await this.dismissAllNotifications();
    } catch (error) {
      console.error('Error clearing workout state:', error);
      throw error;
    }
  }

  async showNotification(notification: WorkoutNotification): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: { screen: 'StartWorkoutScreen' },
          sticky: true,
          autoDismiss: false,
        },
        trigger: null,
        identifier: this.WORKOUT_NOTIFICATION_ID,
      });
    } catch (error) {
      console.error('Error showing notification:', error);
      throw error;
    }
  }

  async dismissAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }

  formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}