import { User } from '../../types/user.types';
import { Config } from '../../config/env';
import { getAuthHeader } from '../../utils/auth.utils';
import { useUser } from '@clerk/clerk-expo';

export const userAPI = {
  async registerUser(clerkId: string, authToken: string) {
    console.log('=== Register User Debug Start ===');
    console.log('DEBUG: Starting user registration process');
    console.log('DEBUG: ClerkId:', clerkId);
    console.log('DEBUG: AuthToken:', authToken);
    console.log('DEBUG: API URL:', `${Config.apiUrl}/user_information/register`);

    try {
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      console.log('DEBUG: Request headers:', JSON.stringify(headers, null, 2));

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

      console.log('DEBUG: Request body:', JSON.stringify(userData, null, 2));

      const requestOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify(userData),
        credentials: 'include' as RequestCredentials
      };

      console.log('DEBUG: Request options:', JSON.stringify(requestOptions, null, 2));

      const response = await fetch(
        `${Config.apiUrl}/user_information/register`, 
        requestOptions
      );

      console.log('DEBUG: Response status:', response.status);
      console.log('DEBUG: Response status text:', response.statusText);
      
      const responseData = await response.json();
      console.log('DEBUG: Response data:', JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        console.error('DEBUG: Response not OK');
        console.error('DEBUG: Error data:', JSON.stringify(responseData, null, 2));
        throw new Error(responseData.error || 'Failed to register user');
      }

      console.log('DEBUG: Registration successful');
      console.log('=== Register User Debug End ===');
      
      return responseData;
    } catch (error) {
      console.error('DEBUG: Caught error in registerUser');
      console.error('DEBUG: Full error:', JSON.stringify(error, null, 2));
      console.error('=== Register User Debug End with Error ===');
      throw error;
    }
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    console.log('=== Update Profile Debug Start ===');
    console.log('DEBUG: Starting profile update');
    console.log('DEBUG: UserId:', userId);
    console.log('DEBUG: Update data:', JSON.stringify(updates, null, 2));

    try {
      const headers = await getAuthHeader();
      console.log('DEBUG: Auth headers:', JSON.stringify(headers, null, 2));

      const response = await fetch(`${Config.apiUrl}/users/${userId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });

      console.log('DEBUG: Response status:', response.status);
      const responseData = await response.json();
      console.log('DEBUG: Response data:', JSON.stringify(responseData, null, 2));

      if (response.ok) {
        console.log('DEBUG: Profile update successful');
        console.log('=== Update Profile Debug End ===');
        return {
          success: true,
          message: responseData.message || 'Profile updated successfully!',
          user: responseData.user,
        };
      }

      throw new Error(responseData.error || 'Profile update failed!');
    } catch (error) {
      console.error('DEBUG: Update profile error:', error);
      console.error('DEBUG: Full error:', JSON.stringify(error, null, 2));
      console.error('=== Update Profile Debug End with Error ===');
      throw error;
    }
  },

  async createOrUpdateUser(userData: Partial<User>) {
    console.log('=== Create/Update User Debug Start ===');
    console.log('DEBUG: Starting user create/update');
    console.log('DEBUG: User data:', JSON.stringify(userData, null, 2));

    try {
      const headers = await getAuthHeader();
      console.log('DEBUG: Auth headers:', JSON.stringify(headers, null, 2));

      const response = await fetch(`${Config.apiUrl}/users`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(userData),
      });

      console.log('DEBUG: Response status:', response.status);
      const responseData = await response.json();
      console.log('DEBUG: Response data:', JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        throw new Error('Failed to create/update user');
      }

      console.log('DEBUG: Create/Update successful');
      console.log('=== Create/Update User Debug End ===');
      return responseData;
    } catch (error) {
      console.error('DEBUG: Create/Update user error:', error);
      console.error('DEBUG: Full error:', JSON.stringify(error, null, 2));
      console.error('=== Create/Update User Debug End with Error ===');
      throw error;
    }
  },

  async fetchUserProfile(userId: string): Promise<User> {
    console.log('=== Fetch Profile Debug Start ===');
    console.log('DEBUG: Starting profile fetch');
    console.log('DEBUG: UserId:', userId);

    try {
      const headers = await getAuthHeader();
      console.log('DEBUG: Auth headers:', JSON.stringify(headers, null, 2));

      const response = await fetch(`${Config.apiUrl}/users/${userId}`, {
        headers,
      });

      console.log('DEBUG: Response status:', response.status);
      const responseData = await response.json();
      console.log('DEBUG: Response data:', JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      console.log('DEBUG: Profile fetch successful');
      console.log('=== Fetch Profile Debug End ===');
      return responseData;
    } catch (error) {
      console.error('DEBUG: Fetch profile error:', error);
      console.error('DEBUG: Full error:', JSON.stringify(error, null, 2));
      console.error('=== Fetch Profile Debug End with Error ===');
      throw error;
    }
  }
};