// src/services/api/userApi.ts
import { User } from '@/types/user.types';
import { useApi } from './useApi';

export const useUserApi = () => {
  const api = useApi();

  const logDebug = (action: string, data: any) => {
    console.log(`=== ${action} Debug Start ===`);
    console.log('DEBUG:', data);
  };

  const logError = (action: string, error: any) => {
    console.error(`DEBUG: ${action} error:`, error);
    console.error('DEBUG: Full error:', JSON.stringify(error, null, 2));
    console.error(`=== ${action} Debug End with Error ===`);
  };

  const handleApiResponse = <T>(data: T | null, error: string | undefined): T => {
    if (error || !data) {
      throw new Error(error || 'No data received');
    }
    return data;
  };

  return {
    async registerUser(clerkId: string, authToken: string): Promise<User> {
      logDebug('Register User', {
        clerkId,
        authToken,
        action: 'Starting user registration process'
      });

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

      try {
        logDebug('Register User', { requestBody: userData });
        
        const { data, error, status } = await api.post<User>(
          '/user_information/register',
          userData
        );

        logDebug('Register User', { 
          responseStatus: status,
          responseData: data 
        });

        return handleApiResponse(data, error);
      } catch (error) {
        logError('Register User', error);
        throw error;
      }
    },

    async updateProfile(userId: string, updates: Partial<User>): Promise<{
      success: boolean;
      message: string;
      user: User;
    }> {
      logDebug('Update Profile', { 
        userId, 
        updates,
        action: 'Starting profile update'
      });

      try {
        const { data, error, status } = await api.patch<{
          success: boolean;
          message: string;
          user: User;
        }>(`/users/${userId}`, updates);

        logDebug('Update Profile', {
          responseStatus: status,
          responseData: data
        });

        return handleApiResponse(data, error);
      } catch (error) {
        logError('Update Profile', error);
        throw error;
      }
    },

    async createOrUpdateUser(userData: Partial<User>): Promise<User> {
      logDebug('Create/Update User', {
        userData,
        action: 'Starting user create/update'
      });

      try {
        const { data, error, status } = await api.put<User>(
          '/users',
          userData
        );

        logDebug('Create/Update User', {
          responseStatus: status,
          responseData: data
        });

        return handleApiResponse(data, error);
      } catch (error) {
        logError('Create/Update User', error);
        throw error;
      }
    },

    async fetchUserProfile(userId: string): Promise<User> {
      logDebug('Fetch Profile', {
        userId,
        action: 'Starting profile fetch'
      });

      try {
        const { data, error, status } = await api.get<User>(`/users/${userId}`);

        logDebug('Fetch Profile', {
          responseStatus: status,
          responseData: data
        });

        return handleApiResponse(data, error);
      } catch (error) {
        logError('Fetch Profile', error);
        throw error;
      }
    }
  };
};