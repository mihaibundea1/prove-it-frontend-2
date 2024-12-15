import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { FeedContextType, Post } from '../types/feed.types';
import { feedAPI } from '../services/api/feed.api';
import { feedUtils } from '../utils/feed.utils';

const FeedContext = createContext<FeedContextType | undefined>(undefined);

interface FeedProviderProps {
  children: ReactNode;
}

export const FeedProvider: React.FC<FeedProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (pageNum: number = 1, isRefresh: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await feedAPI.fetchPosts(pageNum);
      const formattedPosts = feedUtils.formatPosts(data);
      
      if (formattedPosts.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setPosts(prevPosts => {
        if (isRefresh || pageNum === 1) {
          return formattedPosts;
        }
        const combinedPosts = [...prevPosts, ...formattedPosts];
        return feedUtils.sortPostsByDate(combinedPosts);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMorePosts = useCallback(() => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  }, [hasMore, loading]);

  const refreshPosts = useCallback(async () => {
    setPage(1);
    await fetchPosts(1, true);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page, fetchPosts]);

  const value: FeedContextType = {
    posts,
    loading,
    error,
    hasMore,
    loadMorePosts,
    refreshPosts
  };

  return (
    <FeedContext.Provider value={value}>
      {children}
    </FeedContext.Provider>
  );
};

export default FeedContext;