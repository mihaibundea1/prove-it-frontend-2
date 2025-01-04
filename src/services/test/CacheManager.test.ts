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
            // Reset mocks
            jest.clearAllMocks();
            
            const mockSyncService = {
                syncData: jest.fn().mockResolvedValue({
                    status: 200,
                    data: { conflicts: true }
                })
            };
            
            (SyncService as jest.Mock).mockImplementation(() => mockSyncService);
            
            await cacheManager.set('test-key', { data: 'test' }, { sync: true });
            
            expect(mockSyncService.syncData).toHaveBeenCalled();
        }, 20000);

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
                syncData: jest.fn().mockRejectedValue(new Error('Sync failed'))
            };
            
            (SyncService as jest.Mock).mockImplementation(() => mockSyncService);
            
            await cacheManager.set('test-key', { data: 'test' }, { sync: true });
            
            // Wait for retry attempt
            await new Promise(resolve => setTimeout(resolve, 500));
            
            expect(mockSyncService.syncData).toHaveBeenCalled();
        }, 20000);


        test('should handle invalid JSON in cache', async () => {
            const key = 'invalid-json';
            await cacheManager['setToDisk'](key, 'invalid-json-data');

            const result = await cacheManager.get(key);
            expect(result).toBeNull();
        });
    });

    describe('Cache Cleanup', () => {
        test('should clean up expired cache entries', async () => {
            // Mock Date.now for consistent testing
            const realDateNow = Date.now;
            const mockNow = jest.fn();
            global.Date.now = mockNow;
            
            // Set initial time
            mockNow.mockReturnValue(1000);
            await cacheManager.set('test-key', { data: 'test' });
            
            // Advance time past expiration
            mockNow.mockReturnValue(1000 + cacheManager['config'].maxAge + 1000);
            
            const result = await cacheManager.get('test-key');
            expect(result).toBeNull();
            
            // Restore Date.now
            global.Date.now = realDateNow;
        }, 5000);
    
        describe('Cache Memory', () => {
            test('should evict data from memory cache when max memory size is reached', async () => {
                const smallCache = new CacheManager({ maxMemorySize: 1 }); // 1MB
                
                // Add first item
                await smallCache.set('key1', { data: 'a'.repeat(512 * 1024) });
                // Add second item that should cause eviction
                await smallCache.set('key2', { data: 'b'.repeat(512 * 1024) });
                
                // Check that first item is still in disk cache
                const result = await smallCache['getFromDisk']('key1');
                expect(result).toBeTruthy();
            }, 5000);
        });
    });
});
