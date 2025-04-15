import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

type ButtonGroupProps = {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  options,
  selectedOption,
  onSelect
}) => {
  return (
    <View className="flex-row justify-between">
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          className={`flex-1 py-3 mx-1 items-center justify-center rounded-xl ${
            selectedOption === option ? "bg-[#E63600]" : "bg-gray-100"
          }`}
          onPress={() => onSelect(option)}
        >
          <Text
            className={`font-medium ${
              selectedOption === option ? "text-white" : "text-gray-800"
            }`}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ButtonGroup;