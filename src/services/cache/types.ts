// types.ts
interface CacheConfig {
    maxMemorySize: number;
    maxDiskSize: number;
    maxAge: number;
    cleanupInterval: number;
    syncInterval: number;
    maxRetryCount: number;
}

interface CacheEntry {
    key: string;
    data: any;
    size: number;
    timestamp: number;
    type: 'memory' | 'disk';
}

interface SyncMetadata {
    key: string;
    lastSynced: number | null;
    needsSync: boolean;
    retryCount: number;
    syncPriority: 'high' | 'low';
}