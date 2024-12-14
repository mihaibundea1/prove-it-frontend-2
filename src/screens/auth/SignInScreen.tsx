import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { OAuthButtons } from '../../components/auth/OAuth';
import { InputField } from '../../components/shared/InputField';
import { RootStackScreenProps } from '../../navigation/types/navigationTypes';

export default function SignInScreen({
  navigation,
}: AuthStackScreenProps<"SignIn">) {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const onSignInPress = async () => {
    if (!isLoaded) {
      console.log("Clerk not loaded yet");
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Starting sign in process...");
      
      const completeSignIn = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });
      console.log("Sign in created:", completeSignIn);
  
      await setActive({ session: completeSignIn.createdSessionId });
      console.log("Session activated:", completeSignIn.createdSessionId);
    } catch (err: any) {
      console.error('Sign in error:', err);
      Alert.alert('Error', err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUpPress = () => navigation.replace("SignUp");

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
              Login
            </Text>

            <OAuthButtons />
            
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-[1px] bg-gray-200" />
              <Text className="mx-4 text-gray-500">or continue with</Text>
              <View className="flex-1 h-[1px] bg-gray-200" />
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
                <InputField
                  icon={<Mail size={20} color="#9CA3AF" />}
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  isLoading={isLoading}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
                <InputField
                  icon={<Lock size={20} color="#9CA3AF" />}
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(text) => setFormData({...formData, password: text})}
                  secureTextEntry={!showPassword}
                  isPassword={true}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isLoading={isLoading}
                />
              </View>
            </View>

            <TouchableOpacity 
              className={`w-full h-12 bg-[#E63A1E] rounded-lg items-center justify-center mt-6 ${isLoading ? 'opacity-70' : ''}`}
              onPress={onSignInPress}
              disabled={isLoading}
            >
              <Text className="text-white font-bold text-lg">
                {isLoading ? 'Signing in...' : 'Login'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={onSignUpPress} disabled={isLoading}>
                <Text className="text-blue-500 font-medium">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}