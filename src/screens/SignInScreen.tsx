// src/screens/SignInScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../types/navigation';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, isLoaded } = useSignIn();
  const navigation = useNavigation<NavigationProps>();

  const onSignInWithEmail = async () => {
    if (!isLoaded) return;
    try {
      await signIn.create({
        identifier: 'user@example.com',
        password: 'password',
      });
    } catch (err: any) {
      console.error('Error:', err.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-8">Welcome Back</Text>
      
      <TouchableOpacity
        className="w-full bg-primary py-4 rounded-lg mb-4"
        onPress={onSignInWithEmail}
      >
        <Text className="text-white text-center font-semibold">
          Sign In with Email
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full bg-gray-100 py-4 rounded-lg mb-6"
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text className="text-gray-800 text-center font-semibold">
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}