// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

export default function HomeScreen() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err: any) {
      console.error('Error signing out:', err.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-8">Welcome to Home</Text>
      
      <TouchableOpacity
        className="w-full bg-red-500 py-4 rounded-lg"
        onPress={handleSignOut}
      >
        <Text className="text-white text-center font-semibold">
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}