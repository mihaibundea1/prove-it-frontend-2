import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { LRUCache } from 'lru-cache';
import NetInfo from '@react-native-community/netinfo';
import { SyncService } from '../api/endpoints/sync/SyncService';

export class CacheManager {
    private static instance: CacheManager | null = null;
    private memoryCache: any;
    private dbPromise: Promise<SQLite.SQLiteDatabase>;
    private config: CacheConfig;
    private isSyncing: boolean = false;
    private networkAvailable: boolean = true;
    private syncData: SyncDataFunction;
    private static readonly DEFAULT_CONFIG: CacheConfig = {
        maxMemorySize: 50,      // MB
        maxDiskSize: 500,       // MB
        maxAge: 7 * 24 * 60 * 60 * 1000,      // 7 zile
        cleanupInterval: 24 * 60 * 60 * 1000,  // 1 zi
        syncInterval: 5 * 60 * 1000,           // 5 minute
        maxRetryCount: 3,
        syncTimeout: 25000,  // 25 seconds default

    };

    constructor(
        config: Partial<CacheConfig> = {},
        syncData: SyncDataFunction = new SyncService().syncData
    ) {
        this.config = {
            ...CacheManager.DEFAULT_CONFIG,
            ...config
        };

        this.memoryCache = new LRUCache({
            maxSize: this.config.maxMemorySize * 1024 * 1024,
            sizeCalculation: (value: any) => {
                return new TextEncoder().encode(JSON.stringify(value)).length;
            },
        });

        this.dbPromise = SQLite.openDatabaseAsync('cache.db');

        this.syncData = syncData;  // Folosește funcția de sincronizare injectată
        this.initialize();
    }

    async debugDatabase(): Promise<void> {
        const db = await this.dbPromise;
        try {
          const cacheEntries = await db.getAllAsync<{ key: string; value: string; timestamp: number }>(
            `SELECT * FROM cache`
          );
          // Afișează structura primei intrări (dacă există)
          if (cacheEntries.length > 0) {
            console.log("Structura primei intrări în cache:");
          } else {
            console.log("Nu există intrări în cache.");
          }
        } catch (error) {
          console.error("Error debugging database:", error);
        }
      }
    

    // Instanța unică (Singleton)
    public static getInstance(config?: Partial<CacheConfig>, syncData?: SyncDataFunction): CacheManager {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager(config, syncData);
        }
        return CacheManager.instance;
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
        console.log('Saving to disk:', key, data);
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

    private async sync(specificKeys?: string[]): Promise<void> {
        // Add timeout handling
        if (this.isSyncing || !this.networkAvailable) return;

        this.isSyncing = true;
        try {
            await this.withTimeout(
                this._performSync(specificKeys),
                this.config.syncTimeout,
                'Sync operation'
            );

        }
        catch {
            console.log("error when syncing");
        }
        finally {
            this.isSyncing = false;
        }
    }

    private async _performSync(specificKeys?: string[]): Promise<void> {
        if (this.isSyncing || !this.networkAvailable) return;

        this.isSyncing = true;
        try {
            const itemsToSync = await this.getItemsNeedingSync(specificKeys);

            // Sort items by priority (high priority first)
            itemsToSync.sort((a, b) => {
                if (a.syncPriority === 'high' && b.syncPriority !== 'high') return -1;
                if (a.syncPriority !== 'high' && b.syncPriority === 'high') return 1;
                return (a.lastSynced ?? 0) < (b.lastSynced ?? 0) ? -1 : 1;
            });

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

                    // Increment the retry count if sync fails
                    await this.updateSyncStatus(item.key, {
                        retryCount: (item.retryCount || 0) + 1,
                    });

                    // If retry count exceeds max, stop retrying
                    const syncMetadata = await this.getSyncMetadata(item.key);
                    if (syncMetadata && (syncMetadata.retryCount ?? 0) >= this.config.maxRetryCount) {
                        await this.updateSyncStatus(item.key, {
                            needsSync: false,
                        });
                    } else {
                        // Implement retry delay
                        await this.retryDelay();
                    }
                }
            }
        } finally {
            this.isSyncing = false;
        }
    }

    private async withTimeout<T>(
        promise: Promise<T>,
        timeoutMs: number = this.config.syncTimeout,
        operation: string = 'Operation'
    ): Promise<T> {
        const timeoutPromise = new Promise<T>((_, reject) => {
            setTimeout(() => {
                reject(new Error(`${operation} timed out after ${timeoutMs}ms`));
            }, timeoutMs);
        });

        return Promise.race([
            promise,
            timeoutPromise
        ]);
    }

    private async retryDelay(): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
    }

    private async getSyncMetadata(key: string): Promise<SyncMetadata | null> {
        const db = await this.dbPromise;
        const result = await db.getFirstAsync<SyncMetadata>(
            `SELECT * FROM sync_metadata WHERE key = ?`,
            [key]
        );
        return result || null;
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

        try {
            const response = await this.syncData(key, data);

            if (response.status !== 200) {
                throw new Error(`Sync failed with status ${response.status}: ${response.error}`);
            }

            if (response.data && response.data.conflicts) {
                await this.handleConflicts(key, data, response.data.conflicts);
            }
        } catch (error) {
            console.error('Sync error:', error);
            throw error;
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


    private toSnakeCase(str: string): string {
        return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    }

    public async handleConflicts(key: string, localData: any, serverData: any): Promise<void> {
        // Add proper conflict resolution
        try {
            // Log the conflict
            console.log(`Conflict detected for key ${key}`);
            console.log('Local data:', localData);
            console.log('Server data:', serverData);

            // You might want to implement a more sophisticated merge strategy
            // For now, we'll keep server version but also store conflict info
            await this.set(key, serverData, {
                sync: false,
                persist: true,
                priority: 'high'
            });

            // Optionally store conflict metadata
            await this.set(`${key}_conflict`, {
                timestamp: Date.now(),
                localData,
                serverData
            }, { persist: true });

        } catch (error) {
            console.error('Error handling conflict:', error);
            throw error;
        }
    }

    public getMemorySize(): number {
        return this.memoryCache.size;
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