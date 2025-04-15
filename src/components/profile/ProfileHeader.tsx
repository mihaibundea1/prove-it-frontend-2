"use client";
import { Settings } from "lucide-react-native";
import type React from "react";
import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { ProfileStackParamList } from "../../types/navigation";

type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  "ProfileScreen"
>;

interface ProfileHeaderProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  profileCompleted: boolean;
  fitnessStats?: {
    workoutsCompleted: number;
    Followers: number;
    Following: number;
  };
  fitnessLevel?: string;
  onEditPress?: () => void;
  isMyProfile: boolean;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  imageUrl,
  firstName,
  lastName,
  username,
  email,
  bio,
  profileCompleted,
  fitnessStats = {
    workoutsCompleted: 24,
    Followers: 12500,
    Following: 5,
  },
  fitnessLevel = "Intermediate",
  isMyProfile,
  onEditPress,
  isFollowing,
  onFollowToggle,
}) => {
  const [avatarScale] = useState(new Animated.Value(1));
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handlePressIn = () => {
    Animated.spring(avatarScale, {
      toValue: 1.1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(avatarScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const renderStreakDots = () => {
    const maxDots = 7;
    const dots = [];

    for (let i = 0; i < maxDots; i++) {
      dots.push(
        <View
          key={i}
          className={`w-3 h-3 rounded-full mx-0.5 ${
            i < fitnessStats.Following ? "bg-yellow-400" : "bg-white/20"
          }`}
        />
      );
    }

    return dots;
  };

  const handleNavigateToSettings = () => {
    navigation.navigate("SettingsStack", {
      screen: "SettingsScreen",
    });
  };

  return (
    <View className="overflow-hidden rounded-xl shadow-xl mb-6">
      <LinearGradient
        colors={["#E63600", "#FF5722", "#FF8A00"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6"
      >
        {/* Fitness level badge */}
        <View className="absolute top-3 right-3 bg-white/20 px-3 py-1 rounded-full">
          <Text className="text-white font-bold text-xs">
            {fitnessLevel} Level
          </Text>
        </View>

        {isMyProfile && (
          <View className="absolute top-10 right-4 z-10">
            <TouchableOpacity onPress={handleNavigateToSettings}>
              <Settings color="#B22A00" size={28} />
            </TouchableOpacity>
          </View>
        )}

        {/* Avatar section */}
        <View className="items-center mb-4">
          <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View
              style={{ transform: [{ scale: avatarScale }] }}
              className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg"
            >
              <Image
                source={{ uri: imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </Animated.View>
          </Pressable>

          {/* Name and username */}
          <View className="items-center mt-3">
            <Text className="text-2xl font-bold text-white">{`${firstName} ${lastName}`}</Text>
            <Text className="text-base text-orange-100">@{username}</Text>
          </View>
        </View>

        {/* Fitness stats section */}
        <View className="bg-white/10 rounded-lg p-4 mb-4">
          <View className="flex-row justify-between mb-3">
            <View className="items-center">
              <Text className="text-2xl font-bold text-white">
                {fitnessStats.workoutsCompleted}
              </Text>
              <Text className="text-orange-100 text-xs">Workouts</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-white">
                {fitnessStats.Followers.toLocaleString()}
              </Text>
              <Text className="text-orange-100 text-xs">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-white">
                {fitnessStats.Following}
              </Text>
              <Text className="text-orange-100 text-xs">Following</Text>
            </View>
          </View>

          {/* Weekly streak visualization */}
          <View className="bg-white/10 rounded-lg p-2">
            <Text className="text-orange-100 text-xs mb-2">Weekly Streak:</Text>
            <View className="flex-row justify-center">
              {renderStreakDots()}
            </View>
          </View>
        </View>

        {/* Bio section */}
        {bio && (
          <View className="bg-white/10 rounded-lg p-3 mb-4">
            <Text className="text-orange-50">{bio}</Text>
          </View>
        )}

        {/* Profile completion */}
        {!profileCompleted && (
          <View className="bg-white/10 rounded-lg p-3 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white font-medium">Profile Completion</Text>
              <Text className="text-white text-xs">65%</Text>
            </View>
            <View className="h-2 bg-white/20 rounded-full overflow-hidden">
              <View
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: "65%" }}
              />
            </View>
            <Text className="text-xs text-orange-100 mt-2">
              Complete your profile to unlock personalized workout plans
            </Text>
          </View>
        )}

        {/* Action buttons */}
        <View className="items-center">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={isMyProfile ? onEditPress : onFollowToggle}
            className={`rounded-2xl py-3 px-6 shadow-md shadow-black/20 w-3/4 transition-all duration-200 ${
              isMyProfile
                ? "bg-white border border-gray-300"
                : isFollowing
                  ? "bg-red-500"
                  : "bg-green-500"
            }`}
          >
            <Text
              className={`font-semibold text-center ${
                isMyProfile ? "text-gray-800" : "text-white"
              }`}
            >
              {isMyProfile
                ? "Edit Profile"
                : isFollowing
                  ? "Unfollow"
                  : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default ProfileHeader;
