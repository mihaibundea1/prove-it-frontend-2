import { Post } from '../../types/feed.types';
import { Config } from '../../config/env';
import { getAuthHeader } from '../../utils/auth.utils';

export const feedAPI = {
  async fetchPosts(page: number = 1): Promise<Post[]> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${Config.apiUrl}/posts?page=${page}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch posts error:', error);
      throw error;
    }
  },

  async createPost(content: string, images?: string[]): Promise<Post> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${Config.apiUrl}/posts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content, images })
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      return await response.json();
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  },

  async likePost(postId: string): Promise<void> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${Config.apiUrl}/posts/${postId}/like`, {
        method: 'POST',
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }
    } catch (error) {
      console.error('Like post error:', error);
      throw error;
    }
  }
};