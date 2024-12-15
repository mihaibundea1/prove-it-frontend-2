// src/services/api/user.api.ts
import { User } from '../../types/user.types';
import { Config } from '../../config/env';
import { getAuthHeader } from '../../utils/auth.utils';
import { useUser } from '@clerk/clerk-expo';

export const userAPI = {
  async registerUser(clerkId: string, authToken: string) {  // Adăugăm authToken ca parametru
    try {
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      };
  
      const userData = {
        clerkId,
        date_of_birth: new Date(),
        height: 0,
        weight: 0,
        bio: "",
        posts: [],
        post_count: 0,
        followers: [],
        followers_count: 0,
        following: [],
        following_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
        questions_completed: false,
        profile_completed: false,
        answers: {
          version: 1,
          responses: {}
        }
      };
  
      const response = await fetch(`${Config.apiUrl}/user_information/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to register user');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Register user error:', error);
      throw error;
    }
  },

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