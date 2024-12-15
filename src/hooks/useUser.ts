// src/hooks/useUser.ts
import { useUser as useClerkUser } from '@clerk/clerk-expo';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { UserContextType, User } from '../types/user.types';
import { userAPI } from '../services/api/user.api';

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};

export const useUserProfile = () => {
  const { user, isLoading, error } = useUser();
  const { user: clerkUser } = useClerkUser();

  return { 
    user,
    isLoading,
    error,
    email: clerkUser?.emailAddresses[0]?.emailAddress,
    username: clerkUser?.username,
    firstName: clerkUser?.firstName,
    lastName: clerkUser?.lastName
  };
};

export const useUserActions = () => {
  const { user: clerkUser } = useClerkUser();
  const { refreshUser } = useUser();

  const updateProfile = async (updates: Partial<User>) => {
    if (!clerkUser?.id) {
      throw new Error('No authenticated user');
    }

    try {
      await userAPI.updateProfile(clerkUser.id, updates);
      await refreshUser();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const syncUserWithClerk = async () => {
    if (!clerkUser) {
      return;
    }

    try {
      await userAPI.createOrUpdateUser({
        _id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        username: clerkUser.username || '',
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined
      });
      await refreshUser();
    } catch (error) {
      console.error('Error syncing user:', error);
      throw error;
    }
  };

  return {
    updateProfile,
    syncUserWithClerk,
    refreshUser
  };
};

export const useUserMetadata = () => {
  const { user } = useUser();
  
  return {
    followersCount: user?.followersCount || 0,
    followingCount: user?.followingCount || 0,
    postCount: user?.postCount || 0,
    answers: user?.answers,
    bio: user?.bio
  };
};