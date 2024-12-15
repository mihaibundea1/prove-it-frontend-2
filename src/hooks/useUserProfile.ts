// src/hooks/useUserProfile.ts
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { userAPI } from '../services/api/user.api';
import type { User } from '../types/user.types';

export const useUserProfile = () => {
  const { user: clerkUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (updates: Partial<User>) => {
    if (!clerkUser) {
      throw new Error('No user logged in');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await userAPI.updateProfile(clerkUser.id, updates);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading,
    error
  };
};