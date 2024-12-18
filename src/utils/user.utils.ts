// src/utils/user.utils.ts
import { User } from '../types/user.types';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const USER_STORAGE_KEY = 'user_data';

export const userUtils = {
  validateUserData(userData: unknown): userData is User {
    if (!userData || typeof userData !== 'object') return false;
    
    const requiredFields: (keyof User)[] = ['_id', 'email', 'username'];
    return requiredFields.every(field => 
      field in userData && 
      typeof (userData as any)[field] === 'string' &&
      (userData as any)[field].length > 0
    );
  },

  formatUserData(data: any): User {
    return {
      _id: data._id,
      email: data.email,
      username: data.username,
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      followersCount: data.followersCount || 0,
      followingCount: data.followingCount || 0,
      postCount: data.postCount || 0,
      bio: data.bio || undefined,
      answers: data.answers || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  },

  async persistUserData(userData: User | null): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (userData) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        } else {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      } else {
        if (userData) {
          await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(userData));
        } else {
          await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error persisting user data:', error);
    }
  },

  async getStoredUserData(): Promise<User | null> {
    try {
      let stored: string | null;
      
      if (Platform.OS === 'web') {
        stored = localStorage.getItem(USER_STORAGE_KEY);
      } else {
        stored = await SecureStore.getItemAsync(USER_STORAGE_KEY);
      }

      if (!stored) return null;
      
      const userData = JSON.parse(stored);
      return userUtils.validateUserData(userData) ? userData : null;
    } catch (error) {
      console.error('Error getting stored user data:', error);
      return null;
    }
  },
  // Helper pentru a verifica dacă un user a completat chestionarul
  hasCompletedQuestionnaire(user: User): boolean {
    return Boolean(
      user.answers &&
      user.answers.version &&
      Object.keys(user.answers.responses).length > 0
    );
  }
};