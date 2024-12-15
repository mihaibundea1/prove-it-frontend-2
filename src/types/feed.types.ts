export interface Post {
  _id: string; // Unique identifier for the post
  post_id: string; // Post ID
  credentials_id: string; // ID of the user credentials
  username: string; // Username of the post creator
  description: string; // Post description
  image_url: string; // URL to the post image
  post_date: string; // Date the post was created (ISO format)
  like_count: number; // Total count of likes
  comment_count: number; // Total count of comments
  likes: Like[]; // Array of likes associated with the post
  comments: Comment[]; // Array of comments associated with the post
}

export interface Like {
  like_id: string; // Unique identifier for the like
  username: string; // Username of the person who liked the post
  date: string; // Date the like was added (ISO format)
}

// Type for a Comment
export interface Comment {
  comment_id: string; // Unique identifier for the comment
  username: string; // Username of the person who commented
  comment: string; // Comment text (note: changed from 'text' to 'comment')
  comment_date: string; // Date the comment was added (ISO format)
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
