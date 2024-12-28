// services/api/endpoints/exercise/utils/cache.utils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CACHE_CONSTANTS } from '../constants/cache.constants';
import { CachedData } from '../types/cache.types';

export const cacheUtils = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await AsyncStorage.getItem(key);
      if (!cachedData) return null;

      const { data, timestamp }: CachedData<T> = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > CACHE_CONSTANTS.EXPIRY_TIME;

      return isExpired ? null : data;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  },

  async set<T>(key: string, data: T): Promise<void> {
    try {
      const cacheData: CachedData<T> = {
        data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }
};