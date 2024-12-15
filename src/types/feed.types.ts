export interface Post {
    _id: string;
    userId: string;
    content: string;
    images?: string[];
    likes: number;
    comments: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface FeedContextState {
    posts: Post[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
  }
  
  export interface FeedContextActions {
    loadMorePosts: () => void;
    refreshPosts: () => Promise<void>;
  }
  
  export type FeedContextType = FeedContextState & FeedContextActions;