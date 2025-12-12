import { useState, useMemo } from 'react';
import { 
  FilterState, 
  LifespanCategory, 
  ProductType, 
  ProductCategory, 
  ShutdownReason
} from '../types/Product';

const initialFilters: FilterState = {
  lifespanCategories: [],
  productTypes: [],
  productCategories: [],
  shutdownReasons: [],
  searchQuery: ''
};

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const toggleLifespanCategory = (category: LifespanCategory) => {
    setFilters(prev => ({
      ...prev,
      lifespanCategories: prev.lifespanCategories.includes(category)
        ? prev.lifespanCategories.filter(c => c !== category)
        : [...prev.lifespanCategories, category]
    }));
  };

  const toggleProductType = (type: ProductType) => {
    setFilters(prev => ({
      ...prev,
      productTypes: prev.productTypes.includes(type)
        ? prev.productTypes.filter(t => t !== type)
        : [...prev.productTypes, type]
    }));
  };

  const toggleProductCategory = (category: ProductCategory) => {
    setFilters(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }));
  };

  const toggleShutdownReason = (reason: ShutdownReason) => {
    setFilters(prev => ({
      ...prev,
      shutdownReasons: prev.shutdownReasons.includes(reason)
        ? prev.shutdownReasons.filter(r => r !== reason)
        : [...prev.shutdownReasons, reason]
    }));
  };

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query
    }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
  };

  const activeFilterCount = useMemo(() => {
    return (
      filters.lifespanCategories.length +
      filters.productTypes.length +
      filters.productCategories.length +
      filters.shutdownReasons.length +
      (filters.searchQuery ? 1 : 0)
    );
  }, [filters]);

  return {
    filters,
    toggleLifespanCategory,
    toggleProductType,
    toggleProductCategory,
    toggleShutdownReason,
    setSearchQuery,
    clearAllFilters,
    activeFilterCount
  };
}
