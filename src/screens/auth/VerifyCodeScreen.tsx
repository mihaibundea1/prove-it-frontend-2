import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { KeyRound } from 'lucide-react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { AuthStackScreenProps } from '../../navigation/types/navigationTypes';
import { InputField } from '../../components/shared/InputField';
import { useUserService } from '@/services/api/endpoints/user/hooks/useUserService';

export default function VerifyCodeScreen({
  navigation,
}: AuthStackScreenProps<"VerifyCode">) {
  // All hooks at the top level
  const { isLoaded, signUp, setActive } = useSignUp();
  const { registerUser } = useUserService();
  
  // State management
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Handler for verification process
  const handleVerification = useCallback(async () => {
    if (!isLoaded) {
      Alert.alert('Error', 'System is still loading');
      return;
    }

    if (!code.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== 'complete') {
        Alert.alert('Error', 'Verification was not completed successfully');
        return;
      }

      const sessionToken = completeSignUp.createdSessionId;
      const userId = signUp.createdUserId;

      if (!userId || !sessionToken) {
        throw new Error('Missing user ID or session token');
      }

      // Activate the session
      await setActive({ session: sessionToken });

      // Register user in your database
      const registrationResult = await registerUser(userId);
      
      if (registrationResult.error) {
        Alert.alert(
          'Warning',
          'Account created but profile setup failed. Please try updating your profile later.'
        );
      }

    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert(
        'Error',
        error.errors?.[0]?.message || 'Failed to verify email. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, code, signUp, setActive, registerUser]);

  // Handler for resending verification code
  const handleResendCode = useCallback(async () => {
    if (!isLoaded) {
      Alert.alert('Error', 'Please wait while the system loads');
      return;
    }

    setIsResending(true);

    try {
      await signUp.prepareEmailAddressVerification();
      Alert.alert('Success', 'Verification code has been resent to your email');
    } catch (error: any) {
      console.error('Error resending code:', error);
      Alert.alert(
        'Error',
        error.errors?.[0]?.message || 'Failed to resend code. Please try again.'
      );
    } finally {
      setIsResending(false);
    }
  }, [isLoaded, signUp]);

  // Render the UI
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 bg-white"
          keyboardShouldPersistTaps="handled"
        >
          <View className="min-h-screen px-6 pt-16">
            <Text className="text-3xl font-bold text-gray-900 mb-8">
              Verify Email
            </Text>

            <Text className="text-gray-600 mb-8">
              Enter the verification code sent to your email
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </Text>
                <InputField
                  icon={<KeyRound size={20} color="#9CA3AF" />}
                  placeholder="Enter verification code"
                  value={code}
                  onChangeText={setCode}
                  isLoading={isLoading}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <TouchableOpacity
              className={`w-full h-12 bg-[#E63A1E] rounded-lg items-center justify-center mt-6 ${
                isLoading ? 'opacity-70' : ''
              }`}
              onPress={handleVerification}
              disabled={isLoading || isResending}
            >
              <Text className="text-white font-bold text-lg">
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-full h-12 border border-gray-200 rounded-lg items-center justify-center mt-4 ${
                isResending ? 'opacity-70' : ''
              }`}
              onPress={handleResendCode}
              disabled={isLoading || isResending}
            >
              <Text className="text-gray-700 font-medium">
                {isResending ? 'Resending...' : 'Resend Code'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-6"
              onPress={() => navigation.goBack()}
              disabled={isLoading || isResending}
            >
              <Text className="text-blue-500 text-center font-medium">
                Go back
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}