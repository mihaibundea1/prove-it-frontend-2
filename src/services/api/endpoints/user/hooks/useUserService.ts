import { useRef, useCallback, useState } from 'react';
import { UserService } from '../UserService';
import { User, Achievement } from '../types/user.types';
import { ApiResponse } from '../../../core/types/api.types';
import { useAuth, useUser } from '@clerk/clerk-expo';

export const useUserService = () => {
  const { getToken, userId: clerkUserId } = useAuth();
  const { user: clerkUser } = useUser();
  const serviceRef = useRef(new UserService(getToken));

  // State management for user data
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isSearching, setIsSearching] = useState(false);

  // Register a new user
  const registerUser = useCallback(
    async (clerkId: string): Promise<User | null> => {
      setIsLoading(true);
      try {
        const response = await serviceRef.current.registerUser(clerkId);
        if (response.data) {
          setUser(response.data);
          return response.data;
        }
        return null;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Undefined error");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateUserProfile = useCallback(async (
    userId: string,
    updates: Partial<User>
): Promise<User | null> => {
    setIsLoading(true);
    try {
        const response = await serviceRef.current.updateUserProfile(userId, updates);
        if (response.data) {
            setUser(prev => ({ ...prev, ...response.data! }));
            return response.data;
        }
        return null;
    } catch (error) {
        setError(error instanceof Error ? error.message : "Update failed");
        return null;
    } finally {
        setIsLoading(false);
    }
}, []);

  // Update user profile
  const updateProfile = useCallback(
    async (userId: string, updates: Partial<User>): Promise<User | null> => {
      setIsLoading(true);
      try {
        const response = await serviceRef.current.updateProfile(
          userId,
          updates
        );
        if (response.data) {
          setUser(response.data);
          return response.data;
        }
        return null;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Undefined error");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Fetch user profile
  const fetchUserProfile = useCallback(
    async (clerkId: string): Promise<User | null> => {
      setIsLoading(true);
      try {
        const response = await serviceRef.current.fetchUserProfile(clerkId);

        if (response.data) {
          //console.log("response.data:", response.data);
          // Explicitly cast response.data as User
          const userData = response.data as User;

          // Handle MongoDB ObjectId
          if (userData._id) {
            userData._id = userData._id;
          }

          // // Merge Clerk user data
          // const mergedUserData: User = {
          //   ...userData,
          //   firstName: clerkUser?.firstName || userData.firstName,
          //   lastName: clerkUser?.lastName || userData.lastName,
          //   email: clerkUser?.emailAddresses[0]?.emailAddress || userData.email,
          //   username: clerkUser?.username || userData.username,
          //   avatarUrl: clerkUser?.imageUrl || userData.avatarUrl,
          // };

          setUser(userData);
          return userData;
        }

        if (response.error) {
          setError(response.error);
        }
        return null;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Undefined error");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [clerkUser]
  );

  // Create or update user
  const createOrUpdateUser = useCallback(
    async (userData: Partial<User>): Promise<User | null> => {
      setIsLoading(true);
      try {
        const response = await serviceRef.current.createOrUpdateUser(userData);
        if (response.data) {
          setUser(response.data);
          return response.data;
        }
        return null;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Undefined error");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchUserGoals = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await serviceRef.current.getUserGoals(userId);
      
      if (response.data) {
        // Optionally update user goals in state if needed
        return response.data;
      }
      
      return null;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch goals");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an existing goal
  const createGoal = useCallback(async (
    user_id: string,
    goalData: {
      name: string;
      unit: string;
      target: number;
      target_day: Date;
    }
  ): Promise<string | null> => {
    setIsLoading(true);
    try {
      const response = await serviceRef.current.createGoal(user_id, goalData);
      if (response.data?.goal_id) {
        // Optimistic update: add new goal immediately
        setUser(prev => prev ? {
          ...prev,
          goals: [
            ...prev.goals,
            {
              ...goalData,
              goal_id: response.data!.goal_id,
              current: 0,
              created_at: new Date(),
              updated_at: new Date(),
              target_day: goalData.target_day
            }
          ]
        } : null);
        return response.data.goal_id;
      }
      return null;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create goal");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  // Update an existing goal and update local state optimistically
  const updateGoal = useCallback(async (
    userId: string,
    goal_id: string,
    goalData: Partial<any>
  ) => {
    setIsLoading(true);
    try {
      const response = await serviceRef.current.updateGoal(userId, goal_id, goalData);
      if (response.data) {
        // Optimistic update: update goal properties immediately
        setUser(prev => {
          if (!prev) return null;
          const updatedGoals = prev.goals.map(goal =>
            goal.goal_id === goal_id ? { ...goal, ...goalData, updated_at: new Date() } : goal
          );
          return { ...prev, goals: updatedGoals };
        });
        return response.data;
      }
      return null;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update goal");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Increment goal progress and update local state optimistically
  const incrementGoalProgress = useCallback(async (
    userId: string,
    goal_id: string,
    amount: number
  ) => {
    setIsLoading(true);
    try {
      const response = await serviceRef.current.incrementGoalProgress(userId, goal_id, amount);
      if (response.data) {
        // Optimistic update: adjust the current progress immediately
        setUser(prev => {
          if (!prev) return null;
          const updatedGoals = prev.goals.map(goal => {
            if (goal.goal_id === goal_id) {
              const newCurrent = Math.min(goal.current + amount, goal.target);
              return { ...goal, current: newCurrent, updated_at: new Date() };
            }
            return goal;
          });
          return { ...prev, goals: updatedGoals };
        });
        return response.data;
      }
      return null;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to increment goal progress");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a goal and update local state optimistically
  const deleteGoal = useCallback(async (
    userId: string,
    goal_id: string
  ) => {
    setIsLoading(true);
    try {
      const response = await serviceRef.current.deleteGoal(userId, goal_id);
      if (response.data) {
        // Optimistic update: remove the goal immediately
        setUser(prev => {
          if (!prev) return null;
          const filteredGoals = prev.goals.filter(goal => goal.goal_id !== goal_id);
          return { ...prev, goals: filteredGoals };
        });
        return response.data;
      }
      return null;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete goal");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optionally, you could also provide a function to refresh goal data from the server
  // if you suspect your optimistic updates might be out-of-sync.
  const refreshUserData = useCallback(async (): Promise<User | null> => {
    if (clerkUserId) {
      return await fetchUserProfile(clerkUserId);
    }
    return null;
  }, [clerkUserId, fetchUserProfile]);

  const followUser = useCallback(
    async (
      followee_id: string,
      followee_username: string,
      follower_id: string,
      follower_username: string
    ): Promise<boolean> => {
      if (!follower_id) return false;
      console.log(followee_id,
        followee_username,
        follower_id,
        follower_username)
      setIsLoading(true);
      try {
        const response = await serviceRef.current.followUser(
          followee_id,
          followee_username,
          follower_id,
          follower_username
        );
        return !!response.data;
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Follow action failed"
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const unfollowUser = useCallback(
    async (
      followee_id: string,
      followee_username: string,
      follower_id: string,
      follower_username: string
    ): Promise<boolean> => {
      if (!follower_id) return false;

      setIsLoading(true);
      try {
        const response = await serviceRef.current.unfollowUser(
          followee_id,
          followee_username,
          follower_id,
          follower_username
        );
        return !!response.data;
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unfollow action failed"
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  const checkAchievements = useCallback(async (userId: string): Promise<Achievement[] | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await serviceRef.current.checkAchievements(userId);
      if (response.data) {
        setUser(prev => prev ? { ...prev, achievements: response.data || [] } : null);
        return response.data;
      }
      setError(response.error || "Failed to check achievements");
      return null;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to check achievements");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchUsers = useCallback(async (query: string) => {
    setIsSearching(true);
    try {
      const response = await serviceRef.current.searchUsers(query);
      return response.data || [];
    } catch (error) {
      setError(error instanceof Error ? error.message : "Search failed");
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    registerUser,
    updateProfile,
    fetchUserProfile,
    createOrUpdateUser,
    updateUserProfile,
    refreshUserData,
    followUser,
    unfollowUser,
    createGoal,
    fetchUserGoals,
    updateGoal,
    incrementGoalProgress,
    deleteGoal,
    checkAchievements,
    searchUsers,
    isSearching,
  };
};
