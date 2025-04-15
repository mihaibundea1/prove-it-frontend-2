import type { Post, Like, Comment } from "@/types/feed.types";
export { Post, Like, Comment };

export interface FeedResponse {
  posts: Post[];
  error?: string;
}

export interface PostDetailResponse {
  post: Post;
  error?: string;
}

export interface FeedContextType {
  posts: Post[];
  loadingPosts: boolean;
  error: string | null;
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
