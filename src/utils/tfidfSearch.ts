import { Product } from '../types/Product';

// Tokenize text into words, removing punctuation and converting to lowercase
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1);
}

// Stop words to filter out common words that don't add meaning
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
  'used', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
  'she', 'we', 'they', 'what', 'which', 'who', 'whom', 'when', 'where',
  'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there'
]);

function removeStopWords(tokens: string[]): string[] {
  return tokens.filter(token => !STOP_WORDS.has(token));
}

// Simple stemmer - reduces words to their base form
function stem(word: string): string {
  // Simple suffix removal for common English patterns
  if (word.endsWith('ing')) return word.slice(0, -3);
  if (word.endsWith('ed')) return word.slice(0, -2);
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('es')) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  if (word.endsWith('ly')) return word.slice(0, -2);
  if (word.endsWith('ment')) return word.slice(0, -4);
  if (word.endsWith('tion')) return word.slice(0, -4);
  if (word.endsWith('ness')) return word.slice(0, -4);
  return word;
}

function processText(text: string): string[] {
  const tokens = tokenize(text);
  const filtered = removeStopWords(tokens);
  return filtered.map(stem);
}

function getProductId(product: Product): string {
  return product.identifier || product.name;
}

// Extract searchable text from a product
function getProductText(product: Product): string {
  const parts = [
    product.name,
    product.description,
    product.productCategory,
    product.productType || (product as any).type || '',
    product.shutdownReason,
    product.shutdownReasonDetail || (product as any).shutdownReasonDetail || '',
    ...(product.notableFeatures || [])
  ];
  return parts.join(' ');
}

export interface TFIDFIndex {
  documents: Map<string, string[]>; // identifier -> processed tokens
  documentFrequency: Map<string, number>; // term -> number of documents containing term
  totalDocuments: number;
  products: Product[];
}

// TF-IDF index from products
export function buildTFIDFIndex(products: Product[]): TFIDFIndex {
  const documents = new Map<string, string[]>();
  const documentFrequency = new Map<string, number>();

  // process each product
  products.forEach(product => {
    const text = getProductText(product);
    const tokens = processText(text);
    const productId = getProductId(product);
    documents.set(productId, tokens);

    // count unique terms per document for document frequency
    const uniqueTerms = new Set(tokens);
    uniqueTerms.forEach(term => {
      documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1);
    });
  });

  return {
    documents,
    documentFrequency,
    totalDocuments: products.length,
    products
  };
}

// calculate Term Frequency (TF), which is how often a term appears in a document
function calculateTF(term: string, documentTokens: string[]): number {
  const termCount = documentTokens.filter(t => t === term).length;
  // implement log normalization to prevent bias towards longer documents
  return termCount > 0 ? 1 + Math.log(termCount) : 0;
}

// calculate Inverse Document Frequency (IDF), which is how rare a term is across all documents
function calculateIDF(term: string, index: TFIDFIndex): number {
  const df = index.documentFrequency.get(term) || 0;
  if (df === 0) return 0;
  // Using smooth IDF to avoid division by zero
  return Math.log((index.totalDocuments + 1) / (df + 1)) + 1;
}

// Calculate TF-IDF score for a query against a document
function calculateTFIDFScore(queryTokens: string[], documentTokens: string[], index: TFIDFIndex): number {
  let score = 0;
  
  queryTokens.forEach(queryTerm => {
    const tf = calculateTF(queryTerm, documentTokens);
    const idf = calculateIDF(queryTerm, index);
    score += tf * idf;
  });

  // normalize by query length to make scores comparable
  return queryTokens.length > 0 ? score / queryTokens.length : 0;
}

export interface SearchResult {
  product: Product;
  score: number;
}

// search products using TF-IDF
export function searchProducts(query: string, index: TFIDFIndex): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const queryTokens = processText(query);
  
  if (queryTokens.length === 0) {
    return [];
  }

  const results: SearchResult[] = [];

  index.products.forEach(product => {
    const productId = getProductId(product);
    const documentTokens = index.documents.get(productId) || [];
    const score = calculateTFIDFScore(queryTokens, documentTokens, index);

    // boost scores with exact matches or partial matches
    let finalScore = score;
    const nameLower = product.name.toLowerCase();
    const queryLower = query.toLowerCase();
    
    if (nameLower.includes(queryLower)) {
      finalScore += 2; // boost for name match
    } else if (queryLower.split(' ').some(word => nameLower.includes(word))) {
      finalScore += 0.5; // smaller boost for partial name match
    }

    // rule - only include results with final score >= 1
    if (finalScore >= 1) {
      results.push({ product, score: finalScore });
    }
  });

  // sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results;
}
