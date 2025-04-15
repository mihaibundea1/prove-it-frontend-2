import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useUserService } from "@/services/api/endpoints/user/hooks/useUserService";
import { useWorkoutService } from "@/services/api/endpoints/workout/hooks/useWorkoutService";
import ProfileHeader from "../../components/profile/ProfileHeader";
import type { User } from "@/services/api/endpoints/user/types/user.types";
import { allUserWorkouts } from "@/contexts/WorkoutDataContext";
import { useUserContext } from "@/contexts/UserContext";
import UpcomingWorkouts from "./components/UpcomingWorkouts";
import RecentActivity from "./components/RecentActivity";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import FitnessGoals from "@/components/shared/FitnessGoals";
import Achievements from "@/components/shared/Achievements";
import BodyMetrics from "./components/BodyMetrics";

type OthersProfileProps = {
  userId: string;
};

const OthersProfile: React.FC<OthersProfileProps> = ({ userId }) => {
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [otherUserWorkouts, setOtherUserWorkouts] =
    useState<allUserWorkouts | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false); // Added state for refreshing
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const userService = useUserService();
  const { user } = useUserContext();
  const { getScheduledWorkouts, getSavedWorkouts, getCompletedWorkouts } =
    useWorkoutService();
  const navigation = useNavigation();

  const fetchOtherUser = async () => {
    setLoading(true);
    try {
      const response = await userService.fetchUserProfile(userId);
      setOtherUser(response);
      console.log(response?._id, user?.following);
      // Check if the current user is following the other user
      const followStatus = user?.following.some(
        (following) => following.following_id === response?._id.toString()
      );

      setIsFollowing(!!followStatus);
    } catch (error) {
      console.error("Error fetching other user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkouts = async () => {
    if (otherUser && otherUser._id) {
      try {
        const [scheduled, saved, completed] = await Promise.all([
          getScheduledWorkouts(otherUser._id),
          getSavedWorkouts(otherUser._id),
          getCompletedWorkouts(otherUser._id),
        ]);

        setOtherUserWorkouts({ scheduled, saved, completed });
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    }
  };

  const handleFollowToggle = async () => {
    if (!user || !otherUser) return;

    setIsFollowing((prev) => !prev); // Optimistically update the UI

    try {
      if (!isFollowing) {
        // Follow the user
        await userService.followUser(
          otherUser._id, // followee_id
          otherUser.username, // followee_username
          user._id, // follower_id
          user.username // follower_username
        );

        // Update user and otherUser objects with the new follower/following data
        user.following.push({
          following_id: otherUser._id,
          username: otherUser.username,
        });
        otherUser.followers.push({
          follower_id: user._id,
          username: user.username,
        });

        // Update the counts
        user.following_count += 1;
        otherUser.followers_count += 1;
      } else {
        // Unfollow the user
        await userService.unfollowUser(
          otherUser._id, // followee_id
          otherUser.username, // followee_username
          user._id, // follower_id
          user.username // follower_username
        );

        // Remove the following and follower from the objects
        user.following = user.following.filter(
          (following) => following.following_id !== otherUser._id
        );
        otherUser.followers = otherUser.followers.filter(
          (follower) => follower.follower_id !== user._id
        );

        // Update the counts
        user.following_count -= 1;
        otherUser.followers_count -= 1;
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      setIsFollowing((prev) => !prev); // Revert the optimistic update in case of error
    }
  };

  useEffect(() => {
    fetchOtherUser();
  }, [userId]);

  useEffect(() => {
    fetchWorkouts();
  }, [otherUser]);

  // Refresh function
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOtherUser(); // Re-fetch user data
    await fetchWorkouts(); // Re-fetch workouts
    setRefreshing(false);
  }, [userId]);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!otherUser) {
    return (
      <View>
        <Text>User not found</Text>
      </View>
    );
  }

  const HEADER_HEIGHT = 56;

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Fixed Header - Outside ScrollView */}
      <SafeAreaView className="bg-white">
        <View className="flex-row items-center justify-between py-3 px-4 border-b border-gray-100 z-10">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              className="w-10 h-10 items-center justify-center rounded-full"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={22} color="#333" />
            </TouchableOpacity>

            <Text className="ml-2 text-xl font-semibold text-gray-800">
              {otherUser.username}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Scrollable Content - With top padding to account for fixed header */}
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingTop: 8 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4">
          <ProfileHeader
            imageUrl={otherUser.avatarUrl || ""}
            firstName={otherUser.firstName || ""}
            lastName={otherUser.lastName || ""}
            username={otherUser.username || ""}
            email={otherUser.email || ""}
            bio={otherUser.bio || ""}
            profileCompleted={otherUser.profile_completed}
            fitnessStats={{
              workoutsCompleted: otherUserWorkouts?.completed?.length || 0,
              Followers: otherUser.followers_count,
              Following: otherUser.following_count,
            }}
            fitnessLevel="Intermediate"
            isMyProfile={userId === otherUser._id}
            isFollowing={isFollowing}
            onFollowToggle={handleFollowToggle}
          />
          <UpcomingWorkouts
            isMyProfile={false}
            upcomingWorkouts={otherUserWorkouts?.scheduled || []}
          />
          <RecentActivity
            recentWorkouts={otherUserWorkouts?.completed || []}
            isMyProfile={false}
          />
          <FitnessGoals
            fitnessGoals={otherUser.goals || []}
            navigation={navigation}
          />
          <Achievements achievements={otherUser.achievements || []} />
          <BodyMetrics
            weight={otherUser.weight}
            height={otherUser.height}
            bmi={parseFloat(
              (otherUser.weight / (otherUser.height / 100) ** 2).toFixed(1)
            )}
            onUpdatePress={() => {}}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default OthersProfile;
