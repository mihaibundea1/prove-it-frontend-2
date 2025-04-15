import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type SelectionCardProps = {
  title?: string;
  items: string[];
  selectedItems: string | string[];
  onSelect: (item: string) => void;
  multiSelect?: boolean;
};

const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  items,
  selectedItems,
  onSelect,
  multiSelect = false
}) => (
  <View className="rounded-xl">
    {title && (
      <Text className="text-lg font-bold text-gray-800 mb-3">{title}</Text>
    )}
    <View className="flex-row flex-wrap">
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          className={`m-1 px-4 py-2.5 rounded-full ${
            (multiSelect
              ? Array.isArray(selectedItems) && selectedItems.includes(item)
              : selectedItems === item)
              ? "bg-[#E63600]"
              : "bg-gray-100"
          }`}
          onPress={() => onSelect(item)}
        >
          <Text
            className={`font-medium ${
              (multiSelect
                ? Array.isArray(selectedItems) && selectedItems.includes(item)
                : selectedItems === item)
                ? "text-white"
                : "text-gray-800"
            }`}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default SelectionCard;