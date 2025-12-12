import { X, ExternalLink } from 'lucide-react';
import { Product } from '../../types/Product';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

// return valid productType
function mapTypeToProductType(type: string | undefined): string {
  if (!type) return '';
  const typeLower = type.toLowerCase();
  if (typeLower === 'app' || typeLower === 'apps') return 'Apps';
  if (typeLower === 'service' || typeLower === 'services') return 'Services';
  if (typeLower === 'hardware') return 'Hardware';
  return '';
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // return valid productType
  const productType = product.productType || mapTypeToProductType(product.type) || 'Services';
  
  // get all links from graveyard.json
  const links = product.link && product.link.length > 0 ? product.link : [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-start justify-between" style={{ borderColor: '#DADCE0' }}>
          <div>
            <h2 style={{ color: '#202124' }}>{product.name}</h2>
            <p className="text-sm mt-1" style={{ color: '#5F6368' }}>{product.productCategory}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} color="#5F6368" />
          </button>
        </div>

        {/* content */}
        <div className="p-6 space-y-6">
          {/* description */}
          <div>
            <h3 style={{ color: '#202124' }} className="mb-2">Description</h3>
            <p style={{ color: '#3C4043' }}>{product.description}</p>
          </div>

          {/* timeline */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#F8F9FA' }}>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-xs mb-1" style={{ color: '#5F6368' }}>Launched</div>
                <div style={{ color: '#202124' }}>{formatDate(product.dateOpen)}</div>
              </div>
              <div style={{ color: '#9AA0A6' }}>→</div>
              <div className="flex-1">
                <div className="text-xs mb-1" style={{ color: '#5F6368' }}>Discontinued</div>
                <div style={{ color: '#202124' }}>{formatDate(product.dateClose)}</div>
              </div>
              <div className="flex-1">
                <div className="text-xs mb-1" style={{ color: '#5F6368' }}>Lifespan</div>
                <div style={{ color: '#202124' }}>{product.lifespanMonths} months</div>
              </div>
            </div>
          </div>

          {/* key details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs mb-1" style={{ color: '#5F6368' }}>Product Type</div>
              <div style={{ color: '#202124' }}>{productType}</div>
            </div>
          </div>

          {/* Shutdown Information */}
          <div>
            <h3 style={{ color: '#202124' }} className="mb-2">Shutdown Information</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs mb-1" style={{ color: '#5F6368' }}>Reason</div>
                <div style={{ color: '#202124' }}>{product.shutdownReason}</div>
              </div>
              {product.shutdownReasonDetail && (
                <div>
                  <div className="text-xs mb-1" style={{ color: '#5F6368' }}>Details</div>
                  <div style={{ color: '#3C4043' }}>{product.shutdownReasonDetail}</div>
                </div>
              )}
            </div>
          </div>

          {/* notable features */}
          {product.notableFeatures && product.notableFeatures.length > 0 && (
            <div>
              <h3 style={{ color: '#202124' }} className="mb-2">Notable Features</h3>
              <div className="flex flex-wrap gap-2">
                {product.notableFeatures.map((feature, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: '#D2E3FC', color: '#174EA6' }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* links */}
          {links.length > 0 && (
            <div className="pt-4 border-t" style={{ borderColor: '#DADCE0' }}>
              <h3 style={{ color: '#202124' }} className="mb-3">
                {links.length === 1 ? 'Related Link' : 'Related Links'}
              </h3>
              <div className="space-y-2">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:underline break-all"
                    style={{ color: '#4285F4' }}
                  >
                    <ExternalLink size={16} />
                    <span className="text-sm">{link}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
