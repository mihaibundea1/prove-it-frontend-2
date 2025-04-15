import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useFocusEffect } from "@react-navigation/native";
import { useUserService } from "../services/api/endpoints/user/hooks/useUserService";
import { UserContextType, User } from "../services/api/endpoints/user/types/user.types";

// Create a context with proper typing
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId: clerkUserId, isLoaded: isAuthLoaded } = useAuth();
  const userService = useUserService();
  
  // Track if initial fetch has been attempted
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);
  
  // Refs for managing state and preventing redundant calls
  const lastAchievementCheck = useRef<number>(0);
  const isFetchingUser = useRef(false);
  const lastUserFetch = useRef<number>(0);
  const achievementCheckTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastUserData = useRef<User | null>(null);
  
  // Constants for controlling frequency
  const ACHIEVEMENT_CHECK_COOLDOWN = 5 * 60 * 1000; // 5 minutes
  const USER_FETCH_COOLDOWN = 30 * 1000; // 30 seconds

  // Function to check for user achievements with debounce
  const checkUserAchievements = useCallback(async () => {
    if (!userService.user?._id) return;
    
    const now = Date.now();
    if (now - lastAchievementCheck.current < ACHIEVEMENT_CHECK_COOLDOWN) {
      console.log("Achievement check skipped (cooldown active)");
      return;
    }
    
    // Clear any pending achievement check
    if (achievementCheckTimeout.current) {
      clearTimeout(achievementCheckTimeout.current);
    }
    
    // Schedule the achievement check with a slight delay to allow for batching
    achievementCheckTimeout.current = setTimeout(async () => {
      try {
        console.log("Checking achievements for user:", userService.user?._id);
        lastAchievementCheck.current = Date.now();
        // Fix for error #1: Check if _id exists before passing
        if (userService.user?._id) {
          await userService.checkAchievements(userService.user._id);
          // After checking achievements, refresh user data to get updated achievements
          if (clerkUserId) {
            await userService.fetchUserProfile(clerkUserId);
          }
        }
      } catch (error) {
        console.error("Error checking achievements:", error);
      } finally {
        achievementCheckTimeout.current = null;
      }
    }, 500);
  }, [userService, clerkUserId]);

  // Main function to fetch user data with deduplication
  const fetchUserData = useCallback(async (force = false) => {
    if (!isAuthLoaded || !clerkUserId) return null;
    
    const now = Date.now();
    if (
      isFetchingUser.current || 
      (!force && now - lastUserFetch.current < USER_FETCH_COOLDOWN)
    ) {
      console.log("User fetch skipped (already fetching or cooldown active)");
      return userService.user;
    }
    
    try {
      isFetchingUser.current = true;
      console.log("Fetching user data for:", clerkUserId);
      
      const user = await userService.fetchUserProfile(clerkUserId);
      lastUserFetch.current = Date.now();
      
      // Critical: Check if user data has changed by comparing with our last reference
      const userChanged = JSON.stringify(user) !== JSON.stringify(lastUserData.current);
      if (user && userChanged) {
        console.log("User data changed, triggering achievement check");
        lastUserData.current = user;
        
        // Check achievements when we have new user data that differs from last check
        await checkUserAchievements();
      }
      
      return user;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    } finally {
      isFetchingUser.current = false;
    }
  }, [clerkUserId, isAuthLoaded, checkUserAchievements, userService]);

  // Ensure achievements are checked after initial login
  useEffect(() => {
    if (userService.user && !lastAchievementCheck.current) {
      console.log("Initial achievement check");
      checkUserAchievements();
    }
  }, [userService.user, checkUserAchievements]);

  // Initial data fetch when component mounts
  useEffect(() => {
    if (isAuthLoaded && clerkUserId && !initialFetchCompleted) {
      fetchUserData(true).then(() => {
        setInitialFetchCompleted(true);
      });
    }
  }, [clerkUserId, isAuthLoaded, initialFetchCompleted, fetchUserData]);

  // Retry mechanism for initial user fetch if needed
  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // Start with 2 seconds
    
    // Only start retry mechanism if auth is loaded, we have a userId, and no user yet
    if (isAuthLoaded && clerkUserId && initialFetchCompleted && !userService.user) {
      console.log("Initial user fetch failed, setting up retry mechanism");
      
      const retryInterval = setInterval(async () => {
        if (userService.user || retryCount >= MAX_RETRIES) {
          console.log(userService.user ? "User found, stopping retries" : "Max retries reached");
          clearInterval(retryInterval);
          return;
        }
        
        console.log(`Retry attempt ${retryCount + 1}/${MAX_RETRIES}`);
        retryCount++;
        await fetchUserData(true);
      }, RETRY_DELAY);
      
      return () => clearInterval(retryInterval);
    }
  }, [clerkUserId, isAuthLoaded, initialFetchCompleted, userService.user, fetchUserData]);

  // Refresh user data when screen comes into focus (with reduced frequency)
  useFocusEffect(
    React.useCallback(() => {
      if (isAuthLoaded && clerkUserId) {
        console.log("Screen focused - checking if user refresh is needed");
        fetchUserData();
      }
      return () => {
        // Clean up any pending achievement check on unfocus
        if (achievementCheckTimeout.current) {
          clearTimeout(achievementCheckTimeout.current);
        }
      };
    }, [clerkUserId, isAuthLoaded, fetchUserData])
  );

  // Public refresh method exposed through context
  const refreshUser = useCallback(async (): Promise<User | null> => {
    if (!clerkUserId) return null;
    console.log("Manual refresh requested");
    return await fetchUserData(true);
  }, [clerkUserId, fetchUserData]);

  // Log errors for better debugging
  useEffect(() => {
    if (userService.error) {
      console.error("UserService error:", userService.error);
    }
  }, [userService.error]);

  return (
    <UserContext.Provider value={{ ...userService, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};