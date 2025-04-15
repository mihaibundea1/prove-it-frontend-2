import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => (
  <View className="mx-4 flex-row items-center bg-gray-100 rounded-full p-2 mb-6">
    <Search size={hp(2.5)} color="gray" />

    <TextInput
      placeholder="Find a program"
      placeholderTextColor="gray"
      className="flex-1 text-black ml-2"
      style={{ fontSize: hp(1.8) }}
      value={value}
      onChangeText={onChangeText}
    />

    {value.length > 0 && (
      <TouchableOpacity onPress={() => onChangeText('')}>
        <X size={hp(2.2)} color="gray" />
      </TouchableOpacity>
    )}
  </View>
);
