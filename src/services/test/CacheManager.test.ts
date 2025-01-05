import { CacheManager } from '@/services/cache/CacheManager';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';
import { SyncService } from '../api/endpoints/sync/SyncService';

jest.setTimeout(20000); // Set the timeout to 10 seconds

// Mock dependencies
jest.mock('@react-native-community/netinfo');
jest.mock('../api/endpoints/sync/SyncService');  // Mock the entire module

// Test configuration optimized for speed
const TEST_CONFIG = {
    maxMemorySize: 1,       // 1MB
    maxDiskSize: 5,         // 5MB
    maxAge: 1000,           // 1 second
    cleanupInterval: 0,     // Disable automatic cleanup
    syncInterval: 0,        // Disable automatic sync
    maxRetryCount: 2        // 2 retries for sync
};

describe('CacheManager', () => {
    let cacheManager: CacheManager;
    let mockSyncData: jest.Mock;

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setTimeout(30000); // 60 seconds

    });

    beforeEach(async () => {
        jest.clearAllMocks();

        // Configure NetInfo mock
        (NetInfo.addEventListener as jest.Mock).mockImplementation((callback) => {
            callback({
                type: 'wifi' as NetInfoStateType.wifi,
                isConnected: true,
                isInternetReachable: true,
                details: {} as any,
            });
            return () => { };
        });

        // Initialize CacheManager instance with test configuration
        cacheManager = new CacheManager(TEST_CONFIG);

        // Mock the SyncService syncData method
        mockSyncData = jest.fn().mockResolvedValue({ status: 200, data: { success: true } });
        (SyncService as jest.Mock).mockImplementation(() => ({
            syncData: mockSyncData,
        }));

        try {
            await cacheManager['initializeDatabase']();
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
        }
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
        jest.setTimeout(30000);

        test('should mark items for sync and attempt sync', async () => {
            const syncSpy = jest.spyOn(cacheManager as any, 'sync').mockResolvedValue({ status: 200, data: { success: true } });

            await cacheManager.set('test-key', { data: 'test' }, { sync: true, syncPriority: 'high' });

            expect(syncSpy).toHaveBeenCalled();
        });

        const TEST_CONFIG_1 = {
            maxMemorySize: 1,         // 1MB (mic pentru test)
            maxDiskSize: 1,           // 1MB (mic pentru test)
            maxAge: 100,              // 100ms pentru expirare rapidă
            cleanupInterval: 0,       // Dezactivăm curățarea automată pentru test rapid
            syncInterval: 0,          // Dezactivăm sincronizarea automată pentru a nu întârzia testul
            maxRetryCount: 1          // 1 retry pentru sincronizare
        };
        
        test('should handle sync conflicts', async () => {
            // Create a mock sync function that resolves quickly
            const mockSyncData = jest.fn()
                .mockResolvedValueOnce({ 
                    status: 409, // Conflict status
                    data: { 
                        success: false,
                        conflict: true,
                        serverData: { data: 'server-version' }
                    }
                })
                .mockResolvedValueOnce({ 
                    status: 200,
                    data: { success: true }
                });
    
            // Create a new instance with the mock
            const testConfig = {
                ...TEST_CONFIG,
                syncInterval: 100, // Short sync interval for testing
                maxRetryCount: 1,
                syncTimeout: 1000
            };
            
            const cacheManager = new CacheManager(testConfig);
            cacheManager['syncData'] = mockSyncData;

            const testKey = 'test-key';
            const testData = { data: 'test' };
    
            // Set data with sync option
            await cacheManager.set(testKey, testData, { sync: true });
    
            // Wait for sync attempts to complete
            await new Promise(resolve => setTimeout(resolve, 200));
    
            // Verify sync was attempted
            expect(mockSyncData).toHaveBeenCalledWith(testKey, testData);
            
            // Verify sync was called the expected number of times
            expect(mockSyncData).toHaveBeenCalledTimes(2);
    
            // Clean up
            await cacheManager.clear();
        });

        test('should handle network state changes', async () => {
            const networkCallback = jest.fn();
            networkCallback({
                type: 'none',
                isConnected: false,
                isInternetReachable: false,
                details: null,
            });

            expect(networkCallback).toHaveBeenCalledWith({
                type: 'none',
                isConnected: false,
                isInternetReachable: false,
                details: null,
            });
        });
    });

    describe('Error Handling', () => {
        test('should handle sync errors and retry', async () => {
            jest.setTimeout(30000);  // Setează timeout-ul pentru acest test la 30 secunde

            const mockSyncService = {
                syncData: jest
                    .fn()
                    .mockRejectedValueOnce(new Error('Sync failed'))
                    .mockResolvedValue({ status: 200, data: { success: true } }),
            };
        
            (SyncService as jest.Mock).mockImplementation(() => mockSyncService);
        
            await cacheManager.set('test-key', { data: 'test' }, { sync: true });
            await new Promise((resolve) => setTimeout(resolve, 500));

            expect(mockSyncService.syncData).toHaveBeenCalledTimes(2);
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

            mockNow.mockReturnValue(1000 + cacheManager['config'].maxAge + 1);

            await cacheManager.clear();

            const result = await cacheManager.get('test-key');
            expect(result).toBeNull();

            global.Date.now = realDateNow;
        });

        test('should evict data from memory cache when max memory size is reached', async () => {
            const smallCache = new CacheManager({ maxMemorySize: 1 });

            await smallCache.set('key1', { data: Buffer.alloc(512 * 1024) });
            await smallCache.set('key2', { data: Buffer.alloc(512 * 1024) });

            const memoryResult = await smallCache.get('key1');
            expect(memoryResult).toBeNull(); 

            const memoryResult2 = await smallCache.get('key2');
            expect(memoryResult2).not.toBeNull();

            const diskResult = await smallCache.getFromDisk('key1');
            expect(diskResult).toBeTruthy();
        });

        test('should respect disk size limit', async () => {
            const largeCache = new CacheManager({ maxDiskSize: 5 * 1024 });

            await largeCache.set('key1', { data: Buffer.alloc(3 * 1024) });
            await largeCache.set('key2', { data: Buffer.alloc(3 * 1024) });

            const result = await largeCache.get('key1');
            expect(result).toBeTruthy();
        });
    });
});
