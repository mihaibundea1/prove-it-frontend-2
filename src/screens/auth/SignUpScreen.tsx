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
import { Mail, Lock, User, AtSign } from 'lucide-react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { OAuthButtons } from '../../services/auth/OAuth';
import { InputField } from '../../components/shared/InputField';
import { AuthStackScreenProps } from '../../navigation/types/navigationTypes';
import { log } from '../../../logger';

export default function SignUpScreen({
  navigation,
}: AuthStackScreenProps<"SignUp">) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    
    try {
      setIsLoading(true);
      
      // Create the sign-up attempt with username
      await signUp.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        emailAddress: formData.email,
        password: formData.password,
      });
  
      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      // Navigate to verification screen
      navigation.navigate("VerifyCode");
      
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to sign up');
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSignInPress = () => navigation.replace("SignIn");

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
              Create Account
            </Text>

            <OAuthButtons />
            
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-[1px] bg-gray-200" />
              <Text className="mx-4 text-gray-500">or continue with</Text>
              <View className="flex-1 h-[1px] bg-gray-200" />
            </View>

            <View className="space-y-4">
              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1">First Name</Text>
                  <InputField
                    icon={<User size={20} color="#9CA3AF" />}
                    placeholder="First Name"
                    value={formData.firstName}
                    onChangeText={(text) => setFormData({...formData, firstName: text})}
                    isLoading={isLoading}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1">Last Name</Text>
                  <InputField
                    icon={<User size={20} color="#9CA3AF" />}
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChangeText={(text) => setFormData({...formData, lastName: text})}
                    isLoading={isLoading}
                  />
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Username</Text>
                <InputField
                  icon={<AtSign size={20} color="#9CA3AF" />}
                  placeholder="Username"
                  value={formData.username}
                  onChangeText={(text) => setFormData({...formData, username: text})}
                  isLoading={isLoading}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
                <InputField
                  icon={<Mail size={20} color="#9CA3AF" />}
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  isLoading={isLoading}
                  autoCapitalize="none"
                  keyboardType="email-address"
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
              onPress={onSignUpPress}
              disabled={isLoading}
            >
              <Text className="text-white font-bold text-lg">
                {isLoading ? 'Creating Account...' : 'Register'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={onSignInPress} disabled={isLoading}>
                <Text className="text-blue-500 font-medium">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}