import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { LRUCache } from 'lru-cache';
import NetInfo from '@react-native-community/netinfo';

export class CacheManager {
    private memoryCache: LRUCache<string, any>;
    private dbPromise: Promise<SQLite.SQLiteDatabase>;
    private config: CacheConfig;
    private isSyncing: boolean = false;
    private networkAvailable: boolean = true;

    constructor(config: Partial<CacheConfig> = {}) {
        this.config = {
            maxMemorySize: 50,
            maxDiskSize: 500,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            cleanupInterval: 24 * 60 * 60 * 1000,
            syncInterval: 5 * 60 * 1000,
            maxRetryCount: 3,
            ...config,
        };

        this.memoryCache = new LRUCache({
            max: this.config.maxMemorySize * 1024 * 1024,
            sizeCalculation: (value) =>
                new TextEncoder().encode(JSON.stringify(value)).length,
        });

        this.dbPromise = SQLite.openDatabaseAsync('cache.db');

        this.initialize();
    }

    private async initialize(): Promise<void> {
        await this.initializeDatabase();
        this.startNetworkMonitoring();
        this.startPeriodicCleanup();
        this.startPeriodicSync();
    }

    private async initializeDatabase(): Promise<void> {
        const db = await this.dbPromise;

        await db.withTransactionAsync(async () => {
            await db.execAsync(`
        CREATE TABLE IF NOT EXISTS cache (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          timestamp INTEGER NOT NULL
        )
      `);

            await db.execAsync(`
        CREATE TABLE IF NOT EXISTS sync_metadata (
          key TEXT PRIMARY KEY,
          last_synced INTEGER,
          needs_sync INTEGER NOT NULL DEFAULT 0,
          retry_count INTEGER NOT NULL DEFAULT 0,
          sync_priority TEXT NOT NULL DEFAULT 'low',
          FOREIGN KEY(key) REFERENCES cache(key)
        )
      `);

            await db.execAsync(
                'CREATE INDEX IF NOT EXISTS idx_cache_timestamp ON cache(timestamp)'
            );
            await db.execAsync(
                'CREATE INDEX IF NOT EXISTS idx_sync_status ON sync_metadata(needs_sync, sync_priority)'
            );
        });
    }

    private startNetworkMonitoring(): void {
        NetInfo.addEventListener((state) => {
            const wasOffline = !this.networkAvailable;
            this.networkAvailable = state.isConnected ?? false;

            if (wasOffline && this.networkAvailable) {
                this.sync().catch(console.error);
            }
        });
    }

    private async startPeriodicCleanup(): Promise<void> {
        const performCleanup = async () => {
            const db = await this.dbPromise;
            const cutoffTimestamp = Date.now() - this.config.maxAge;

            await db.runAsync(`DELETE FROM cache WHERE timestamp < ?;`, [
                cutoffTimestamp,
            ]);

            console.log('Cache cleanup performed');
        };

        await performCleanup();

        setInterval(performCleanup, this.config.cleanupInterval);
    }

    private startPeriodicSync(): void {
        setInterval(() => {
            if (this.networkAvailable) {
                this.sync().catch(console.error);
            }
        }, this.config.syncInterval);
    }

    async get<T>(key: string): Promise<T | null> {
        const memoryData = this.memoryCache.get(key);
        if (memoryData !== undefined) {
            return memoryData;
        }

        return this.getFromDisk<T>(key);
    }

    async getFromDisk<T>(key: string): Promise<T | null> {
        const db = await this.dbPromise;
        try {
            const result = await db.getFirstAsync<{ value: string; timestamp: number }>(
                `SELECT value, timestamp FROM cache WHERE key = ?;`,
                [key]
            );

            if (!result) return null;

            const isExpired = Date.now() - result.timestamp > this.config.maxAge;

            if (isExpired) {
                this.remove(key);
                return null;
            }

            try {
                const data = JSON.parse(result.value);
                this.memoryCache.set(key, data);
                return data;
            } catch (parseError) {
                console.error('Cache parsing error:', parseError);
                return null;
            }
        } catch (error) {
            console.error('Cache read error:', error);
            return null;
        }
    }

    async set<T>(
        key: string,
        data: T,
        options: {
            priority?: 'high' | 'low';
            persist?: boolean;
            sync?: boolean;
            syncPriority?: 'high' | 'low';
        } = {}
    ): Promise<void> {
        const { priority = 'low', persist = false, sync = false, syncPriority = 'low' } = options;

        const size = new TextEncoder().encode(JSON.stringify(data)).length;

        if (priority === 'high' || size < 1024 * 100) {
            this.memoryCache.set(key, data);
        }

        if (persist || size >= 1024 * 100) {
            await this.setToDisk<T>(key, data);
        }

        if (sync) {
            await this.markForSync(key, syncPriority);

            if (syncPriority === 'high' && this.networkAvailable) {
                this.sync([key]).catch(console.error);
            }
        }
    }

    private async setToDisk<T>(key: string, data: T): Promise<void> {
        const db = await this.dbPromise;
        const serializedData = JSON.stringify({
            data,
            timestamp: Date.now(),
        });

        await db.runAsync(
            `INSERT OR REPLACE INTO cache (key, value, timestamp) VALUES (?, ?, ?);`,
            [key, serializedData, Date.now()]
        );
    }

    async remove(key: string): Promise<void> {
        const db = await this.dbPromise;
        await db.runAsync(`DELETE FROM cache WHERE key = ?;`, [key]);
        this.memoryCache.delete(key);
    }

    async clear(): Promise<void> {
        const db = await this.dbPromise;
        await db.runAsync(
            `DELETE FROM cache WHERE 
        key LIKE 'exercises:%' OR 
        key LIKE '%_chunk_%';`
        );
        this.memoryCache.clear();
    }

    private async markForSync(key: string, priority: 'high' | 'low'): Promise<void> {
        const db = await this.dbPromise;
        await db.runAsync(
            `INSERT OR REPLACE INTO sync_metadata 
      (key, needs_sync, sync_priority, retry_count) 
      VALUES (?, 1, ?, 0)`,
            [key, priority]
        );
    }

    async sync(specificKeys?: string[]): Promise<void> {
        if (this.isSyncing || !this.networkAvailable) return;

        this.isSyncing = true;
        try {
            const itemsToSync = await this.getItemsNeedingSync(specificKeys);

            for (const item of itemsToSync) {
                try {
                    const data = await this.get(item.key);
                    if (!data) continue;

                    await this.syncWithServer(item.key, data);

                    await this.updateSyncStatus(item.key, {
                        lastSynced: Date.now(),
                        needsSync: false,
                        retryCount: 0,
                    });
                } catch (error) {
                    console.error(`Sync failed for ${item.key}:`, error);

                    await this.updateSyncStatus(item.key, {
                        retryCount: (item.retryCount || 0) + 1,
                    });
                }
            }
        } finally {
            this.isSyncing = false;
        }
    }

    private async getItemsNeedingSync(specificKeys?: string[]): Promise<SyncMetadata[]> {
        const db = await this.dbPromise;
        const keyCondition = specificKeys?.length
            ? `AND key IN (${specificKeys.map(() => '?').join(',')})`
            : '';

        const query = `SELECT * FROM sync_metadata 
          WHERE needs_sync = 1 
          AND retry_count < ? 
          ${keyCondition}
          ORDER BY 
            CASE sync_priority 
              WHEN 'high' THEN 1 
              ELSE 2 
            END,
            last_synced ASC NULLS FIRST`;

        const params = [this.config.maxRetryCount, ...(specificKeys || [])];

        try {
            const rows = await db.getAllAsync<SyncMetadata>(query, params);
            return rows;
        } catch (error) {
            console.error('Error getting items needing sync:', error);
            throw error;
        }
    }

    private async syncWithServer(key: string, data: any): Promise<void> {
        const response = await fetch('https://your-api.com/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key,
                data,
                timestamp: Date.now(),
            }),
        });

        if (!response.ok) {
            throw new Error(`Sync failed: ${response.statusText}`);
        }

        const serverResponse = await response.json();
        if (serverResponse.conflicts) {
            await this.handleConflicts(key, data, serverResponse.conflicts);
        }
    }

    private async updateSyncStatus(key: string, updates: Partial<SyncMetadata>): Promise<void> {
        const db = await this.dbPromise;
        const setClauses = Object.keys(updates)
            .map((k) => `${this.toSnakeCase(k)} = ?`)
            .join(', ');

        await db.runAsync(
            `UPDATE sync_metadata SET ${setClauses} WHERE key = ?`,
            [...Object.values(updates), key]
        );
    }

    private async handleConflicts(key: string, localData: any, serverData: any): Promise<void> {
        await this.set(key, serverData, { sync: false });
    }

    private toSnakeCase(str: string): string {
        return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    }

    async forceSyncItems(keys: string[]): Promise<void> {
        return this.sync(keys);
    }

    async markItemsForSync(keys: string[], priority: 'high' | 'low' = 'low'): Promise<void> {
        for (const key of keys) {
            await this.markForSync(key, priority);
        }
    }
}