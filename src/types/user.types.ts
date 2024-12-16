// src/types/user.types.ts
export interface User {
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
  answers: {
    version: number;
    responses: Record<string, string[]>;
  };
}

export interface UserContextState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isClerkLoaded?: boolean;  // Adăugăm proprietatea pentru Clerk
}

export interface UserContextActions {
  refreshUser: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export type UserContextType = UserContextState & UserContextActions;