import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../css/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const { user } = useAuth();

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const categories = ['Running', 'Casual', 'Sports', 'Sneakers', 'Formal', 'Boots'];
  const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Vans', 'Converse', 'Asics', 'Clarks', 'Timberland', 'Salomon'];
  const genders = ['Men', 'Women', 'Unisex'];

  useEffect(() => {
    fetchProducts();
  }, [category, brand, gender, sort, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (brand) params.set('brand', brand);
      if (gender) params.set('gender', gender);
      if (sort) params.set('sort', sort);
      params.set('page', page);

      const res = await axios.get(`/api/products?${params.toString()}`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setTotalProducts(res.data.totalProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleWishlist = async (productId) => {
    if (!user) {
      alert('Please login to add to wishlist');
      return;
    }
    try {
      await axios.post(`/api/wishlist/${productId}`);
      alert('Wishlist updated!');
    } catch (err) {
      alert('Error updating wishlist');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setBrand('');
    setGender('');
    setSort('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">All Products</h1>

        <div className="products-page">
          {/* Sidebar Filters */}
          <div className="filters-sidebar">
            {/* Search */}
            <div className="filter-section">
              <h3>Search</h3>
              <form onSubmit={handleSearch} className="search-bar" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  placeholder="Search shoes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit">🔍</button>
              </form>
            </div>

            {/* Category Filter */}
            <div className="filter-section">
              <h3>Category</h3>
              {categories.map((cat) => (
                <label key={cat}>
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat}
                    onChange={() => { setCategory(cat); setPage(1); }}
                  />
                  {cat}
                </label>
              ))}
            </div>

            {/* Brand Filter */}
            <div className="filter-section">
              <h3>Brand</h3>
              {brands.map((b) => (
                <label key={b}>
                  <input
                    type="radio"
                    name="brand"
                    checked={brand === b}
                    onChange={() => { setBrand(b); setPage(1); }}
                  />
                  {b}
                </label>
              ))}
            </div>

            {/* Gender Filter */}
            <div className="filter-section">
              <h3>Gender</h3>
              {genders.map((g) => (
                <label key={g}>
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === g}
                    onChange={() => { setGender(g); setPage(1); }}
                  />
                  {g}
                </label>
              ))}
            </div>

            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>

          {/* Products List */}
          <div className="products-list">
            <div className="products-header">
              <p>Showing {products.length} of {totalProducts} products</p>
              <select
                className="sort-select"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
              >
                <option value="">Sort By</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="rating">Top Rated</option>
                <option value="name_asc">Name: A-Z</option>
              </select>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h2>No Products Found</h2>
                <p>Try adjusting your filters or search terms</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="products-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {products.map((product) => (
                    <div key={product._id} className="product-card">
                      <Link to={`/products/${product._id}`}>
                        <img src={product.image} alt={product.name} className="product-card-image" />
                      </Link>
                      <div className="product-card-body">
                        <div className="product-card-brand">{product.brand}</div>
                        <Link to={`/products/${product._id}`}>
                          <h3 className="product-card-name">{product.name}</h3>
                        </Link>
                        <div className="product-card-price">
                          <span className="current-price">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice > product.price && (
                            <>
                              <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                              <span className="discount">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>
                        <div className="product-card-rating">
                          {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                          <span>({product.numReviews})</span>
                        </div>
                        <div className="product-card-actions">
                          <Link to={`/products/${product._id}`} className="btn btn-primary btn-sm">
                            View
                          </Link>
                          <button
                            className="wishlist-btn"
                            onClick={() => handleWishlist(product._id)}
                            title="Add to Wishlist"
                          >
                            ♡
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        className={page === i + 1 ? 'active' : ''}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
