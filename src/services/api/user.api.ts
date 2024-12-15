// src/services/api/user.api.ts
import { User } from '../../types/user.types';
import { Config } from '../../config/env';
import { getAuthHeader } from '../../utils/auth.utils';

export const userAPI = {
  async updateProfile(userId: string, updates: Partial<User>) {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${Config.apiUrl}/users/${userId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: responseData.message || 'Profile updated successfully!',
          user: responseData.user,
        };
      }

      throw new Error(responseData.error || 'Profile update failed!');
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  async createOrUpdateUser(userData: Partial<User>) {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${Config.apiUrl}/users`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to create/update user');
      }

      return await response.json();
    } catch (error) {
      console.error('Create/Update user error:', error);
      throw error;
    }
  },

  async fetchUserProfile(userId: string): Promise<User> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${Config.apiUrl}/users/${userId}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch profile error:', error);
      throw error;
    }
  }
};