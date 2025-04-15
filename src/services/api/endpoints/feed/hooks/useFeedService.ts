import { useState, useRef } from "react";
import { FeedService } from "../FeedService";
import { useAuth } from "@clerk/clerk-expo";
import { Post } from "../types/feed.types";
import { ApiResponse } from "../../../core/types/api.types";

export const useFeedService = () => {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const serviceRef = useRef(new FeedService(getToken));

  const fetchPosts = async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<Post[]>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await serviceRef.current.fetchPosts(page, limit);
      setIsLoading(false);
      
      if (response.error) {
        setError(response.error);
      }
      
      return response;
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to fetch posts";
      setError(errorMessage);
      
      return {
        data: [],
        error: errorMessage,
        status: 500,
      };
    }
  };

  const createPost = async (postData: FormData): Promise<ApiResponse<Post>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await serviceRef.current.createPost(postData);
      setIsLoading(false);
      
      if (response.error) {
        setError(response.error);
      }
      
      return response;
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to create post";
      setError(errorMessage);
      
      return {
        data: null,
        error: errorMessage,
        status: 500,
      };
    }
  };

  const likePost = async (
    postId: string,
    username: string
  ): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await serviceRef.current.likePost(postId, username);
      setIsLoading(false);
      
      if (response.error) {
        setError(response.error);
      }
      
      return response;
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to like post";
      setError(errorMessage);
      
      return {
        data: undefined,
        error: errorMessage,
        status: 500,
      };
    }
  };

  const unlikePost = async (
    postId: string,
    likeId: string
  ): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await serviceRef.current.unlikePost(postId, likeId);
      setIsLoading(false);
      
      if (response.error) {
        setError(response.error);
      }
      
      return response;
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to unlike post";
      setError(errorMessage);
      
      return {
        data: undefined,
        error: errorMessage,
        status: 500,
      };
    }
  };

  const addComment = async (
    postId: string,
    username: string,
    comment: string
  ): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await serviceRef.current.addComment(postId, username, comment);
      setIsLoading(false);
      
      if (response.error) {
        setError(response.error);
      }
      
      return response;
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to add comment";
      setError(errorMessage);
      
      return {
        data: undefined,
        error: errorMessage,
        status: 500,
      };
    }
  };

  const deleteComment = async (
    postId: string,
    commentId: string
  ): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await serviceRef.current.deleteComment(postId, commentId);
      setIsLoading(false);
      
      if (response.error) {
        setError(response.error);
      }
      
      return response;
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to delete comment";
      setError(errorMessage);
      
      return {
        data: undefined,
        error: errorMessage,
        status: 500,
      };
    }
  };

  const deletePost = async (postId: string): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await serviceRef.current.deletePost(postId);
      setIsLoading(false);
      
      if (response.error) {
        setError(response.error);
      }
      
      return response;
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to delete post";
      setError(errorMessage);
      
      return {
        data: undefined,
        error: errorMessage,
        status: 500,
      };
    }
  };

  return {
    isLoading,
    error,
    fetchPosts,
    createPost,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
    deletePost,
  };
};