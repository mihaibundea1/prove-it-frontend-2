export interface Post {
  _id: string; // Unique identifier for the post
  user_id: string; // User ID
  username: string; // Username of the post creator
  description: string; // Post description
  image_url: string; // URL to the post image
  created_at: string | {$date: string}; // Date the post was created (ISO format)
  updated_at: string | {$date: string}; // Date the post was edited
  like_count: number; // Total count of likes
  comment_count: number; // Total count of comments
  likes: Like[]; // Array of likes associated with the post
  comments: Comment[]; // Array of comments associated with the post
}

export interface Like {
  like_id: string; // Unique identifier for the like
  username: string; // Username of the person who liked the post
  created_at: string; // Date the like was added (ISO format)
}

// Type for a Comment
export interface Comment {
  comment_id: string; // Unique identifier for the comment
  username: string; // Username of the person who commented
  comment: string; // Comment text (note: changed from 'text' to 'comment')
  created_at: string; // Date the comment was added (ISO format)
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
  createPost: (postData: FormData) => Promise<void>;
  fetchPosts: (page?: number, limit?: number) => Promise<void>;
  likePost: (postId: string, username: string) => Promise<void>;
  unlikePost: (postId: string, likeId: string) => Promise<void>;
  addComment: (
    postId: string,
    username: string,
    comment: string
  ) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

export type FeedContextType = FeedContextState & FeedContextActions;
