// src/screens/SignUpScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../types/navigation';

export default function SignUpScreen() {
  const { signUp, isLoaded } = useSignUp();
  const navigation = useNavigation<NavigationProps>();

  const onSignUpWithEmail = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: 'user@example.com',
        password: 'password',
      });
    } catch (err: any) {
      console.error('Error:', err.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-8">Create Account</Text>
      
      <TouchableOpacity
        className="w-full bg-primary py-4 rounded-lg mb-4"
        onPress={onSignUpWithEmail}
      >
        <Text className="text-white text-center font-semibold">
          Sign Up with Email
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full bg-gray-100 py-4 rounded-lg mb-6"
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text className="text-gray-800 text-center font-semibold">
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
}