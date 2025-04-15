// services/api/endpoints/user/UserService.ts
import { BaseApiService } from "../../core/BaseApiService";
import { ApiResponse } from "../../core/types/api.types";
import { User, Achievement, SearchedUser } from "./types/user.types";
import { USER_ENDPOINTS } from "./constants/user.endpoints";

export class UserService extends BaseApiService {
  constructor(getToken?: () => Promise<string | null>) {
    super(USER_ENDPOINTS.BASE, getToken ?? (() => Promise.resolve(null)));
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
        responses: [],
      },
    };
  }

  async registerUser(clerkId: string): Promise<ApiResponse<User>> {
    const userData = this.createDefaultUserData(clerkId);
    return this.post<User>(USER_ENDPOINTS.REGISTER, userData);
  }

  async updateProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<ApiResponse<User>> {
    return this.patch<User>(USER_ENDPOINTS.UPDATE(userId), updates);
  }

  async fetchUserProfile(clerk_id: string): Promise<ApiResponse<User>> {
    return this.get<User>(USER_ENDPOINTS.PROFILE_BY_CLERK_ID(clerk_id));
  }

  async createOrUpdateUser(
    userData: Partial<User>
  ): Promise<ApiResponse<User>> {
    return this.put<User>("", userData);
  }


  async followUser(
    followee_id: string,
    followee_username: string,
    follower_id: string,
    follower_username: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>(USER_ENDPOINTS.FOLLOW(followee_id), {
      followee_id,
      followee_username,
      follower_id,
      follower_username,
    });
  }

  async unfollowUser(
    followee_id: string,
    followee_username: string,
    follower_id: string,
    follower_username: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>(
      USER_ENDPOINTS.UNFOLLOW(followee_id),
      {
        followee_id,
        followee_username,
        follower_id,
        follower_username,
      }
    );
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<ApiResponse<User>> {
    const payload = {
      user_id: userId,
      ...updates,
    };
    return this.post<User>(USER_ENDPOINTS.UPDATE_USER, payload);
  }

  
  async createGoal(
    userId: string,
    goalData: {
      name: string;
      unit: string;
      target: number;
      target_day: Date;
    }
  ): Promise<ApiResponse<{ goal_id: string }>> {
    console.log(
      "USER_ENDPOINTS.CREATE_GOAL(userId)",
      USER_ENDPOINTS.CREATE_GOAL(userId)
    );

    return this.post<{ goal_id: string }>(
      USER_ENDPOINTS.CREATE_GOAL(userId),
      goalData
    );
  }

  async getUserGoals(userId: string): Promise<ApiResponse<any[]>> {
    return this.get<any[]>(USER_ENDPOINTS.GET_ALL_GOALS(userId));
  }

  // Get single goal
  async getSingleGoal(
    userId: string,
    goalId: string
  ): Promise<ApiResponse<any>> {
    return this.get<any>(USER_ENDPOINTS.GET_SINGLE_GOAL(userId, goalId));
  }

  // Update goal
  async updateGoal(
    userId: string,
    goalId: string,
    goalData: Partial<any>
  ): Promise<ApiResponse<any>> {
    return this.put<any>(USER_ENDPOINTS.UPDATE_GOAL(userId, goalId), goalData);
  }

  // Delete goal
  async deleteGoal(userId: string, goalId: string): Promise<ApiResponse<any>> {
    return this.delete<any>(USER_ENDPOINTS.DELETE_GOAL(userId, goalId));
  }

  // Increment goal progress
  async incrementGoalProgress(
    userId: string,
    goalId: string,
    amount: number
  ): Promise<ApiResponse<any>> {
    return this.patch<any>(
      USER_ENDPOINTS.INCREMENT_GOAL_PROGRESS(userId, goalId),
      { amount }
    );
  }

  async checkAchievements(
    userId: string
  ): Promise<ApiResponse<Achievement[] | null>> {
    const response = await this.get<{ achievements: Achievement[] }>(
      USER_ENDPOINTS.CHECK_ACHIEVEMENTS(userId)
    );

    return {
      data: response.data?.achievements || null,
      error: response.error,
      status: response.status,
    };
  }

  async searchUsers(query: string, limit: number = 10): Promise<ApiResponse<SearchedUser[]>> {
    const cappedLimit = Math.min(limit, 50); // Ensure limit never exceeds 50
    return this.get<SearchedUser[]>(USER_ENDPOINTS.SEARCH_USERS(query, cappedLimit));
  }
  
}
