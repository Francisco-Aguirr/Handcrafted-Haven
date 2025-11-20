"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSlidersH } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard';
import React from 'react';

const mockProducts = [
  {
    id: '1',
    name: 'Handwoven Ceramic Bowl',
    price: 45.99,
    image: '/placeholder-product.jpg',
    description: 'Beautiful handcrafted ceramic bowl perfect for serving.',
    rating: 5,
    artisan: {
      name: 'Maria Santos',
      avatar: '/placeholder-avatar.jpg'
    }
  },
  {
    id: '2',
    name: 'Wooden Cutting Board',
    price: 32.50,
    image: '/placeholder-product.jpg',
    description: 'Sustainable bamboo cutting board with ergonomic design.',
    rating: 4,
    artisan: {
      name: 'John Carpenter',
      avatar: '/placeholder-avatar.jpg'
    }
  },
  {
    id: '3',
    name: 'Knitted Wool Scarf',
    price: 28.75,
    image: '/placeholder-product.jpg',
    description: 'Soft merino wool scarf hand-knitted with love.',
    rating: 5,
    artisan: {
      name: 'Elena Rodriguez',
      avatar: '/placeholder-avatar.jpg'
    }
  },
  {
    id: '4',
    name: 'Glass Vase Set',
    price: 67.00,
    image: '/placeholder-product.jpg',
    description: 'Set of 3 hand-blown glass vases in different sizes.',
    rating: 4,
    artisan: {
      name: 'David Glass',
      avatar: '/placeholder-avatar.jpg'
    }
  }
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 100,
    rating: 0,
    sortBy: 'name'
  });
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    let filtered = mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.artisan.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply filters
    filtered = filtered.filter(product => {
      return product.price >= filters.minPrice &&
             product.price <= filters.maxPrice &&
             product.rating >= filters.rating;
    });

    // Apply sorting
    filtered.sort((a, b) => {
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

    setFilteredProducts(filtered);
  }, [searchTerm, filters]);

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
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                />
                All Categories
              </label>
              <label>
                <input 
                  type="radio" 
                  name="category" 
                  value="pottery"
                  checked={filters.category === 'pottery'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                />
                Pottery & Ceramics
              </label>
              <label>
                <input 
                  type="radio" 
                  name="category" 
                  value="textiles"
                  checked={filters.category === 'textiles'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                />
                Textiles & Fabrics
              </label>
              <label>
                <input 
                  type="radio" 
                  name="category" 
                  value="woodwork"
                  checked={filters.category === 'woodwork'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                />
                Woodwork
              </label>
              <label>
                <input 
                  type="radio" 
                  name="category" 
                  value="jewelry"
                  checked={filters.category === 'jewelry'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                />
                Jewelry
              </label>
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
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                className="price-input"
              />
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
                    onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                  />
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
          </div>

          <button 
            className="clear-filters"
            onClick={() => setFilters({
              category: '',
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
