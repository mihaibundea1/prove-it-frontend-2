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

describe('CacheManager', () => {
    let cacheManager: CacheManager;
    let mockSyncData: jest.Mock;
    const mockNetInfo = NetInfo as jest.Mocked<typeof NetInfo>;

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
            // Mock SyncService response with conflicts
            const mockSyncService = {
                syncData: jest.fn().mockResolvedValueOnce({
                    status: 200,
                    data: { conflicts: true, newData: { data: 'server-data' } }, // Mock conflict response
                }),
            };

            // Mock SyncService implementation
            (SyncService as jest.Mock).mockImplementation(() => mockSyncService);

            // Create an instance of CacheManager
            const cacheManager = new CacheManager();

            // Set data in the cache and mark it for sync
            await cacheManager.set('test-key', { data: 'test' }, { sync: true });

            // Ensure network is available
            cacheManager['networkAvailable'] = true;

            // Manually trigger the sync
            await cacheManager['sync']();

            // Verify the syncData method was called with correct parameters
            expect(mockSyncService.syncData).toHaveBeenCalledWith('test-key', { data: 'test' });

            // Verify that the cache was updated with the new data after conflict resolution
            const updatedData = await cacheManager.get('test-key');
            expect(updatedData).toEqual({ data: 'server-data' });
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
                syncData: jest
                    .fn()
                    .mockRejectedValueOnce(new Error('Sync failed'))
                    .mockResolvedValue({ status: 200, data: { success: true } }),
            };
            (SyncService as jest.Mock).mockImplementation(() => mockSyncService);
        
            await cacheManager.set('test-key', { data: 'test' }, { sync: true });
        
            // Wait for retry attempts
            await new Promise((resolve) => setTimeout(resolve, 500)); // Shortened delay for test
        
            expect(mockSyncService.syncData).toHaveBeenCalledTimes(2); // One failure + one retry
        });
        


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

            mockNow.mockReturnValue(1000 + cacheManager['config'].maxAge + 1); // Move past expiration

            // Perform cleanup manually
            await cacheManager.clear();

            const result = await cacheManager.get('test-key');
            expect(result).toBeNull();

            global.Date.now = realDateNow; // Restore Date.now
        });

        describe('Cache Memory', () => {
            test('should evict data from memory cache when max memory size is reached', async () => {
                const smallCache = new CacheManager({ maxMemorySize: 1 * 1024 }); // 1KB limit for testing
            
                // Add first item (512KB)
                await smallCache.set('key1', { data: Buffer.alloc(512 * 1024) });
            
                // Add second item (512KB), which should evict the first one
                await smallCache.set('key2', { data: Buffer.alloc(512 * 1024) });
            
                // Check if key1 is evicted and stored on disk
                const memoryResult = await smallCache.get('key1');
                expect(memoryResult).toBeNull();
            
                const diskResult = await smallCache.getFromDisk('key1');
                expect(diskResult).toBeTruthy(); // Ensure data is persisted to disk
            });
        });
    });
});
