import { useState, useEffect } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, SortOption } from '../../types/Product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  activeFilterCount: number;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'dateClose-desc', label: 'Recently Closed' },
  { value: 'dateClose-asc', label: 'Oldest Closed' },
  { value: 'lifespan-desc', label: 'Longest Lived' },
  { value: 'lifespan-asc', label: 'Shortest Lived' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
];

const PRODUCTS_PER_PAGE = 9;

// establish google style colors
const GOOGLE_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853'];

const getPageColor = (page: number): string => {
  return GOOGLE_COLORS[(page - 1) % GOOGLE_COLORS.length];
};

export function ProductGrid({ 
  products, 
  onProductClick, 
  sortOption, 
  onSortChange,
  activeFilterCount 
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // reset to page 1 when products change
  useEffect(() => {
    setCurrentPage(1);
  }, [products.length, sortOption]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* toolbar */}
      <div className="sticky top-[73px] bg-white border-b px-4 py-3 md:px-6 z-30" style={{ borderColor: '#DADCE0' }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <p style={{ color: '#202124' }}>
              {products.length} {products.length === 1 ? 'product' : 'products'}
              {totalPages > 1 && (
                <span className="ml-2" style={{ color: '#5F6368', fontSize: '0.875rem' }}>
                  (Page {currentPage} of {totalPages})
                </span>
              )}
            </p>
            {activeFilterCount > 0 && (
              <p className="text-xs mt-0.5" style={{ color: '#5F6368' }}>
                Filtered by {activeFilterCount} {activeFilterCount === 1 ? 'criterion' : 'criteria'}
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                style={{ 
                  borderColor: '#DADCE0',
                  color: currentPage === 1 ? '#9AA0A6' : '#3C4043'
                }}
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1.5 md:gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    const pageColor = getPageColor(page);
                    const isCurrentPage = currentPage === page;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          isCurrentPage ? '' : 'hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: isCurrentPage ? pageColor : 'transparent',
                          color: isCurrentPage ? '#FFFFFF' : '#3C4043',
                          border: isCurrentPage ? 'none' : `1px solid #DADCE0`
                        }}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2" style={{ color: '#5F6368' }}>
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                style={{ 
                  borderColor: '#DADCE0',
                  color: currentPage === totalPages ? '#9AA0A6' : '#3C4043'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} style={{ color: '#9AA0A6' }} />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ 
                borderColor: '#DADCE0',
                color: '#3C4043'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4285F4';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#DADCE0';
              }}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* grid view */}
      <div className="flex-1 p-4 md:p-6" style={{ backgroundColor: '#F8F9FA' }}>
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: '#5F6368' }}>No products match your filters.</p>
            <p className="text-sm mt-2" style={{ color: '#80868B' }}>Try adjusting or clearing your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedProducts.map((product, idx) => (
              <ProductCard
                key={product.identifier || idx}
                product={product}
                onClick={() => onProductClick(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
