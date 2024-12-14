// components/InputField.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  isPassword?: boolean;
  showPassword?: boolean;
  setShowPassword?: (show: boolean) => void;
  isLoading?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  icon, 
  placeholder, 
  value,
  onChangeText,
  secureTextEntry, 
  isPassword = false,
  showPassword,
  setShowPassword,
  isLoading = false
}) => (
  <View className="relative w-full h-12">
    <View className="absolute left-3 top-[25%] z-10">
      {icon}
    </View>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      secureTextEntry={secureTextEntry}
      className={`w-full h-full pl-10 ${isPassword ? 'pr-12' : 'pr-3'} bg-gray-50 rounded-lg text-gray-900`}
      autoCapitalize="none"
      editable={!isLoading}
    />
    {isPassword && setShowPassword && (
      <TouchableOpacity 
        onPress={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-[25%] z-10"
      >
        {showPassword ? 
          <EyeOff size={20} color="#9CA3AF" /> : 
          <Eye size={20} color="#9CA3AF" />
        }
      </TouchableOpacity>
    )}
  </View>
);