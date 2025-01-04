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