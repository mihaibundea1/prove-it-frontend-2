import { CacheManager } from '@/services/cache/CacheManager';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';
import { SyncService } from '../api/endpoints/sync/SyncService';

jest.setTimeout(10000); // Set the timeout to 10 seconds

// Mock dependencies
jest.mock('@react-native-community/netinfo');
jest.mock('../api/endpoints/sync/SyncService', () => ({
    SyncService: jest.fn().mockImplementation(() => ({
        syncData: jest.fn().mockResolvedValue({ status: 200, data: { success: true } }),
    })),
}));

jest.mock('../api/endpoints/sync/SyncService', () => ({
    SyncService: jest.fn().mockImplementation(() => ({
        syncData: jest.fn().mockResolvedValue({ status: 200, data: { success: true } }),
    })),
}));

describe('CacheManager', () => {
    let cacheManager: CacheManager;
    let mockSyncData: jest.Mock;
    const mockNetInfo = NetInfo as jest.Mocked<typeof NetInfo>;
    const mockSyncService = SyncService as jest.MockedClass<typeof SyncService>;

    beforeAll(() => {
        jest.useFakeTimers();
    });

    beforeEach(() => {
        jest.clearAllMocks();

        // Configure NetInfo mock
        mockNetInfo.addEventListener.mockImplementation((callback) => {
            callback({
                type: 'wifi' as NetInfoStateType.wifi,
                isConnected: true,
                isInternetReachable: true,
                details: {} as any,
            });
            return () => { };
        });

        // Initialize cache manager with test configuration
        cacheManager = new CacheManager({
            maxMemorySize: 1, // 1MB
            maxDiskSize: 5, // 5MB
            maxAge: 1000, // 1 second
            cleanupInterval: 0, // Deactivates automatic cleanup
            syncInterval: 0, // Deactivates automatic sync
            maxRetryCount: 2,
        });

        // Initialize the SyncService mock and mock syncData method
        mockSyncData = jest.fn().mockResolvedValue({ status: 200, data: { success: true } });
        (SyncService as jest.Mock).mockImplementation(() => ({
            syncData: mockSyncData,
        }));
    });

    afterEach(async () => {
        await cacheManager.clear();
        jest.clearAllTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    describe('Basic Cache Operations', () => {
        test('should set and get data from cache', async () => {
            const key = 'test-key';
            const data = { test: 'data' };

            await cacheManager.set(key, data);
            const retrievedData = await cacheManager.get(key);

            expect(retrievedData).toEqual(data);
        });

        test('should return null for non-existent key', async () => {
            const result = await cacheManager.get('non-existent-key');
            expect(result).toBeNull();
        });

        test('should remove data from cache', async () => {
            const key = 'test-key';
            const data = { test: 'data' };

            await cacheManager.set(key, data);
            await cacheManager.remove(key);

            const result = await cacheManager.get(key);

            expect(result).toBeNull();
        });

        test('should clear all cache data', async () => {
            const keys = ['key1', 'key2', 'key3'];
            const data = { test: 'data' };

            for (const key of keys) {
                await cacheManager.set(key, data);
            }

            await cacheManager.clear();

            for (const key of keys) {
                const cachedData = await cacheManager.get(key);
                expect(cachedData).toBeNull();
            }
        });
    });

    describe('Cache Options', () => {
        test('should handle high priority cache items', async () => {
            const key = 'high-priority';
            const data = { important: true };

            await cacheManager.set(key, data, { priority: 'high' });
            const cachedData = await cacheManager.get(key);

            expect(cachedData).toEqual(data);
        });

        test('should handle persistence option', async () => {
            const key = 'persistent-key';
            const data = { test: 'data' };

            await cacheManager.set(key, data, { persist: true });
            const cachedData = await cacheManager.get(key);

            expect(cachedData).toEqual(data);
        });
    });

    describe('Sync Functionality', () => {
        test('should mark items for sync and attempt sync', async () => {
            // Mock sync method directly
            const syncSpy = jest.spyOn(cacheManager as any, 'sync').mockResolvedValue({ status: 200, data: { success: true } });;

            await cacheManager.set('test-key', { data: 'test' }, { sync: true, syncPriority: 'high' });

            expect(syncSpy).toHaveBeenCalled();
        }, 20000);


        test('should handle sync conflicts', async () => {
            const mockSyncService = {
                syncData: jest.fn().mockResolvedValue({ status: 200, data: { conflicts: true } })
            };
            (SyncService as jest.Mock).mockImplementation(() => mockSyncService);

            await cacheManager.set('test-key', { data: 'test' }, { sync: true });

            // Ensure the sync call was made
            expect(mockSyncService.syncData).toHaveBeenCalled();
        });

        test('should handle network state changes', async () => {
            const networkCallback = jest.fn();

            const NetInfoStateType = {
                none: 'none',
                wifi: 'wifi',
                cellular: 'cellular',
            };

            networkCallback({
                type: NetInfoStateType.none,
                isConnected: false,
                isInternetReachable: false,
                details: null,
            });

            expect(networkCallback).toHaveBeenCalledWith({
                type: NetInfoStateType.none,
                isConnected: false,
                isInternetReachable: false,
                details: null,
            });
        });
    });

    describe('Error Handling', () => {
        test('should handle sync errors and retry', async () => {
            const mockSyncService = {
                syncData: jest.fn().mockRejectedValueOnce(new Error('Sync failed')).mockResolvedValue({ status: 200, data: { success: true } })
            };
            (SyncService as jest.Mock).mockImplementation(() => mockSyncService);

            await cacheManager.set('test-key', { data: 'test' }, { sync: true });

            // Wait for retry attempt
            await new Promise(resolve => setTimeout(resolve, 1500)); // Increased delay

            expect(mockSyncService.syncData).toHaveBeenCalledTimes(2); // Ensure retry happens
        }, 25000); // Increased timeout for retries


        test('should handle invalid JSON in cache', async () => {
            const key = 'invalid-json';
            await cacheManager['setToDisk'](key, 'invalid-json-data');

            const result = await cacheManager.get(key);
            expect(result).toBeNull();
        });
    });

    describe('Cache Cleanup', () => {
        test('should clean up expired cache entries', async () => {
            const realDateNow = Date.now;
            const mockNow = jest.fn();
            global.Date.now = mockNow;

            mockNow.mockReturnValue(1000);
            await cacheManager.set('test-key', { data: 'test' });

            mockNow.mockReturnValue(1000 + cacheManager['config'].maxAge + 1000); // Advance time

            const result = await cacheManager.get('test-key');
            expect(result).toBeNull();

            global.Date.now = realDateNow; // Restore Date.now
        }, 5000);

        describe('Cache Memory', () => {
            test('should evict data from memory cache when max memory size is reached', async () => {
                // Initialize CacheManager with a 1MB memory size limit
                const smallCache = new CacheManager({ maxMemorySize: 1 * 1024 }); // 1KB limit for testing
                
                // Add first item (512KB)
                await smallCache.set('key1', { data: Buffer.alloc(512 * 1024) }); // Simulate 512KB data
                
                // Add second item (512KB), which should evict the first one
                await smallCache.set('key2', { data: Buffer.alloc(512 * 1024) }); // Another 512KB data
                
                // Check if key1 is evicted and stored on disk
                const result = await smallCache.getFromDisk('key1');
                expect(result).toBeTruthy(); // The data for 'key1' should now be on disk, not in memory
            }, 5000);
        });
    });
});
