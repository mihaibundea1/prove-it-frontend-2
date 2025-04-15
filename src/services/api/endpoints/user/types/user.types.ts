import { Post } from "@/types/feed.types";
import { Response } from "@/types/question.types";

// Including Clerk-specific fields in the User type
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

export interface Goal {
  goal_id: string | null;
  name: string;
  unit: string;
  target: number;
  current: number;
  created_at: Date;
  updated_at: Date;
  target_day: Date;
}


// Define the SearchedUser type
export interface SearchedUser {
  avatar: string;
  id: string;
  localId: string;
  username: string;
};


export interface Achievement {
  name: string;
  emoji: string;
  status: 'ACHIEVED' | 'IN_PROGRESS';
  progress: number;
  required_progress: number;
  description: string;
  created_at: Date;
  updated_at: Date;
}

// Updated User type to include Clerk-specific fields
export interface User {
  _id: string;
  clerkId: string; // Clerk ID
  email: string; // Clerk email
  firstName: string; // Clerk first name
  lastName: string; // Clerk last name
  username: string // Clerk username
  avatarUrl?: string; // Optional Clerk avatar URL
  date_of_birth: Date;
  height: number;
  weight: number;
  measurement_system: 'imperial' | 'metric';
  gender: 'male' | 'female';
  premium: boolean;
  medicalConditions: string[];
  bio: string;
  posts: string[];
  post_count: number;
  followers: Follower[];
  followers_count: number;
  following: Following[];
  following_count: number;
  created_at: Date;
  updated_at: Date;
  questions_completed: boolean;
  profile_completed: boolean;
  answers: Answers;
  goals: Goal[];
  achievements: Achievement[];
}

export interface UserContextState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isClerkLoaded?: boolean;
}

interface UserContextActions {
  registerUser: (clerkId: string) => Promise<User | null>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<User | null>;
  fetchUserProfile: (clerkId: string) => Promise<User | null>;
  refreshUser: () => Promise<User | null>;
}

export type UserContextType = UserContextState & UserContextActions;
