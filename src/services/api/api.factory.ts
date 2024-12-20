// src/services/api/api.factory.ts
import { useUserApi } from './user.api';
// Import other API services as needed

export const useApiFactory = () => {
  return {
    user: useUserApi(),
    // Add other API services here as needed
  };
};
