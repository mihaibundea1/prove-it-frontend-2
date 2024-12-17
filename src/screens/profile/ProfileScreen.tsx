import React from 'react';
import { ScrollView, View } from 'react-native';
import { useUser, useClerk } from '@clerk/clerk-expo';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStats from '../../components/profile/ProfileStats';
import ProfileMenu from '../../components/profile/ProfileMenu';
import MonthlyHabitTracker from '../../components/profile/MonthlyHabitTracker';

const ProfileScreen = () => {
  const { user } = useUser();
  const clerk = useClerk();

  const handleLogout = () => {
    clerk.signOut();
  };

  if (!user) return null; // Loading state

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <ProfileHeader 
          imageUrl={user.imageUrl}
          fullName={user.fullName || ''}
          emailAddress={user.emailAddresses[0]?.emailAddress || ''}
        />
        <ProfileStats />
        <MonthlyHabitTracker />
        <ProfileMenu onLogout={handleLogout} />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
