import { Post } from "./feed.types"
import { Response } from "./question.types"

export interface Follower {
  follower_id: string;
  username: string;
}

export interface Following {
  following_id: string;
  username: string;
}

export interface Answers {
  version: number;
  responses: Response[];
}

export interface User {
  _id: string; // MongoDB ObjectId (string representation)
  clerkId: string;
  date_of_birth: Date; 
  height: number;
  weight: number;
  bio: string;
  posts: Post[]; // Changed from string[] to Post[]
  post_count: number;
  followers: Follower[]; // Changed from string[] to Follower[]
  followers_count: number;
  following: Following[]; // Changed from string[] to Following[]
  following_count: number;
  created_at: Date; 
  updated_at: Date; 
  questions_completed: boolean;
  profile_completed: boolean;
  answers: Answers;
}

export interface UserContextState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isClerkLoaded?: boolean;  // Optional property for Clerk authentication
}

interface UserContextActions {
  registerUser: (clerkId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  fetchUserProfile: (clerkId: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}
export type UserContextType = UserContextState & UserContextActions;
