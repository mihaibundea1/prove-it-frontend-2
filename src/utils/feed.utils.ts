import { Post } from '../types/feed.types';

export const feedUtils = {
  formatPost(data: any): Post {
    return {
      _id: data._id,
      user_id: data.user_id,
      username: data.username,
      description: data.description,
      image_url: data.image_url || [],
      likes: data.likes || 0,
      like_count: data.like_count || 0,
      comments: data.comments || 0,
      comment_count: data.comment_count || 0,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  formatPosts(posts: any[]): Post[] {
    return posts.map(post => feedUtils.formatPost(post));
  },

  sortPostsByDate(posts: Post[]): Post[] {
    return [...posts].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
};