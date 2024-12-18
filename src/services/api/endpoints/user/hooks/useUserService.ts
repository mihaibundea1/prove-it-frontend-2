// services/api/endpoints/user/hooks/useUserService.ts
import { useState } from 'react';
import { UserService } from '../UserService';
import { User } from '../types/user.types';
import { ApiResponse } from '../../../core/types/api.types';

export const useUserService = () => {
  const [loading, setLoading] = useState(false);
  const userService = new UserService();

  const registerUser = async (clerkId: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    try {
      return await userService.registerUser(clerkId);
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
      return await userService.updateProfile(userId, updates);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    try {
      return await userService.fetchUserProfile(userId);
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateUser = async (
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    setLoading(true);
    try {
      return await userService.createOrUpdateUser(userData);
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