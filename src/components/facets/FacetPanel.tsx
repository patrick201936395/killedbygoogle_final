import { useMemo } from 'react';
import { X } from 'lucide-react';
import { FacetGroup } from './FacetGroup';
import { HierarchicalFacetGroup } from './HierarchicalFacetGroup';
import { FilterState, Product } from '../../types/Product';
import { countByFacet } from '../../utils/filterHelpers';

interface FacetPanelProps {
  filters: FilterState;
  products: Product[];
  onToggleLifespanCategory: (category: string) => void;
  onToggleProductType: (type: string) => void;
  onToggleProductCategory: (category: string) => void;
  onToggleShutdownReason: (reason: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const lifespanCategories = [
  "Less than 1 year",
  "1-2 years",
  "2-5 years",
  "5-10 years",
  "10+ years"
];

const productTypes = ["Apps", "Services", "Hardware"];

// Hierarchical product categories grouped by Function/Use Case
const productCategoryGroups = [
  {
    name: "Social & Communication",
    categories: ["Social Media", "Communication"]
  },
  {
    name: "Productivity & Work",
    categories: ["Productivity", "Education"]
  },
  {
    name: "Entertainment & Media",
    categories: ["Media & Entertainment", "Gaming"]
  },
  {
    name: "Mobile & Apps",
    categories: ["Mobile Apps"]
  },
  {
    name: "Developer & Technical",
    categories: ["Developer Tools", "Infrastructure", "Cloud Services"]
  },
  {
    name: "Platform & Discovery",
    categories: ["Search & Discovery"]
  },
  {
    name: "Physical Devices",
    categories: ["Physical Devices"]
  }
];

// Flat list for counting (derived from groups)
const productCategories = productCategoryGroups.flatMap(group => group.categories);

// Hierarchical shutdown reasons grouped by Root Cause Domain
const shutdownReasonCategories = [
  {
    name: "Market & Competition",
    reasons: ["Competition", "Bad Market Fit", "Bad Timing"]
  },
  {
    name: "Strategy & Business",
    reasons: ["Strategic Misalignment", "Bad Business Model", "Acquisition Flu"]
  },
  {
    name: "Legal & Regulatory",
    reasons: ["Legal Challenges"]
  }
];

// Flat list for counting using flatMap
const shutdownReasons = shutdownReasonCategories.flatMap(cat => cat.reasons);

// Color mappings for each facet
const facetColors = {
  lifespan: "#EA4335",
  productType: "#4285F4",
  category: "#34A853",
  shutdownReason: "#FBBC04"
};

export function FacetPanel({
  filters,
  products,
  onToggleLifespanCategory,
  onToggleProductType,
  onToggleProductCategory,
  onToggleShutdownReason,
  onClearAll,
  activeFilterCount,
  isMobileOpen,
  onCloseMobile
}: FacetPanelProps) {
  const lifespanCounts = useMemo(
    () => countByFacet(products, 'lifespanCategory', filters, lifespanCategories as any),
    [products, filters]
  );
  const productTypeCounts = useMemo(
    () => countByFacet(products, 'productType', filters, productTypes as any),
    [products, filters]
  );
  const categoryCounts = useMemo(
    () => countByFacet(products, 'productCategory', filters, productCategories as any),
    [products, filters]
  );
  const reasonCounts = useMemo(
    () => countByFacet(products, 'shutdownReason', filters, shutdownReasons as any),
    [products, filters]
  );

  const panelContent = (
    <>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h2 style={{ color: '#202124' }}>Filters</h2>
          {activeFilterCount > 0 && (
            <p className="text-xs mt-0.5" style={{ color: '#5F6368' }}>
              {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs hover:underline"
              style={{ color: '#EA4335' }}
            >
              Clear all
            </button>
          )}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Facets */}
      <div className="overflow-y-auto flex-1">
        <FacetGroup
          title="Lifespan"
          options={lifespanCategories.map(cat => ({
            value: cat,
            label: cat,
            count: lifespanCounts[cat as keyof typeof lifespanCounts]
          }))}
          selectedValues={filters.lifespanCategories}
          onToggle={onToggleLifespanCategory}
          color={facetColors.lifespan}
        />

        <FacetGroup
          title="Product Type"
          options={productTypes.map(type => ({
            value: type,
            label: type,
            count: productTypeCounts[type as keyof typeof productTypeCounts]
          }))}
          selectedValues={filters.productTypes}
          onToggle={onToggleProductType}
          color={facetColors.productType}
        />

        <HierarchicalFacetGroup
          title="Use Case"
          categories={productCategoryGroups.map(group => ({
            name: group.name,
            options: group.categories.map(cat => ({
              value: cat,
              label: cat,
              count: categoryCounts[cat as keyof typeof categoryCounts]
            }))
          }))}
          selectedValues={filters.productCategories}
          onToggle={onToggleProductCategory}
          defaultExpanded={true}
          color={facetColors.category}
        />

        <HierarchicalFacetGroup
          title="Shutdown Reason"
          categories={shutdownReasonCategories.map(cat => ({
            name: cat.name,
            options: cat.reasons.map(reason => ({
              value: reason,
              label: reason,
              count: reasonCounts[reason as keyof typeof reasonCounts]
            }))
          }))}
          selectedValues={filters.shutdownReasons}
          onToggle={onToggleShutdownReason}
          defaultExpanded={true}
          color={facetColors.shutdownReason}
        />
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-80 border-r border-gray-200 bg-white h-[calc(100vh-73px)] sticky top-[73px]">
        {panelContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onCloseMobile}
          />
          <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-80 bg-white z-50 flex flex-col shadow-xl">
            {panelContent}
          </aside>
        </>
      )}
    </>
  );
}
