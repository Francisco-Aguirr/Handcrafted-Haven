export interface SearchFilters {
  category?: string | null;
  artisan?: string | null;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  searchTerm?: string;
}