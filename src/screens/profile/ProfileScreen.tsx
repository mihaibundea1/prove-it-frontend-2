import React from 'react';
import { View } from 'react-native';
import { ProfileStackScreenProps } from '@/navigation/types/navigationTypes';
import { useUserContext } from '@/contexts/UserContext';
import MyProfile from './MyProfile';
import OthersProfile from './OthersProfile';
import LoadingOverlay from '@/components/shared/LoadingOverlay';

const ProfileScreen = ({ route }: ProfileStackScreenProps<'ProfileScreen'>) => {
  const { user } = useUserContext();

  // Wait until user data is fully loaded
  if (!user) return null;

  console.log("🔍 Route Params UserId:", route.params?.userId);
  console.log("🔍 Logged-in User Clerk ID:", user.clerkId);
  console.log("🔍 Logged-in User _id:", user._id);

  // Ensure userId is compared correctly
  const userIdFromRoute = route.params?.userId || user.clerkId; // Prefer Clerk ID if not provided
  const isMyProfile = userIdFromRoute === user.clerkId;

  console.log("✅ Is My Profile:", isMyProfile);

  return (
    <>
      {isMyProfile ? (
        <MyProfile userData={user} />
      ) : (
        <OthersProfile userId={userIdFromRoute} />
      )}
    </>
    
  );
};

export default ProfileScreen;
