import * as SQLite from 'expo-sqlite';
import { CACHE_CONSTANTS } from '../services/api/endpoints/exercise/constants/cache.constants';

class CacheDatabase {
  private dbPromise: Promise<SQLite.SQLiteDatabase>;

  constructor() {
    this.dbPromise = SQLite.openDatabaseAsync('app_cache.db');
    this.initializeTables();
  }

  private async initializeTables(): Promise<void> {
    const db = await this.dbPromise;
    
    await db.withTransactionAsync(async () => {
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS cache (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          timestamp INTEGER NOT NULL
        );`
      );
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const db = await this.dbPromise;
    try {
      const result = await db.getFirstAsync<{value: string, timestamp: number}>(
        `SELECT value, timestamp FROM cache WHERE key = ?;`,
        [key]
      );

      if (!result) return null;

      // Check for expiration
      const isExpired = Date.now() - result.timestamp > CACHE_CONSTANTS.EXPIRY_TIME;
      
      if (isExpired) {
        // Remove expired cache
        await this.remove(key);
        return null;
      }

      try {
        return JSON.parse(result.value);
      } catch (parseError) {
        console.error('Cache parsing error:', parseError);
        return null;
      }
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  async set<T>(key: string, data: T): Promise<void> {
    const db = await this.dbPromise;
    const serializedData = JSON.stringify(data);
    const timestamp = Date.now();

    await db.runAsync(
      `INSERT OR REPLACE INTO cache (key, value, timestamp) VALUES (?, ?, ?);`,
      [key, serializedData, timestamp]
    );
  }

  async remove(key: string): Promise<void> {
    const db = await this.dbPromise;
    await db.runAsync(
      `DELETE FROM cache WHERE key = ?;`,
      [key]
    );
  }

  async clear(): Promise<void> {
    const db = await this.dbPromise;
    await db.runAsync(
      `DELETE FROM cache WHERE 
        key = ? OR 
        key = ? OR 
        key = ? OR 
        key LIKE 'exercises:details:%';`,
      [
        CACHE_CONSTANTS.KEYS.ALL_EXERCISES,
        CACHE_CONSTANTS.KEYS.SELECTED_EXERCISES,
        CACHE_CONSTANTS.KEYS.ALL_EXERCISES
      ]
    );
  }
}

export const cacheUtils = new CacheDatabase();