import { Calendar, TrendingDown } from 'lucide-react';
import { Product } from '../../types/Product';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const lifespanColors = {
  "Less than 1 year": { bg: "#EA4335", text: "#FFFFFF" },
  "1-2 years": { bg: "#FBBC04", text: "#202124" },
  "2-5 years": { bg: "#4285F4", text: "#FFFFFF" },
  "5-10 years": { bg: "#34A853", text: "#FFFFFF" },
  "10+ years": { bg: "#34A853", text: "#FFFFFF" }
};


// colors matching FacetPanel colors
const facetColors = {
  productType: { bg: "#4285F4", text: "#FFFFFF" },
  category: { bg: "#34A853", text: "#FFFFFF" }
};

// return valid productType
function mapTypeToProductType(type: string | undefined): string {
  if (!type) return '';
  const typeLower = type.toLowerCase();
  if (typeLower === 'app' || typeLower === 'apps') return 'Apps';
  if (typeLower === 'service' || typeLower === 'services') return 'Services';
  if (typeLower === 'hardware') return 'Hardware';
  return '';
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Map type field to productType for display
  const productType = product.productType || mapTypeToProductType((product as any).type) || 'Services';
  // render the product card with the product data
  return (
    <div
      onClick={onClick}
      className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer group"
      style={{ borderColor: '#DADCE0' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 style={{ color: '#202124' }}>
          {product.name}
        </h3>
        <span 
          className="px-2 py-1 rounded-full text-xs flex-shrink-0"
          style={{
            backgroundColor: lifespanColors[product.lifespanCategory].bg,
            color: lifespanColors[product.lifespanCategory].text
          }}
        >
          {product.lifespanMonths}mo
        </span>
      </div>

      {/* description */}
      <p className="text-sm mb-3 line-clamp-2" style={{ color: '#5F6368' }}>
        {product.description}
      </p>

      {/* tags */}
      <div className="flex flex-col gap-1.5 mb-3">
        <div className="flex items-center gap-2 text-xs">
          <span 
            className="px-2 py-0.5 rounded"
            style={{ backgroundColor: facetColors.productType.bg, color: facetColors.productType.text }}
          >
            Product Type :
          </span>
          <span style={{ color: '#5F6368' }}>{productType}</span>
        </div>
        {product.productCategory && (
          <div className="flex items-center gap-2 text-xs">
            <span 
              className="px-2 py-0.5 rounded"
              style={{ backgroundColor: facetColors.category.bg, color: facetColors.category.text }}
            >
              Category :
            </span>
            <span style={{ color: '#5F6368' }}>{product.productCategory}</span>
          </div>
        )}
      </div>

      {/* metadata */}
      <div className="space-y-1.5 text-xs" style={{ color: '#5F6368' }}>
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>
            {formatDate(product.dateOpen)} → {formatDate(product.dateClose)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingDown size={14} />
          <span>{product.shutdownReason}</span>
        </div>
      </div>
    </div>
  );
}
