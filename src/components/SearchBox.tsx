import { useState, useCallback, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '../types/Product';
import { SearchResult, searchProducts, TFIDFIndex } from '../utils/tfidfSearch';

interface SearchBoxProps {
  index: TFIDFIndex | null;
  onSearchResults: (products: Product[], query: string) => void;
  onResultSelect?: (product: Product) => void;
  placeholder?: string;
}

export function SearchBox({ 
  index, 
  onSearchResults,
  onResultSelect,
  placeholder = "Search products..." 
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Perform search with debouncing
  const performSearch = useCallback((searchQuery: string) => {
    if (!index) return;

    if (!searchQuery.trim()) {
      setResults([]);
      onSearchResults(index.products, '');
      return;
    }

    setIsSearching(true);
    
    // Debounce the search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const searchResults = searchProducts(searchQuery, index);
      setResults(searchResults);
      onSearchResults(searchResults.map(r => r.product), searchQuery);
      setIsSearching(false);
    }, 150);
  }, [index, onSearchResults]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    performSearch(newQuery);
    setShowDropdown(true);
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    if (index) {
      onSearchResults(index.products, '');
    }
    inputRef.current?.focus();
  };

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const topResults = results.slice(0, 5);

  return (
    <div className="relative flex-1 max-w-xl ml-auto">
      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2" 
          style={{ color: '#9AA0A6' }} 
          size={20} 
        />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ 
            borderColor: '#DADCE0',
            backgroundColor: '#F1F3F4',
            paddingRight: query ? '2.75rem' : '2.5rem'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4285F4';
            e.target.style.backgroundColor = '#FFFFFF';
            if (query) setShowDropdown(true);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#DADCE0';
            e.target.style.backgroundColor = '#F1F3F4';
          }}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded-full z-10"
            style={{ 
              color: '#5F6368',
              right: '0.375rem'
            }}
            type="button"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && query && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 overflow-hidden"
          style={{ borderColor: '#DADCE0' }}
        >
          {isSearching ? (
            <div className="px-4 py-3 text-sm" style={{ color: '#5F6368' }}>
              Searching...
            </div>
          ) : topResults.length > 0 ? (
            <>
              <div className="px-4 py-2 text-xs font-medium border-b" style={{ color: '#5F6368', borderColor: '#DADCE0' }}>
                Top Results ({results.length} found)
              </div>
              {topResults.map((result, idx) => (
                <div
                  key={result.product.identifier || idx}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  style={{ borderColor: '#DADCE0' }}
                  onClick={() => {
                    setShowDropdown(false);
                    onResultSelect?.(result.product);
                  }}
                >
                  <div>
                    <span className="font-medium text-sm" style={{ color: '#202124' }}>
                      {result.product.name}
                    </span>
                    <p className="text-xs truncate mt-0.5" style={{ color: '#5F6368' }}>
                      {result.product.description}
                    </p>
                  </div>
                </div>
              ))}
              {results.length > 5 && (
                <div 
                  className="px-4 py-2 text-xs text-center"
                  style={{ color: '#5F6368', backgroundColor: '#F8F9FA' }}
                >
                  +{results.length - 5} more results
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-3 text-sm" style={{ color: '#5F6368' }}>
              No products found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
