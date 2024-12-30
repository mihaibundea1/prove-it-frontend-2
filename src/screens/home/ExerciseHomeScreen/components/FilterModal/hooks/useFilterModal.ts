// src/screens/home/ExerciseHomeScreen/components/FilterModal/useFilterModal.tsx
import { useState, useCallback } from 'react';
import type { Filters, FilterOptionKey } from '../../types/filter.types';

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

  const handleFilterChange = useCallback((key: FilterOptionKey, value: string) => {
    setLocalFilters((prev: Filters) => {
      // Dacă valoarea este deja selectată, o deselectăm
      if (prev[key] === value) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      // Altfel, actualizăm valoarea
      return { ...prev, [key]: value };
    });
  }, []);

  const handleReset = useCallback(() => {
    setLocalFilters({});
  }, []);

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