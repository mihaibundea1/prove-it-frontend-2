// src/services/api/user.api.ts
import { User } from '@/types/user.types';
import { USER as USER_ENDPOINTS } from './endpoints/user.endpoints'
import { BaseApiService } from './base.api';

class UserApiService extends BaseApiService {
  private createDefaultUserData(clerkId: string): Partial<User> {
    return {
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
  }

  async registerUser(clerkId: string, authToken: string): Promise<User> {
    const userData = this.createDefaultUserData(clerkId);
    return this.handleRequest(
      'Register User',
      () => this.api.post<User>(USER_ENDPOINTS.REGISTER, userData),
      { clerkId, userData }
    );
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    return this.handleRequest(
      'Update Profile',
      () => this.api.patch<User>(USER_ENDPOINTS.UPDATE(userId), updates),
      { userId, updates }
    );
  }

  async fetchUserProfile(userId: string): Promise<User> {
    return this.handleRequest(
      'Fetch Profile',
      () => this.api.get<User>(USER_ENDPOINTS.PROFILE(userId)),
      { userId }
    );
  }

  async createOrUpdateUser(userData: Partial<User>): Promise<User> {
    return this.handleRequest(
      'Create/Update User',
      () => this.api.put<User>(USER_ENDPOINTS.BASE, userData),
      { userData }
    );
  }
}

export const useUserApi = () => {
  return new UserApiService();
};