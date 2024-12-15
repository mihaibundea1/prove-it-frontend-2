import { Post } from '../types/feed.types';

export const feedUtils = {
  formatPost(data: any): Post {
    return {
      _id: data._id,
      userId: data.userId,
      content: data.content,
      images: data.images || [],
      likes: data.likes || 0,
      comments: data.comments || 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  },

  formatPosts(posts: any[]): Post[] {
    return posts.map(post => feedUtils.formatPost(post));
  },

  sortPostsByDate(posts: Post[]): Post[] {
    return [...posts].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
};