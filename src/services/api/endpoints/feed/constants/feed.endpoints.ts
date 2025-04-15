export const FEED_ENDPOINTS = {
  BASE: '/posts',  // Fetch posts (GET /posts?page=X&limit=Y)
  POST: '/',  // Create a post (POST /)
  LIKE: (post_id: string) => `/like/${post_id}`,  // Like a post (POST /like/post_id)
  UNLIKE: (post_id: string, like_id: string) => `/unlike/${post_id}/${like_id}`,  // Unlike a post (DELETE /like/post_id/like_id)
  COMMENT: (post_id: string) => `/comment/${post_id}`,  // Add a comment (POST /comment/post_id)
  DELETE_COMMENT: (post_id: string, comment_id: string) => `/delete_comment/${post_id}/${comment_id}`,  // Delete a comment (DELETE /delete_comment/post_id/comment_id)
  DELETE_POST: (post_id: string) => `/delete_post/${post_id}`,  // Delete a post (DELETE /delete_post/post_id),
  FETCH: (page: number, limit: number) => `/?page=${page}&limit=${limit}`,
} as const;
