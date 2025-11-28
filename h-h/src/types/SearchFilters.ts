export interface SearchFilters {
  category?: string | null;
  artesian?: string | null;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  searchTerm?: string;
}