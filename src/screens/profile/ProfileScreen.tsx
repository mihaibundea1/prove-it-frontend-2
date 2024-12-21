import React, { useState, useCallback } from 'react';
import { ScrollView, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Settings } from 'lucide-react-native';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStats from '../../components/profile/ProfileStats';
import MonthlyHabitTracker from '../../components/profile/MonthlyHabitTracker';
import { ProfileStackParamList } from '../../types/navigation';

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileScreen'>;

const ProfileScreen = () => {
  const { user } = useUser();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);

  if (!user) return null;

  const handleNavigateToSettings = () => {
    navigation.navigate("SettingsStack", {
      screen: "SettingsScreen",
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Reload user data
      await user.reload();
      
      // Add any other data refresh logic here
      // For example, refresh ProfileStats and MonthlyHabitTracker data
      // await Promise.all([
      //   refreshProfileStats(),
      //   refreshHabitData(),
      // ]);

    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  return (
    <ScrollView 
      className="flex-1 bg-white"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#e63600" // Color of the refresh spinner
          colors={['#e63600']} // Android
          progressBackgroundColor="#ffffff" // Android
        />
      }
    >
      <View className="p-4">
        <View className="flex-row justify-end items-center">
          <TouchableOpacity onPress={handleNavigateToSettings}>
            <Settings color="#e63600" size={28} />
          </TouchableOpacity>
        </View>
        <ProfileHeader 
          imageUrl={user.imageUrl}
          fullName={user.fullName || ''}
          emailAddress={user.emailAddresses[0]?.emailAddress || ''}
        />
        <ProfileStats />
        <MonthlyHabitTracker />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;