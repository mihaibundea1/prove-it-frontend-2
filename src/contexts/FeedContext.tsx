import { createContext, useContext, useEffect, useState } from "react";
import { useFeedService } from "@/services/api/endpoints/feed/hooks/useFeedService";
import { FeedContextType, Post, FeedContextState } from "../types/feed.types";
import { ApiResponse } from "@/services/api/core/types/api.types";

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    loading,
    fetchPosts,
    createPost,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
    deletePost,
  } = useFeedService();
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleFetchPosts = async (page: number = 1, limit: number = 10) => {
    try {
      const response = await fetchPosts(page, limit);
      if (response.data) {
        const formattedPosts = response.data.map((post: any) => ({
          ...post,
          created_at: post.created_at?.$date || post.created_at, // Fix date format
          updated_at: post.updated_at?.$date || post.updated_at, // Fix date format
        }));

        setPosts(formattedPosts);
        setHasMore(response.data.length === limit);
        setError(null);
      } else {
        throw new Error(response.error || "Failed to fetch posts");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    }
  };

  const refreshPosts = async () => {
    const response: ApiResponse<Post[]> = await fetchPosts();
    if (response.data) {
      setPosts(response.data);
      setHasMore(response.data.length > 0);
    } else if (response.error) {
      setError(response.error);
      console.error("Error fetching posts:", response.error);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore) return; // Prevent unnecessary calls if no more posts

    const nextPage = Math.ceil(posts.length / 10) + 1;
    console.log("Fetching page:", nextPage);

    try {
      const response: ApiResponse<Post[]> = await fetchPosts(nextPage);

      if (response.data && response.data.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...response.data!]);
        setHasMore(response.data.length === 10); // Only set to true if full batch
      } else {
        console.log("No more posts to load");
        setHasMore(false); // Stop fetching
      }
    } catch (err) {
      console.error("Error fetching more posts:", err);
      setHasMore(false); // Prevent infinite loops on error
    }
  };

  const handleCreatePost = async (postData: FormData) => {
    try {
      const response: ApiResponse<Post> = await createPost(postData);
      console.log("Create post response:", response); // Debugging

      if (response.data) {
        // Fix date formatting
        const formattedPost: Post = {
          ...response.data,
          created_at:
            typeof response.data.created_at === "object"
              ? response.data.created_at.$date
              : response.data.created_at,
          updated_at:
            typeof response.data.updated_at === "object"
              ? response.data.updated_at.$date
              : response.data.updated_at,
        };

        setPosts((prevPosts) => [formattedPost, ...prevPosts]);
        setError(null);
      } else {
        throw new Error(response.error || "Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while creating the post"
      );
    }
  };

  const handleLikePost = async (postId: string, username: string) => {
    try {
      const response = await likePost(postId, username);
      if (!response.error) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: [
                    ...post.likes,
                    {
                      like_id: Date.now().toString(),
                      username,
                      created_at: new Date().toISOString(),
                    },
                  ],
                  like_count: post.like_count + 1,
                }
              : post
          )
        );
        setError(null);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to like post");
    }
  };

  const handleUnlikePost = async (postId: string, likeId: string) => {
    try {
      const response = await unlikePost(postId, likeId);
      if (!response.error) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: post.likes.filter((like) => like.like_id !== likeId),
                  like_count: post.like_count - 1,
                }
              : post
          )
        );
        setError(null);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlike post");
    }
  };

  const handleAddComment = async (
    postId: string,
    username: string,
    comment: string
  ) => {
    try {
      const response = await addComment(postId, username, comment);
      if (!response.error) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    {
                      comment_id: Date.now().toString(),
                      username,
                      comment,
                      created_at: new Date().toISOString(),
                    },
                  ],
                  comment_count: post.comment_count + 1,
                }
              : post
          )
        );
        setError(null);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment");
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      const response = await deleteComment(postId, commentId);
      if (!response.error) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: post.comments.filter(
                    (comment) => comment.comment_id !== commentId
                  ),
                  comment_count: post.comment_count - 1,
                }
              : post
          )
        );
        setError(null);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete comment");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await deletePost(postId);
      if (!response.error) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
        setError(null);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  return (
    <FeedContext.Provider
      value={{
        // State
        posts,
        loading,
        error,
        hasMore,
        // Actions
        loadMorePosts,
        refreshPosts,
        createPost: handleCreatePost,
        fetchPosts: handleFetchPosts,
        likePost: handleLikePost,
        unlikePost: handleUnlikePost,
        addComment: handleAddComment,
        deleteComment: handleDeleteComment,
        deletePost: handleDeletePost,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = (): FeedContextType => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
};
