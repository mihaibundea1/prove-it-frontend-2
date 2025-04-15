import * as SQLite from 'expo-sqlite';
import { CACHE_CONSTANTS } from '../constants/cache.constants';

class SQLiteCache {
  private dbPromise: Promise<SQLite.SQLiteDatabase>;

  constructor() {
    this.dbPromise = SQLite.openDatabaseAsync('app_cache.db');
    this.initializeTables();
    this.setupAutoCleanup();
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

  private async setupAutoCleanup(): Promise<void> {
    const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
    const DAYS_TO_KEEP = 7; // Keep entries for 7 days

    const performCleanup = async () => {
      const db = await this.dbPromise;
      const cutoffTimestamp = Date.now() - (DAYS_TO_KEEP * 24 * 60 * 60 * 1000);

      await db.runAsync(
        `DELETE FROM cache WHERE timestamp < ?;`,
        [cutoffTimestamp]
      );

      console.log('Cache cleanup performed');
    };

    // Perform initial cleanup
    await performCleanup();

    // Set up periodic cleanup
    setInterval(performCleanup, CLEANUP_INTERVAL);
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
    const serializedData = JSON.stringify({
      data,
      timestamp: Date.now()
    });

    await db.runAsync(
      `INSERT OR REPLACE INTO cache (key, value, timestamp) VALUES (?, ?, ?);`,
      [key, serializedData, Date.now()]
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
        key LIKE 'exercises:%' OR 
        key LIKE '%_chunk_%';`
    );
  }
}

export const cacheUtils = new SQLiteCache();