import { Product, SortOption } from '../types/Product';

export function sortProducts(products: Product[], sortOption: SortOption): Product[] {
  const sorted = [...products];

  switch (sortOption) {
    case 'dateClose-desc':
      return sorted.sort((a, b) => 
        new Date(b.dateClose).getTime() - new Date(a.dateClose).getTime()
      );
    
    case 'dateClose-asc':
      return sorted.sort((a, b) => 
        new Date(a.dateClose).getTime() - new Date(b.dateClose).getTime()
      );
    
    case 'lifespan-desc':
      return sorted.sort((a, b) => b.lifespanMonths - a.lifespanMonths);
    
    case 'lifespan-asc':
      return sorted.sort((a, b) => a.lifespanMonths - b.lifespanMonths);
    
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    
    default:
      return sorted;
  }
}
