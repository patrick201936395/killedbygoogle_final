import { Menu, X } from 'lucide-react';
import { SearchBox } from './SearchBox';
import { TFIDFIndex } from '../utils/tfidfSearch';
import { Product } from '../types/Product';
import killedByGoogleLogo from '../Killed-by-Google-12-8-2025.png';

interface HeaderProps {
  tfidfIndex: TFIDFIndex;
  onSearchResults: (products: Product[], query: string) => void;
  onResultSelect?: (product: Product) => void;
  activeFilterCount: number;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export function Header({ 
  tfidfIndex,
  onSearchResults, 
  onResultSelect,
  activeFilterCount,
  isMobileMenuOpen,
  onToggleMobileMenu 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 py-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* mobile menu toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg relative"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            {activeFilterCount > 0 && !isMobileMenuOpen && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#EA4335' }}></span>
            )}
          </button>

          {/* title */}
          <div className="flex-shrink-0">
            <img 
              src={killedByGoogleLogo} 
              alt="Killed by Google" 
              style={{ 
                height: '6rem',
                objectFit: 'contain'
              }}
              className="md:h-12"
            />
          </div>

          {/* search bar */}
          <SearchBox
            index={tfidfIndex}
            onSearchResults={onSearchResults}
            onResultSelect={onResultSelect}
            placeholder="Search products..."
          />
        </div>
      </div>
    </header>
  );
}