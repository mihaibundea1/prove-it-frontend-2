import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../types/navigation';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

interface SignInResponse {
  createdSessionId: string;
  signIn: any;
  signUp: any;
  setActive: (params: { session: string }) => Promise<void>;
}

export default function Login() {
  const navigation = useNavigation<NavigationProps>();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = async (): Promise<void> => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
      Alert.alert('Success', 'Logged in successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { createdSessionId, setActive } = await startOAuthFlow() as SignInResponse;
      
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        Alert.alert('Success', 'Logged in with Google successfully!');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="w-[90%] mx-auto h-full py-[5%] justify-center">
        <Text className="text-2xl font-bold text-center mb-[6%]">Welcome Back</Text>
        
        <View className="space-y-[3%]">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-[1%]">Email</Text>
            <View className="relative h-[48px]">
              <View className="absolute left-[4%] top-[25%] z-10">
                <Mail size={20} color="#9CA3AF" />
              </View>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                className="w-full h-full pl-[12%] pr-[4%] bg-white border border-gray-300 rounded-md text-gray-900"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-[1%]">Password</Text>
            <View className="relative h-[48px]">
              <View className="absolute left-[4%] top-[25%] z-10">
                <Lock size={20} color="#9CA3AF" />
              </View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                className="w-full h-full pl-[12%] pr-[12%] bg-white border border-gray-300 rounded-md text-gray-900"
                editable={!isLoading}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-[4%] top-[25%] z-10"
              >
                {showPassword ? 
                  <EyeOff size={20} color="#9CA3AF" /> : 
                  <Eye size={20} color="#9CA3AF" />
                }
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-[2%]">
            <TouchableOpacity 
              className="flex-row items-center" 
              onPress={() => setRememberMe(!rememberMe)}
              disabled={isLoading}
            >
              <View className={`w-[16px] h-[16px] border rounded mr-[8px] ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`} />
              <Text className="text-sm text-gray-600">Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={isLoading}>
              <Text className="text-sm text-blue-600">Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            className={`bg-blue-600 h-[48px] rounded-md mt-[4%] ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold h-full leading-[48px]">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-[4%]">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-[4%] text-gray-500 text-sm">Or continue with</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          <TouchableOpacity 
            className={`flex-row items-center justify-center h-[48px] bg-white border border-gray-300 rounded-md ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Image 
              source={{ uri: 'https://www.google.com/favicon.ico' }}
              className="w-[24px] h-[24px] mr-[2%]"
            />
            <Text className="text-gray-700">
              {isLoading ? 'Loading...' : 'Sign in with Google'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-[4%]">
            <Text className="text-gray-600 text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={isLoading}>
              <Text className="text-blue-600 text-sm">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}