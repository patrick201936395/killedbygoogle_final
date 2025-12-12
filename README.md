# KilledByGoogle Redesign

## Project Architecture
```
src/
  main.tsx              # entry point
  App.tsx               # main app component
  index.css             # global styles
  
  components/
    Header.tsx          # top nav with search
    SearchBox.tsx       # search input
    facets/             # filter components
      FacetPanel.tsx
      FacetGroup.tsx
      HierarchicalFacetGroup.tsx
    product/            # product display
      ProductGrid.tsx
      ProductCard.tsx
      ProductDetail.tsx
    ui/                 # shadcn styling components
  
  hooks/
    useFilters.ts       # filter state management
  
  utils/
    filterHelpers.ts    # filtering logic
    sortHelpers.ts      # sorting logic
    tfidfSearch.ts      # search implementation
  
  types/
    Product.ts          # type definitions
  
  data/
    graveyard.json      # product data
```

Root: `index.html`, `vite.config.ts`, `package.json`


  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  