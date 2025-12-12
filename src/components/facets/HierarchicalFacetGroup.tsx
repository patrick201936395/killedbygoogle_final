import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';

// Individual filter option with optional count
interface FacetOption {
  value: string;
  label: string;
  count?: number;
}

// Category group containing multiple filter options
interface FacetCategory {
  name: string;
  options: FacetOption[];
}

// Props for the hierarchical facet group component
interface HierarchicalFacetGroupProps {
  title: string;
  categories: FacetCategory[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  defaultExpanded?: boolean;
  color?: string;
}

// Component that renders collapsible filter groups with parent-child category structure
export function HierarchicalFacetGroup({ 
  title, 
  categories, 
  selectedValues, 
  onToggle,
  defaultExpanded = true,
  color = '#4285F4'
}: HierarchicalFacetGroupProps) {
  // Controls whether the entire facet group is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  // Tracks which individual categories are expanded (defaults to all expanded)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(c => c.name))
  );

  // Toggles the expand/collapse state of a specific category
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  // Determines if a category has none, some, or all options selected (for indeterminate checkbox state)
  const getCategorySelectionState = (category: FacetCategory): 'none' | 'some' | 'all' => {
    const selectedCount = category.options.filter(opt => 
      selectedValues.includes(opt.value)
    ).length;
    
    if (selectedCount === 0) return 'none';
    if (selectedCount === category.options.length) return 'all';
    return 'some';
  };

  // Handles clicking the parent category checkbox to select/deselect all options in that category
  const handleCategoryToggle = (category: FacetCategory) => {
    const state = getCategorySelectionState(category);
    
    if (state === 'all') {
      // Deselect all options in this category
      category.options.forEach(opt => {
        if (selectedValues.includes(opt.value)) {
          onToggle(opt.value);
        }
      });
    } else {
      // Select all options in this category
      category.options.forEach(opt => {
        if (!selectedValues.includes(opt.value)) {
          onToggle(opt.value);
        }
      });
    }
  };

  // Sums up the count of all options within a category for display
  const getCategoryCount = (category: FacetCategory): number => {
    return category.options.reduce((sum, opt) => sum + (opt.count || 0), 0);
  };

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      {/* Main header button to expand/collapse the entire facet group */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-1 h-4 rounded"
            style={{ backgroundColor: color }}
          />
          <span style={{ color: '#202124' }}>{title}</span>
        </div>
        {isExpanded ? <ChevronUp size={20} color="#5F6368" /> : <ChevronDown size={20} color="#5F6368" />}
      </button>

      {isExpanded && (
        <div className="pb-3">
          {categories.map(category => {
            const isSingleItem = category.options.length === 1;
            const isCategoryExpanded = expandedCategories.has(category.name);
            const selectionState = getCategorySelectionState(category);
            const categoryCount = getCategoryCount(category);
            
            // Single-item categories render as flat checkboxes (no hierarchy needed)
            if (isSingleItem) {
              const option = category.options[0];
              const isSelected = selectedValues.includes(option.value);
              return (
                <div key={category.name}>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-4 py-1.5">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggle(option.value)}
                        className="w-4 h-4 border-gray-300 rounded focus:ring-2 appearance-none border-2 checked:border-0"
                        style={{
                          backgroundColor: isSelected ? color : 'transparent',
                          borderColor: isSelected ? color : '#DADCE0'
                        }}
                      />
                      {isSelected && (
                        <svg 
                          className="absolute left-0.5 top-0.5 w-3 h-3 pointer-events-none"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path 
                            d="M2 6L5 9L10 3" 
                            stroke="white" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="flex-1 text-sm font-medium" style={{ color: '#202124' }}>
                      {option.label}
                    </span>
                    {option.count !== undefined && (
                      <span className="text-xs" style={{ color: '#5F6368' }}>
                        ({option.count})
                      </span>
                    )}
                  </label>
                </div>
              );
            }
            
            // Multi-item categories render with collapsible parent checkbox and nested child options
            return (
              <div key={category.name}>
                {/* Category Header with parent checkbox and expand/collapse button */}
                <div className="flex items-center px-4 py-1.5 hover:bg-gray-50">
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="p-0.5 mr-1 hover:bg-gray-100 rounded"
                  >
                    {isCategoryExpanded ? (
                      <ChevronDown size={16} color="#5F6368" />
                    ) : (
                      <ChevronRight size={16} color="#5F6368" />
                    )}
                  </button>
                  
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={selectionState === 'all'}
                        ref={input => {
                          if (input) {
                            input.indeterminate = selectionState === 'some';
                          }
                        }}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 border-gray-300 rounded focus:ring-2 appearance-none border-2 checked:border-0"
                        style={{
                          backgroundColor: selectionState !== 'none' ? color : 'transparent',
                          borderColor: selectionState !== 'none' ? color : '#DADCE0'
                        }}
                      />
                      {selectionState === 'all' && (
                        <svg 
                          className="absolute left-0.5 top-0.5 w-3 h-3 pointer-events-none"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path 
                            d="M2 6L5 9L10 3" 
                            stroke="white" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      {selectionState === 'some' && (
                        <svg 
                          className="absolute left-0.5 top-0.5 w-3 h-3 pointer-events-none"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path 
                            d="M2 6H10" 
                            stroke="white" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="flex-1 text-sm font-medium" style={{ color: '#202124' }}>
                      {category.name}
                    </span>
                    <span className="text-xs" style={{ color: '#5F6368' }}>
                      ({categoryCount})
                    </span>
                  </label>
                </div>

                {/* Nested child options that appear when category is expanded */}
                {isCategoryExpanded && (
                  <div className="pl-10 pr-4 space-y-1">
                    {category.options.map(option => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded"
                        >
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => onToggle(option.value)}
                              className="w-4 h-4 border-gray-300 rounded focus:ring-2 appearance-none border-2 checked:border-0"
                              style={{
                                backgroundColor: isSelected ? color : 'transparent',
                                borderColor: isSelected ? color : '#DADCE0'
                              }}
                            />
                            {isSelected && (
                              <svg 
                                className="absolute left-0.5 top-0.5 w-3 h-3 pointer-events-none"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path 
                                  d="M2 6L5 9L10 3" 
                                  stroke="white" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="flex-1 text-sm" style={{ color: '#3C4043' }}>
                            {option.label}
                          </span>
                          {option.count !== undefined && (
                            <span className="text-xs" style={{ color: '#5F6368' }}>
                              ({option.count})
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
