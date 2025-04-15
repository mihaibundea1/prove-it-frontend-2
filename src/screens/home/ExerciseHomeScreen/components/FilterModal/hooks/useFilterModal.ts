// src/screens/home/ExerciseHomeScreen/components/FilterModal/hooks/useFilterModal.ts
import { useState, useEffect, useCallback } from 'react';
import { Filters, FilterOptionKey } from '../../types/filter.types';

interface UseFilterModalProps {
  initialFilters: Filters;
  onApplyFilters: (filters: Filters) => void;
  onClose: () => void;
}

export const useFilterModal = ({
  initialFilters,
  onApplyFilters,
  onClose
}: UseFilterModalProps) => {
  const [localFilters, setLocalFilters] = useState<Filters>(initialFilters || {});
  
  // Update local filters when initialFilters change (e.g., when modal reopens)
  useEffect(() => {
    setLocalFilters(initialFilters || {});
  }, [initialFilters]);

  // Toggle a filter option in a category (add if not present, remove if already selected)
  const handleFilterChange = useCallback((category: FilterOptionKey, option: string) => {
    setLocalFilters(prev => {
      const currentCategory = (prev[category] || []) as string[];
      
      // Check if the option is already selected
      const isSelected = currentCategory.includes(option);
      
      // Toggle the selection
      const updatedCategory = isSelected
        ? currentCategory.filter(item => item !== option)
        : [...currentCategory, option];
      
      return {
        ...prev,
        [category]: updatedCategory
      };
    });
  }, []);

  // Reset all filters
  const handleReset = useCallback(() => {
    setLocalFilters({});
  }, []);

  // Reset filters for a specific category
  const handleResetCategory = useCallback((category: FilterOptionKey) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: []
    }));
  }, []);

  // Apply filters and close modal
  const handleApply = useCallback(() => {
    onApplyFilters(localFilters);
    onClose();
  }, [localFilters, onApplyFilters, onClose]);

  // Get count of active filters
  const getActiveFilterCount = useCallback(() => {
    return Object.values(localFilters).reduce((count, filterArray) => {
      return count + (filterArray?.length || 0);
    }, 0);
  }, [localFilters]);

  return {
    localFilters,
    handleFilterChange,
    handleReset,
    handleResetCategory,
    handleApply,
    getActiveFilterCount
  };
};