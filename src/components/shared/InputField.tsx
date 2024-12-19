// InputField.tsx
import React, { memo } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
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
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad";
  maxLength?: number;
}

const InputField: React.FC<InputFieldProps> = memo(({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  isPassword = false,
  showPassword,
  setShowPassword,
  isLoading = false,
  autoCapitalize = "none",
  autoCorrect = false,
  keyboardType = "default",
  maxLength
}) => {
  const handleChangeText = React.useCallback((text: string) => {
    if (!isLoading) {
      onChangeText(text);
    }
  }, [isLoading, onChangeText]);

  return (
    <View className="relative w-full h-12">
      <View className="absolute left-3 top-[25%] z-10">
        {icon}
      </View>
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        className={`w-full h-full pl-10 ${isPassword ? 'pr-12' : 'pr-3'} bg-gray-50 rounded-lg text-gray-900`}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        editable={!isLoading}
        maxLength={maxLength}
        returnKeyType="done"
        enablesReturnKeyAutomatically
        onSubmitEditing={Keyboard.dismiss}
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
});

InputField.displayName = 'InputField';

export { InputField };