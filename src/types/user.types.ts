// src/types/user.types.ts
export interface User {
    _id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    followersCount?: number;
    followingCount?: number;
    postCount?: number;
    bio?: string;
    answers?: {
      version: number;
      responses: Record<string, string[]>;
    };
    createdAt?: string;
    updatedAt?: string;
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