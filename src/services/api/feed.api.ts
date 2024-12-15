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
  },

  async unlikePost(postId: string, likeId: string): Promise<void> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${Config.apiUrl}/posts/${postId}/unlike/${likeId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to unlike post');
      }
    } catch (error) {
      console.error('Unlike post error:', error);
      throw error;
    }
  },

  async fetchComments(postId: string): Promise<Comment[]> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${Config.apiUrl}/posts/comments/${postId}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch comments error:', error);
      throw error;
    }
  },

  async addComment(postId: string, username: string, text: string): Promise<void> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${Config.apiUrl}/posts/comment/${postId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ username, text })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${Config.apiUrl}/posts/delete_comment/${postId}/${commentId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Delete comment error:', error);
      throw error;
    }
  },

  async deletePost(postId: string, postUniqueId: string): Promise<void> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${Config.apiUrl}/posts/delete_post/${postId}?post_id=${postUniqueId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  }

};

