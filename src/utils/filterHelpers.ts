import { Product, FilterState } from '../types/Product';

// Map data type field to productType filter values
function mapTypeToProductType(type: string | undefined): string {
  if (!type) return '';
  const typeLower = type.toLowerCase();
  if (typeLower === 'app' || typeLower === 'apps') return 'Apps';
  if (typeLower === 'service' || typeLower === 'services') return 'Services';
  if (typeLower === 'hardware') return 'Hardware';
  return '';
}

export function applyFilters(products: Product[], filters: FilterState): Product[] {
  return products.filter(product => {
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.notableFeatures?.some(f => f.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // lifespan category filter
    if (filters.lifespanCategories.length > 0) {
      if (!filters.lifespanCategories.includes(product.lifespanCategory)) {
        return false;
      }
    }

    // product type filter
    if (filters.productTypes.length > 0) {
      const mappedType = mapTypeToProductType((product as any).type);
      if (!mappedType || !filters.productTypes.includes(mappedType)) {
        return false;
      }
    }

    // product category filter
    if (filters.productCategories.length > 0) {
      if (!filters.productCategories.includes(product.productCategory)) {
        return false;
      }
    }

    // shutdown reason filter
    if (filters.shutdownReasons.length > 0) {
      if (!filters.shutdownReasons.includes(product.shutdownReason)) {
        return false;
      }
    }

    return true;
  });
}

export function countByFacet<T extends string>(
  products: Product[],
  facetKey: keyof Product,
  filters: FilterState,
  currentFacetValues: T[]
): Record<T, number> {
  const counts = {} as Record<T, number>;
  
  currentFacetValues.forEach(value => {
    counts[value] = 0;
  });

  // create a modified filter state that excludes the current facet being counted
  const filtersForCounting: FilterState = { ...filters };
  
  // exclude the current facet from filtering so we can count all values
  if (facetKey === 'lifespanCategory') {
    filtersForCounting.lifespanCategories = [];
  } else if (facetKey === 'productType') {
    filtersForCounting.productTypes = [];
  } else if (facetKey === 'productCategory') {
    filtersForCounting.productCategories = [];
  } else if (facetKey === 'shutdownReason') {
    filtersForCounting.shutdownReasons = [];
  }

  // apply filters (excluding current facet) to get the filtered product set
  const filteredProducts = applyFilters(products, filtersForCounting);

  // count products in the filtered set
  filteredProducts.forEach(product => {
    let productValue = product[facetKey];
    
    // map type field to productType values when counting
    if (facetKey === 'productType' && !productValue) {
      productValue = mapTypeToProductType((product as any).type) as any;
    }
    
    if (Array.isArray(productValue)) {
      productValue.forEach(val => {
        if (currentFacetValues.includes(val as T)) {
          counts[val as T] = (counts[val as T] || 0) + 1;
        }
      });
    } else if (productValue && currentFacetValues.includes(productValue as T)) {
      counts[productValue as T] = (counts[productValue as T] || 0) + 1;
    }
  });

  return counts;
}
