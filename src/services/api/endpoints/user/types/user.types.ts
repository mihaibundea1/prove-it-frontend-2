// services/api/endpoints/user/types/user.types.ts
export interface UserAnswers {
    version: number;
    responses: Record<string, any>;
  }
  
  export interface User {
    id?: string;
    clerkId: string;
    date_of_birth: Date;
    height: number;
    weight: number;
    bio: string;
    posts: string[];
    post_count: number;
    followers: string[];
    followers_count: number;
    following: string[];
    following_count: number;
    created_at: Date;
    updated_at: Date;
    questions_completed: boolean;
    profile_completed: boolean;
    answers: UserAnswers;
  }