import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import type { FilterModalProps, FilterOptionKey } from '../../types/exercise.types';
import { useFilterModal } from './hooks/useFilterModal';
import { filterOptions } from '../../types/exercise.types';

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApplyFilters
}) => {
  const {
    localFilters,
    handleFilterChange,
    handleReset,
    handleApply
  } = useFilterModal({
    initialFilters: filters,
    onApplyFilters,
    onClose
  });

  const renderFilterOption = (option: string, key: FilterOptionKey) => (
    <TouchableOpacity
      key={option}
      className={`mr-2 mb-2 px-4 py-2 rounded-full ${
        localFilters[key] === option ? 'bg-blue-500' : 'bg-gray-100'
      }`}
      onPress={() => handleFilterChange(key, option)}
    >
      <Text 
        className={`${
          localFilters[key] === option ? 'text-white' : 'text-black'
        } font-medium`}
      >
        {option}
      </Text>
    </TouchableOpacity>
  );

  const renderFilterCategory = ({ item: [key, options] }: { item: [FilterOptionKey, string[]] }) => (
    <View className="mb-6">
      <Text className="text-lg font-semibold mb-3 capitalize text-black">
        {key}
      </Text>
      <View className="flex-row flex-wrap">
        {options.map(option => renderFilterOption(option, key))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50">
        <View className="flex-1 bg-white mt-20 rounded-t-3xl p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-black text-2xl font-semibold">Filters</Text>
            <TouchableOpacity
              className="p-2"
              onPress={onClose}
            >
              <Text className="text-gray-500">Close</Text>
            </TouchableOpacity>
          </View>
          
          {/* Filter List */}
          <FlatList
            data={Object.entries(filterOptions) as [FilterOptionKey, string[]][]}
            keyExtractor={([key]) => key}
            renderItem={renderFilterCategory}
            showsVerticalScrollIndicator={false}
          />
          
          {/* Footer Actions */}
          <View className="flex-row justify-end mt-4 pt-4 border-t border-gray-200">
            <TouchableOpacity
              className="px-6 py-3 bg-gray-100 rounded-full mr-3"
              onPress={handleReset}
            >
              <Text className="text-black font-medium">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-6 py-3 bg-blue-500 rounded-full"
              onPress={handleApply}
            >
              <Text className="text-white font-medium">Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};