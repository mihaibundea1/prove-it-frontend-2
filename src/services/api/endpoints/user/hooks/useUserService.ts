// services/api/endpoints/user/hooks/useUserService.ts
import { useRef, useState } from 'react';
import { UserService } from '../UserService';
import { User } from '../types/user.types';
import { ApiResponse } from '../../../core/types/api.types';
import { useAuth } from '@clerk/clerk-expo';

export const useUserService = () => {
  const { getToken } = useAuth();
  const serviceRef = useRef(new UserService(getToken));
  const [loading, setLoading] = useState(false);

  // All methods should use serviceRef.current
  const registerUser = async (clerkId: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    try {
      return await serviceRef.current.registerUser(clerkId);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (
    userId: string, 
    updates: Partial<User>
  ): Promise<ApiResponse<User>> => {
    setLoading(true);
    try {
      return await serviceRef.current.updateProfile(userId, updates);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    try {
      return await serviceRef.current.fetchUserProfile(userId);
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateUser = async (
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    setLoading(true);
    try {
      return await serviceRef.current.createOrUpdateUser(userData);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    registerUser,
    updateProfile,
    fetchUserProfile,
    createOrUpdateUser
  };
};