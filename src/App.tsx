import { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { FacetPanel } from './components/Facets/FacetPanel';
import { ProductGrid } from './components/Product/ProductGrid';
import { ProductDetail } from './components/Product/ProductDetail';
import { useFilters } from './hooks/useFilters';
import { applyFilters } from './utils/filterHelpers';
import { sortProducts } from './utils/sortHelpers';
import { buildTFIDFIndex } from './utils/tfidfSearch';
import { Product, SortOption } from './types/Product';
import productsData from './data/graveyard.json';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('dateClose-desc');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [searchQuery, setSearchQueryState] = useState('');

  const products = productsData as Product[];

  // cuild TF-IDF index once
  const tfidfIndex = useMemo(() => buildTFIDFIndex(products), [products]);

  const {
    filters,
    toggleLifespanCategory,
    toggleProductType,
    toggleProductCategory,
    toggleShutdownReason,
    setSearchQuery,
    clearAllFilters,
    activeFilterCount
  } = useFilters();

  // handle the TF-IDF search results
  const handleSearchResults = useCallback((results: Product[], query: string) => {
    setSearchResults(query ? results : null);
    setSearchQueryState(query);
    setSearchQuery(query);
  }, [setSearchQuery]);

  // apply filters and sorting
  const filteredProducts = useMemo(() => {
    const baseProducts = searchResults !== null ? searchResults : products;
    const filtered = applyFilters(baseProducts, { ...filters, searchQuery: '' }); // Skip text search in applyFilters
    // If there's a search query, preserve the TF-IDF ranking; otherwise sort normally
    if (searchQuery && searchResults !== null) {
      // Apply facet filters but keep TF-IDF order
      return filtered;
    }
    return sortProducts(filtered, sortOption);
  }, [products, searchResults, searchQuery, filters, sortOption]);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <Header
        tfidfIndex={tfidfIndex}
        onSearchResults={handleSearchResults}
        onResultSelect={setSelectedProduct}
        activeFilterCount={activeFilterCount}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={handleToggleMobileMenu}
      />

      <div className="flex">
        <FacetPanel
          filters={filters}
          products={searchResults !== null ? searchResults : products}
          onToggleLifespanCategory={toggleLifespanCategory}
          onToggleProductType={toggleProductType}
          onToggleProductCategory={toggleProductCategory}
          onToggleShutdownReason={toggleShutdownReason}
          onClearAll={clearAllFilters}
          activeFilterCount={activeFilterCount}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={handleCloseMobileMenu}
        />

        <ProductGrid
          products={filteredProducts}
          onProductClick={setSelectedProduct}
          sortOption={sortOption}
          onSortChange={setSortOption}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}