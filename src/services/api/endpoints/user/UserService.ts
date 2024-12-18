// services/api/endpoints/user/UserService.ts
import { BaseApiService } from '../../core/BaseApiService';
import { ApiResponse } from '../../core/types/api.types';
import { User } from './types/user.types';
import { USER_ENDPOINTS } from './constants/user.endpoints';

export class UserService extends BaseApiService {
  constructor() {
    super(USER_ENDPOINTS.BASE);
  }

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

  async registerUser(clerkId: string): Promise<ApiResponse<User>> {
    const userData = this.createDefaultUserData(clerkId);
    return this.post<User>(USER_ENDPOINTS.REGISTER, userData);
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    return this.patch<User>(USER_ENDPOINTS.UPDATE(userId), updates);
  }

  async fetchUserProfile(userId: string): Promise<ApiResponse<User>> {
    return this.get<User>(USER_ENDPOINTS.PROFILE(userId));
  }

  async createOrUpdateUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.put<User>('', userData);
  }
}