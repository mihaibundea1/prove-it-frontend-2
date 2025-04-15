"use client";

import type React from "react";
import { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  RefreshControl,
  Text,
} from "react-native";
import ProfileHeader from "../../components/profile/ProfileHeader";
import type {
  User,
  Goal,
  Achievement,
} from "@/services/api/endpoints/user/types/user.types";
import { useUser } from "@clerk/clerk-expo";
import UpcomingWorkouts from "./components/UpcomingWorkouts";
import RecentActivity from "./components/RecentActivity";
import FitnessGoals from "@/components/shared/FitnessGoals";
import BodyMetrics from "./components/BodyMetrics";
import Achievements from "@/components/shared/Achievements";
import { useWorkoutData } from "@/contexts/WorkoutDataContext";
import { useUserContext } from "@/contexts/UserContext";

import { formatDistanceToNow } from "date-fns";
import { CompletedWorkout } from "@/services/api/endpoints/workout/types/workout.types";
import { ProfileStackParamList } from "@/navigation/types/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useWarmUpBrowser } from "@/hooks/auth/useWarmUpBrowser";

// Define the types for MyProfile props
interface MyProfileProps {
  userData: User; // The userData prop should match the type defined in your context
}

const MyProfile: React.FC<MyProfileProps> = ({ userData }) => {
  const { user: clerkUser } = useUser();
  const { allUserWorkouts, refreshWorkouts } = useWorkoutData();
  const { user, refreshUser } = useUserContext();
  const [refreshing, setRefreshing] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshWorkouts();
      await refreshUser();
    } catch (error) {
      console.error("Error refreshing profile:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onUpdatePress = () => {};

  return clerkUser ? (
    <ScrollView
      className="flex-1 bg-white"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#e63600" // Color of the refresh spinner
          colors={["#e63600"]} // Android
          progressBackgroundColor="#ffffff" // Android
        />
      }
    >
      <View className="p-4">
        <ProfileHeader
          imageUrl={userData.avatarUrl || ""}
          firstName={userData.firstName || ""}
          lastName={userData.lastName || ""}
          username={userData.username || ""}
          email={userData.email || ""}
          bio={userData.bio || ""}
          profileCompleted={userData.profile_completed}
          fitnessStats={{
            workoutsCompleted: allUserWorkouts?.completed?.length || 0,
            Followers: userData.followers_count,
            Following: userData.following_count,
          }}
          fitnessLevel="Intermediate"
          isMyProfile={true}
          onEditPress={() =>
            navigation.navigate("SettingsStack", {
              screen: "EditProfileScreen",
            })
          }
        />

        <UpcomingWorkouts
          isMyProfile={true}
          upcomingWorkouts={allUserWorkouts.scheduled || []}
        />
        <RecentActivity
          recentWorkouts={allUserWorkouts.completed || []}
          isMyProfile={true}
        />

        <FitnessGoals
          fitnessGoals={userData.goals || []}
          navigation={navigation}
        />
        <Achievements
          achievements={(user?.achievements || []).map((achievement) => ({
            ...achievement,
            status:
              achievement.status === "ACHIEVED" ? "achieved" : "in progress",
          }))}
        />
        <BodyMetrics
          weight={user?.weight || 0}
          height={user?.height || 0}
          bmi={
            user?.weight && user?.height
              ? user.measurement_system === "metric"
                ? parseFloat(
                    (user.weight / Math.pow(user.height / 100, 2)).toFixed(1)
                  ) // 1 decimal
                : parseFloat(
                    ((user.weight * 703) / Math.pow(user.height, 2)).toFixed(1)
                  ) // 1 decimal
              : 0
          }
          onUpdatePress={onUpdatePress}
        />
      </View>
    </ScrollView>
  ) : null;
};

export default MyProfile;
