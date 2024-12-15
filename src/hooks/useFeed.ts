import { useContext, useCallback } from 'react';
import FeedContext from '../contexts/FeedContext';
import { FeedContextType, Post } from '../types/feed.types';
import { feedAPI } from '../services/api/feed.api';

export const useFeed = (): FeedContextType => {
  const context = useContext(FeedContext);
  
  if (context === undefined) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  
  return context;
};

export const useFeedActions = () => {
  const { refreshPosts } = useFeed();

  const createPost = useCallback(async (content: string, images?: string[]) => {
    try {
      await feedAPI.createPost(content, images);
      await refreshPosts(); // Reîmprospătează feed-ul după creare
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }, [refreshPosts]);

  const likePost = useCallback(async (postId: string) => {
    try {
      await feedAPI.likePost(postId);
      await refreshPosts(); // Reîmprospătează feed-ul după like
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }, [refreshPosts]);

  return {
    createPost,
    likePost
  };
};