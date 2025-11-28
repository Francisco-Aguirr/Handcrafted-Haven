"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSlidersH } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard';
import { getCategories } from '@/app/actions/categories';
import { getArtesians } from '@/app/actions/artesians';
import { getProducts } from '@/app/actions/products';

export default function SearchPage() {

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [artesians, setArtesians] = useState([]);
  const [products, setProducts] = useState([]);

  const [filters, setFilters] = useState({
    artesian: '',
    category: '',
    minPrice: 0,
    maxPrice: 100,
    rating: 0,
    sortBy: 'name'
  });

  const [showFilters, setShowFilters] = useState(true);

  // Fetch categories and artesians on mount
  useEffect(() => {
    async function fetchData() {
      const cats = await getCategories();
      const arts = await getArtesians();
      setCategories(cats);
      setArtesians(arts);
    }
    fetchData();
  }, []);


  // Fetch products when filters change
  useEffect(() => {
    async function fetchProducts() {
      console.log('Fetching with filters:', {
        category: filters.category,
        artesian: filters.artesian,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating,
        searchTerm: searchTerm
      });
      
      const prods = await getProducts({
        category: filters.category,
        artesian: filters.artesian,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating,
        searchTerm: searchTerm
      });
      
      console.log('Products received:', prods.length);
      setProducts(prods);
    }
    fetchProducts();
  }, [filters, searchTerm]);


  useEffect(() => {
   // if (!products.length) return;

    // Apply client-side sorting
    let sorted = [...products];
    sorted.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(sorted);
  }, [products, filters.sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  
  return (

    <div className="search-page">
      {/* Search Header */}
      <div className="search-header">
        <div className="search-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for handcrafted items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaSlidersH />
            Filters
          </button>
        </div>
      </div>

      <div className="search-content">
        {/* Sidebar Filters */}
        <div className={`search-sidebar ${showFilters ? 'visible' : 'hidden'}`}>

          <div className="filter-section">
            <h3>Categories</h3>
            <div className="filter-group">
              <label>
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)} />
                All Categories
              </label>
              {categories.map(category => (
                <label key={category.id}>
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={filters.category === category.id}
                    onChange={(e) => handleFilterChange('category', e.target.value)} />
                  {category.name}
                </label>
              ))}
            </div>
          </div><div className="filter-section">
            <h3>Artesians</h3>
            <div className="filter-group">
              <label>
                <input
                  type="radio"
                  name="artisan"
                  value=""
                  checked={filters.artesian === ''}
                  onChange={(e) => handleFilterChange('artesian', e.target.value)} />
                All Artesian
              </label>
              {artesians.map(artesian => (
                <label key={artesian.id}>
                  <input
                    type="radio"
                    name="artisan"
                    value={artesian.id}
                    checked={filters.artesian === artesian.id}
                    onChange={(e) => handleFilterChange('artesian', e.target.value)} />
                  {artesian.name}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                className="price-input" />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                className="price-input" />
            </div>
          </div>

          <div className="filter-section">
            <h3>Minimum Rating</h3>
            <div className="rating-filter">
              {[1, 2, 3, 4, 5].map(rating => (
                <label key={rating}>
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={filters.rating === rating}
                    onChange={(e) => handleFilterChange('rating', Number(e.target.value))} />
                  {rating}+ Stars
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Sort By</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="sort-select"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div><button
            className="clear-filters"
            onClick={() => setFilters({
              category: '',
              artesian: '',
              minPrice: 0,
              maxPrice: 100,
              rating: 0,
              sortBy: 'name'
            })}
          >
            Clear All Filters
          </button>



        </div>

        {/* Main Content */}
        <div className="search-main">
          <div className="search-results-header">
            <h2>Search Results</h2>
            <p>{filteredProducts.length} products found</p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
