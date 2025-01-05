global.console = {
    ...console,
    log: jest.fn().mockImplementation(console.log)
};

jest.mock('nativewind', () => ({
  styled: () => (component) => component
}));

// Mock pentru variabilele de mediu
jest.mock('@/services/api/core/config/env.config', () => ({
  getValidatedEnvVar: (key) => {
    const mockEnvVars = {
      EXPO_PUBLIC_API_URL: 'http://192.168.100.32:5000'
    };
    return mockEnvVars[key];
  }
})); 
// jest.setup.js
jest.mock('expo-sqlite', () => ({
    openDatabaseAsync: jest.fn().mockResolvedValue({
      withTransactionAsync: jest.fn().mockImplementation(async (callback) => await callback()),
      execAsync: jest.fn().mockResolvedValue({}),
      runAsync: jest.fn().mockResolvedValue({}),
      getFirstAsync: jest.fn().mockResolvedValue(null),
      getAllAsync: jest.fn().mockResolvedValue([])
    })
  }));
  
  jest.mock('expo-file-system', () => ({
    // Add any FileSystem methods you're using
    getInfoAsync: jest.fn(),
    makeDirectoryAsync: jest.fn(),
    writeAsStringAsync: jest.fn(),
    readAsStringAsync: jest.fn(),
  }));
  
  jest.mock('@react-native-community/netinfo', () => ({
    addEventListener: jest.fn().mockImplementation((callback) => {
      callback({ isConnected: true });
      return jest.fn(); // cleanup function
    })
  }));
  
  jest.mock('nativewind', () => ({
    styled: () => (component) => component
  }));
  
  jest.mock('@/services/api/core/config/env.config', () => ({
    getValidatedEnvVar: (key) => {
      const mockEnvVars = {
        EXPO_PUBLIC_API_URL: 'http://192.168.100.32:5000'
      };
      return mockEnvVars[key];
    }
  }));
  
  // Mock pentru SyncService
  jest.mock('@/services/api/endpoints/sync/SyncService', () => ({
    SyncService: jest.fn().mockImplementation(() => ({
      syncData: jest.fn().mockResolvedValue({ status: 200, data: { success: true } })
    }))
  }));
  
  // Adăugăm un mock global pentru TextEncoder dacă nu există
  if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
  }