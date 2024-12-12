import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react-native';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../types/navigation';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface InputRefs {
  firstName: React.MutableRefObject<string>;
  lastName: React.MutableRefObject<string>;
  email: React.MutableRefObject<string>;
  phone: React.MutableRefObject<string>;
  password: React.MutableRefObject<string>;
}

interface InputFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  inputRef: React.MutableRefObject<string>;
  initialValue: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  isPassword?: boolean;
}

interface SignUpResponse {
  createdSessionId: string;
  signIn: any;
  signUp: any;
  setActive: (params: { session: string }) => Promise<void>;
}

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProps>();
  const { signUp, setActive, isLoaded } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Refs to store temporary input values
  const inputRefs: InputRefs = {
    firstName: useRef(''),
    lastName: useRef(''),
    email: useRef(''),
    phone: useRef(''),
    password: useRef('')
  };

  // State for final form data
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  // Handle keyboard dismiss and save all temporary values to state
  const handleKeyboardDismiss = (): void => {
    const newFormData: FormData = {
      firstName: inputRefs.firstName.current,
      lastName: inputRefs.lastName.current,
      email: inputRefs.email.current,
      phone: inputRefs.phone.current,
      password: inputRefs.password.current
    };
    setFormData(newFormData);
    Keyboard.dismiss();
  };

  const handleSignUp = async (): Promise<void> => {
    if (!isLoaded) return;
    
    // Save any pending input values before submission
    handleKeyboardDismiss();

    try {
      setIsLoading(true);

      const signUpAttempt = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      await signUpAttempt.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (formData.phone) {
        try {
          await signUpAttempt.createPhoneNumberVerification({
            phoneNumber: formData.phone
          });
        } catch (phoneError: any) {
          console.log('Phone number could not be added:', phoneError);
        }
      }

      await signUpAttempt.prepareEmailAddressVerification();

      Alert.alert(
        'Verify your email',
        'Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { createdSessionId, setActive } = await startOAuthFlow() as SignUpResponse;
      
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        Alert.alert('Success', 'Signed up with Google successfully!');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to sign up with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const InputField: React.FC<InputFieldProps> = ({ 
    icon, 
    placeholder, 
    inputRef,
    initialValue,
    secureTextEntry, 
    keyboardType = 'default',
    isPassword = false
  }) => (
    <View className="relative w-full h-12">
      <View className="absolute left-3 top-[25%] z-10">
        {icon}
      </View>
      <TextInput
        defaultValue={initialValue}
        onChangeText={(text: string) => {
          inputRef.current = text;
        }}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        className={`w-full h-full pl-10 ${isPassword ? 'pr-12' : 'pr-3'} bg-white border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400`}
        autoCapitalize="none"
        editable={!isLoading}
        returnKeyType="next"
        enablesReturnKeyAutomatically
      />
      {isPassword && (
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[25%] z-10"
          disabled={isLoading}
        >
          {showPassword ? 
            <EyeOff size={20} color="#9CA3AF" /> : 
            <Eye size={20} color="#9CA3AF" />
          }
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={handleKeyboardDismiss}>
        <ScrollView 
          className="flex-1 bg-gray-50"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View className="min-h-screen w-[90%] mx-auto py-[10%]">
            <View className="w-full">
              <Text className="text-3xl font-bold text-center mb-[8%]">Create Account</Text>
              
              <View className="space-y-4 mb-[5%]">
                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 mb-1">First Name</Text>
                    <InputField
                      icon={<User size={20} color="#9CA3AF" />}
                      placeholder="First Name"
                      inputRef={inputRefs.firstName}
                      initialValue={formData.firstName}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Last Name</Text>
                    <InputField
                      icon={<User size={20} color="#9CA3AF" />}
                      placeholder="Last Name"
                      inputRef={inputRefs.lastName}
                      initialValue={formData.lastName}
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
                  <InputField
                    icon={<Mail size={20} color="#9CA3AF" />}
                    placeholder="Email"
                    inputRef={inputRefs.email}
                    initialValue={formData.email}
                    keyboardType="email-address"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">Phone</Text>
                  <InputField
                    icon={<Phone size={20} color="#9CA3AF" />}
                    placeholder="Phone number"
                    inputRef={inputRefs.phone}
                    initialValue={formData.phone}
                    keyboardType="phone-pad"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
                  <InputField
                    icon={<Lock size={20} color="#9CA3AF" />}
                    placeholder="Password"
                    inputRef={inputRefs.password}
                    initialValue={formData.password}
                    secureTextEntry={!showPassword}
                    isPassword={true}
                  />
                </View>
              </View>

              <TouchableOpacity 
                className={`w-full bg-blue-600 py-3 rounded-md mb-[5%] ${isLoading ? 'opacity-70' : ''}`}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              <View className="flex-row items-center mb-[5%]">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-4 text-gray-500">Or continue with</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              <TouchableOpacity 
                className={`w-full flex-row items-center justify-center py-3 bg-white border border-gray-300 rounded-md mb-[5%] ${isLoading ? 'opacity-70' : ''}`}
                onPress={handleGoogleSignUp}
                disabled={isLoading}
              >
                <Image 
                  source={{ uri: 'https://www.google.com/favicon.ico' }}
                  className="w-6 h-6 mr-2"
                />
                <Text className="text-gray-700 font-medium">
                  {isLoading ? 'Loading...' : 'Sign up with Google'}
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center">
                <Text className="text-gray-600">Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
                  <Text className="text-blue-600">Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}