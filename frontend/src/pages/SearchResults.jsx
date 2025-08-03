import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './CSS/SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const query = searchParams.get('query');
  const category = searchParams.get('category') || 'all';

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/search?query=${encodeURIComponent(query)}&category=${category}`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.error || 'Search failed');
        }
      } catch (err) {
        setError('Failed to fetch search results');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, category]);

  if (!query) {
    return (
      <div className="search-results-container">
        <div className="search-header">
          <h2>Search Results</h2>
          <p>Please enter a search query to find products.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="search-results-container">
        <div className="search-header">
          <h2>Searching...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-container">
        <div className="search-header">
          <h2>Search Error</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h2>Search Results for "{query}"</h2>
        {category !== 'all' && <p className="category-filter">Category: {category}</p>}
        <p className="results-count">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
      </div>
      
      {products.length === 0 ? (
        <div className="no-results">
          <h3>No products found</h3>
          <p>Try adjusting your search terms or browse our categories:</p>
          <div className="category-links">
            <Link to="/mens" className="category-link">Men's Collection</Link>
            <Link to="/womens" className="category-link">Women's Collection</Link>
            <Link to="/kids" className="category-link">Kids Collection</Link>
          </div>
        </div>
      ) : (
        <div className="search-results-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="product-link">
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-prices">
                    <span className="new-price">${product.new_price}</span>
                    {product.old_price && (
                      <span className="old-price">${product.old_price}</span>
                    )}
                  </div>
                  <span className="product-category">{product.category}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;