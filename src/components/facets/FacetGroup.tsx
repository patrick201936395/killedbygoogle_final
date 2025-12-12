import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FacetOption {
  value: string;
  label: string;
  count?: number;
}

// What this component needs to work
interface FacetGroupProps {
  title: string;                    // The category name
  options: FacetOption[];           // Filter options
  selectedValues: string[];         // Selected Options
  onToggle: (value: string) => void; // Click status of the checkbox
  defaultExpanded?: boolean;        // default expanded state
  color?: string;                   // color of checkbox
}

export function FacetGroup({ 
  title, 
  options, 
  selectedValues, 
  onToggle,
  defaultExpanded = true,
  color = '#4285F4'
}: FacetGroupProps) {
  // track expanded state
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      {/* The tab  that toggles the filter group expand or closed */}
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

      {/* show the checkboxes when the group is expanded */}
      {isExpanded && (
        <div className="px-4 pb-3 space-y-2">
          {/* loop through each filter option and create a checkbox for it */}
          {options.map(option => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded"
              >
                {/* custom checkbox */}
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
                  {/* white checkmark when selected */}
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
                {/* facet label */}
                <span className="flex-1 text-sm" style={{ color: '#3C4043' }}>
                  {option.label}
                </span>
                {/* count in parentheses*/}
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
}
