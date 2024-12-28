// utils/cache.utils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CACHE_CONSTANTS } from '../constants/cache.constants';

const CHUNK_SIZE = 400 * 1024; // 400KB per chunk

export const cacheUtils = {
  async get<T>(key: string): Promise<T | null> {
    try {
      // Verificăm dacă există chunk-uri
      const chunkCountStr = await AsyncStorage.getItem(`${key}_chunk_count`);
      
      if (!chunkCountStr) {
        // Nu există chunk-uri, încercăm să citim direct
        const data = await AsyncStorage.getItem(key);
        if (!data) return null;
        
        const parsed = JSON.parse(data);
        const isExpired = Date.now() - parsed.timestamp > CACHE_CONSTANTS.EXPIRY_TIME;
        
        return isExpired ? null : parsed.data;
      }

      // Avem chunk-uri, le reconstituim
      const chunkCount = parseInt(chunkCountStr, 10);
      let fullData = '';
      
      for (let i = 0; i < chunkCount; i++) {
        const chunk = await AsyncStorage.getItem(`${key}_chunk_${i}`);
        if (!chunk) throw new Error(`Missing chunk ${i}`);
        fullData += chunk;
      }

      const parsed = JSON.parse(fullData);
      const isExpired = Date.now() - parsed.timestamp > CACHE_CONSTANTS.EXPIRY_TIME;
      
      return isExpired ? null : parsed.data;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  },

  async set<T>(key: string, data: T): Promise<void> {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };

      const serializedData = JSON.stringify(cacheData);

      // Dacă datele sunt prea mari, le împărțim în chunk-uri
      if (serializedData.length > CHUNK_SIZE) {
        const chunks = [];
        for (let i = 0; i < serializedData.length; i += CHUNK_SIZE) {
          chunks.push(serializedData.slice(i, i + CHUNK_SIZE));
        }

        // Salvăm numărul de chunk-uri
        await AsyncStorage.setItem(`${key}_chunk_count`, String(chunks.length));

        // Salvăm fiecare chunk
        await Promise.all(
          chunks.map((chunk, index) => 
            AsyncStorage.setItem(`${key}_chunk_${index}`, chunk)
          )
        );
      } else {
        // Dacă datele sunt suficient de mici, le salvăm direct
        await AsyncStorage.removeItem(`${key}_chunk_count`);
        await AsyncStorage.setItem(key, serializedData);
      }
    } catch (error) {
      console.error('Cache write error:', error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      // Încercăm să ștergem chunk-urile dacă există
      const chunkCountStr = await AsyncStorage.getItem(`${key}_chunk_count`);
      if (chunkCountStr) {
        const chunkCount = parseInt(chunkCountStr, 10);
        const chunkKeys = Array.from(
          { length: chunkCount },
          (_, i) => `${key}_chunk_${i}`
        );
        
        await AsyncStorage.multiRemove([
          ...chunkKeys,
          `${key}_chunk_count`
        ]);
      }

      // Ștergem și cheia principală
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const exerciseKeys = keys.filter(key => 
        key.startsWith('exercises:') || 
        key.includes('_chunk_')
      );
      await AsyncStorage.multiRemove(exerciseKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
};