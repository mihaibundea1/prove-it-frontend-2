import { useState, useCallback } from 'react';
import type { Filters, FilterOptionKey } from '../../../types';

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
  const [localFilters, setLocalFilters] = useState<Filters>(initialFilters);

  const handleFilterChange = useCallback((key: FilterOptionKey, option: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: prev[key] === option ? null : option
    }));
  }, []);

  const handleReset = useCallback(() => {
    const emptyFilters: Filters = {
      force: null,
      level: null,
      mechanic: null,
      equipment: null,
      category: null
    };
    setLocalFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  }, [onApplyFilters, onClose]);

  const handleApply = useCallback(() => {
    onApplyFilters(localFilters);
    onClose();
  }, [localFilters, onApplyFilters, onClose]);

  return {
    localFilters,
    handleFilterChange,
    handleReset,
    handleApply
  };
};