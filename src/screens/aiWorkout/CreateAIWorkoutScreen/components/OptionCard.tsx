import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

type OptionCardProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
  marginBottom?: number; // Optional marginBottom property
};

const OptionCard: React.FC<OptionCardProps> = ({
  icon,
  title,
  subtitle,
  selected,
  onPress,
  marginBottom = 0, // Default value is 0
}) => {
  return (
    <TouchableOpacity
      style={{ marginBottom }} // Apply marginBottom here
      className={`w-full p-5 rounded-full flex-row items-center space-x-4 ${selected ? "bg-[#E63600]" : "bg-gray-50"
        }`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-shrink-0">
        {React.cloneElement(icon as React.ReactElement, {
          color: selected ? "white" : "#ee4444", // Change icon color based on selection
        })}
      </View>
      <View className="flex-1">
        <Text
          className={`text-lg font-bold ${selected ? "text-white" : "text-gray-900"
            }`}
        >
          {title}
        </Text>
        <Text
          className={`text-sm ${selected ? "text-white opacity-90" : "text-gray-500"
            }`}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default OptionCard;