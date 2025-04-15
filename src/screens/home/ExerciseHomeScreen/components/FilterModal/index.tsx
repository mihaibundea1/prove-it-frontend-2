import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable
} from 'react-native';
import { useFilterModal } from './hooks/useFilterModal';
import {
  Filters,
  FilterOptionKey,
  filterOptions
} from '../types/filter.types';
import * as Lucide from 'lucide-react-native';

// Map of category titles to more user-friendly names
const CATEGORY_TITLES: Record<FilterOptionKey, string> = {
  level: "Difficulty Level",
  muscleGroups: "Muscle Groups",
  equipment: "Equipment",
};

// Icon mapping function
const getIconForOption = (category: FilterOptionKey, option: string | null) => {
  if (!option) {
    return Lucide.Circle;
  }

  const iconMappings: Record<FilterOptionKey, Record<string, React.ComponentType>> = {
    level: {
      beginner: Lucide.BatteryMedium,
      intermediate: Lucide.BatteryCharging,
      expert: Lucide.BatteryFull
    },
    muscleGroups: {
      abdominals: Lucide.BrickWall,
      hamstrings: Lucide.Footprints,
      adductors: Lucide.MoveHorizontal,
      quadriceps: Lucide.ArrowUp,
      biceps: Lucide.BicepsFlexed,
      shoulders: Lucide.MoveUp,
      chest: Lucide.Shield,
      'middle back': Lucide.AlignCenterVertical,
      calves: Lucide.Footprints,
      glutes: Lucide.Circle,
      'lower back': Lucide.AlignEndVertical,
      lats: Lucide.AlignHorizontalSpaceBetween,
      triceps: Lucide.Armchair,
      traps: Lucide.Triangle,
      forearms: Lucide.Hand,
      neck: Lucide.User,
      abductors: Lucide.MoveHorizontal
    },
    equipment: {
      'body only': Lucide.PersonStanding,
      machine: Lucide.Triangle,
      other: Lucide.MoreHorizontal,
      'foam roll': Lucide.Shell,
      kettlebells: Lucide.Dumbbell,
      dumbbell: Lucide.Dumbbell,
      cable: Lucide.Cable,
      barbell: Lucide.Dumbbell,
      bands: Lucide.Bandage,
      'medicine ball': Lucide.LoaderPinwheel,
      'exercise ball': Lucide.Circle,
      'e-z curl bar': Lucide.Minus
    }
  };
  
  
  
  return iconMappings[category]?.[option] || Lucide.Circle;
};

// Format option name for display
const formatOptionName = (option: string | null) => {
  if (!option) return "None";
  return option
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: Filters;
  onApplyFilters: (filters: Filters) => void;
}

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
    handleResetCategory,
    handleApply,
    getActiveFilterCount
  } = useFilterModal({
    initialFilters: filters,
    onApplyFilters,
    onClose
  });

  const activeFilterCount = getActiveFilterCount();

  // Render a single filter chip
  const renderFilterOption = (category: FilterOptionKey, option: string | null) => {
    const safeOption = option || 'none';
    const isSelected = (localFilters[category] as string[] | undefined)?.includes(safeOption);
    const IconComponent = getIconForOption(category, safeOption);

    return (
      <TouchableOpacity
        key={safeOption}
        onPress={() => handleFilterChange(category, safeOption)}
        activeOpacity={0.7}
        className={`mr-2 mb-3 px-4 py-3 rounded-full flex-row items-center ${isSelected ? 'bg-[#ee4444]' : 'bg-gray-100'}`}
      >
        <IconComponent
          size={16}
          color={isSelected ? 'white' : '#333'}
          className="mr-2"
        />
        <Text className={`${isSelected ? 'text-white' : 'text-gray-800'} font-medium`}>
          {formatOptionName(safeOption)}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render each filter category along with its options
  const renderFilterCategory = (category: FilterOptionKey) => {
    const options = filterOptions[category];
    const hasActiveFilters = (localFilters[category]?.length ?? 0) > 0;

    return (
      <View key={category} className="mb-8">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold text-gray-800">{CATEGORY_TITLES[category]}</Text>
          {hasActiveFilters && (
            <TouchableOpacity
              onPress={() => handleResetCategory(category)}
              className="px-3 py-1 rounded-full bg-gray-100"
            >
              <Text className="text-sm text-gray-600">Reset</Text>
            </TouchableOpacity>
          )}
        </View>
        <View className="flex-row flex-wrap">
          {options.map(option => renderFilterOption(category, option))}
        </View>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/40" onPress={onClose}>
        <View
          className="flex-1 bg-white mt-24 rounded-t-3xl"
          onStartShouldSetResponder={() => true}
        >
          {/* Header with title and reset all */}
          <View className="px-6 pt-6 pb-4 border-b border-gray-200 flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-gray-800">Filters</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={handleReset}
                className="mr-2 px-3 py-1 rounded-full bg-gray-100"
              >
                <Text className="text-sm text-gray-600">Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 rounded-full bg-gray-100"
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Lucide.X size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Body with filter categories */}
          <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>
            {(Object.keys(filterOptions) as FilterOptionKey[]).map(category =>
              renderFilterCategory(category)
            )}
            <View className="h-20" />
          </ScrollView>

          {/* Footer with Apply button */}
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex-row justify-end items-center">
            <TouchableOpacity
              onPress={handleApply}
              className="px-6 py-3 bg-[#ee4444] rounded-full flex-row items-center"
            >
              <Text className="text-white font-semibold mr-1">Apply</Text>
              {activeFilterCount > 0 && (
                <View className="bg-white rounded-full h-6 w-6 items-center justify-center">
                  <Text className="text-[#ee4444] text-xs font-bold">{activeFilterCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};
