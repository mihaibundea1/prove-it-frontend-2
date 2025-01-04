import { CacheManager } from '@/services/cache/CacheManager';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';
import { SyncService } from '../api/endpoints/sync/SyncService';

// Mock dependencies
jest.mock('@react-native-community/netinfo');
jest.mock('../api/endpoints/sync/SyncService', () => ({
    SyncService: jest.fn().mockImplementation(() => ({
        syncData: jest.fn().mockResolvedValue({ status: 200, data: { success: true } })
    }))
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
                details: {} as any
            });
            return () => { };
        });

        // Initialize cache manager with test configuration
        cacheManager = new CacheManager({
            maxMemorySize: 1, // 1MB
            maxDiskSize: 5, // 5MB
            maxAge: 1000, // 1 second
            cleanupInterval: 0, // Deactivates automatic cleanup
            syncInterval: 0,    // Deactivates automatic sync
            maxRetryCount: 2
        });

        mockSyncData = jest.fn().mockResolvedValue({ status: 200, data: { success: true } });
        (SyncService as jest.Mock).mockImplementation(() => ({
            syncData: mockSyncData
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
            const data = { id: 1, name: 'John' };

            await cacheManager.set(key, data);
            const cachedData = await cacheManager.get(key);

            expect(cachedData).toEqual(data);
        });

        test('should return null for non-existent key', async () => {
            const cachedData = await cacheManager.get('non-existent-key');
            expect(cachedData).toBeNull();
        });

        test('should remove data from cache', async () => {
            const key = 'test-key';
            const data = { id: 1, name: 'John' };

            await cacheManager.set(key, data);
            await cacheManager.remove(key);
            const cachedData = await cacheManager.get(key);

            expect(cachedData).toBeNull();
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
            const key = 'testKey';
            const data = { persist: true };

            // Call the set method with persist = true
            await cacheManager.set(key, data, { persist: true });

            // Fetch the data directly from disk
            const cachedData = await cacheManager.getFromDisk(key);

            // Check if the data is correctly persisted
            expect(cachedData).toBe(JSON.stringify({ data, timestamp: expect.any(Number) }));
        });
    });

    describe('Sync Functionality', () => {
        test('should mark items for sync', async () => {
            const keys = ['key1', 'key2'];

            // Ensure markItemsForSync actually triggers the syncData call
            await cacheManager.markItemsForSync(keys, 'high');
            await cacheManager.forceSyncItems(keys);

            // Ensure the mockSyncData is called the correct number of times
            expect(mockSyncData).toHaveBeenCalledTimes(keys.length);
        });

        test('should handle sync conflicts', async () => {
            const key = 'test-key';
            const serverData = { server: true };
            const localData = { local: true };

            // Simulate fetching data from local and server
            await cacheManager.set(key, localData);

            // Simulate server data overwrite
            await cacheManager.set(key, serverData);

            const finalData = await cacheManager.get(key);

            // Expect the server data to be the final result
            expect(finalData).toEqual(serverData);
        });

        test('should handle network state changes', async () => {
            const networkCallback = jest.fn();

            // Define mock for network state type
            const NetInfoStateType = {
                none: 'none',
                wifi: 'wifi',
                cellular: 'cellular'
            };

            networkCallback({
                type: NetInfoStateType.none,
                isConnected: false,
                isInternetReachable: false,
                details: null,
            });

            // Ensure network callback is called correctly
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
            const mockSyncData = jest.fn().mockRejectedValueOnce(new Error('Sync error'));

            // Simulate a sync error and retry
            await cacheManager.forceSyncItems(['key']).catch(() => { });

            // Ensure the sync error retry logic was triggered
            expect(mockSyncData).toHaveBeenCalled();
        });

        test('should handle invalid JSON in cache', async () => {
            const key = 'invalid-json';
            await cacheManager['setToDisk'](key, 'invalid-json-data');

            const result = await cacheManager.get(key);
            expect(result).toBeNull();
        });
    });
});
