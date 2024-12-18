import React, { useState, useCallback, useMemo } from 'react';
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
  // 1. First, all context hooks
  const { isLoaded, signUp, setActive } = useSignUp();
  const userService = useUserService();

  // 2. Then, all state hooks
  const [verificationState, setVerificationState] = useState({
    code: '',
    isLoading: false,
    isResending: false
  });

  // 3. Memoized values
  const isDisabled = useMemo(() => {
    return verificationState.isLoading || verificationState.isResending;
  }, [verificationState.isLoading, verificationState.isResending]);

  // 4. Callbacks
  const handleCodeChange = useCallback((text: string) => {
    setVerificationState(prev => ({
      ...prev,
      code: text
    }));
  }, []);

  const handleVerification = useCallback(async () => {
    if (!isLoaded) {
      Alert.alert('Error', 'System is still loading');
      return;
    }

    if (!verificationState.code.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    try {
      setVerificationState(prev => ({ ...prev, isLoading: true }));

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationState.code,
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

      await setActive({ session: sessionToken });

      const registrationResult = await userService.registerUser(userId);
      
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
      setVerificationState(prev => ({ ...prev, isLoading: false }));
    }
  }, [isLoaded, verificationState.code, signUp, setActive, userService]);

  const handleResendCode = useCallback(async () => {
    if (!isLoaded) {
      Alert.alert('Error', 'Please wait while the system loads');
      return;
    }

    try {
      setVerificationState(prev => ({ ...prev, isResending: true }));
      await signUp.prepareEmailAddressVerification();
      Alert.alert('Success', 'Verification code has been resent to your email');
    } catch (error: any) {
      console.error('Error resending code:', error);
      Alert.alert(
        'Error',
        error.errors?.[0]?.message || 'Failed to resend code. Please try again.'
      );
    } finally {
      setVerificationState(prev => ({ ...prev, isResending: false }));
    }
  }, [isLoaded, signUp]);

  // 5. Render
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
                  value={verificationState.code}
                  onChangeText={handleCodeChange}
                  isLoading={verificationState.isLoading}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={6}
                />
              </View>
            </View>

            <TouchableOpacity
              className={`w-full h-12 bg-[#E63A1E] rounded-lg items-center justify-center mt-6 ${
                isDisabled ? 'opacity-70' : ''
              }`}
              onPress={handleVerification}
              disabled={isDisabled}
            >
              <Text className="text-white font-bold text-lg">
                {verificationState.isLoading ? 'Verifying...' : 'Verify Email'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-full h-12 border border-gray-200 rounded-lg items-center justify-center mt-4 ${
                isDisabled ? 'opacity-70' : ''
              }`}
              onPress={handleResendCode}
              disabled={isDisabled}
            >
              <Text className="text-gray-700 font-medium">
                {verificationState.isResending ? 'Resending...' : 'Resend Code'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-6"
              onPress={() => navigation.goBack()}
              disabled={isDisabled}
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