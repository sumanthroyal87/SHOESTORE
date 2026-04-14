import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Home.css';
import '../css/Products.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('/api/products/featured');
        setFeaturedProducts(res.data);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Running', icon: '🏃', desc: 'Built for speed & comfort' },
    { name: 'Casual', icon: '👟', desc: 'Everyday style essentials' },
    { name: 'Sports', icon: '⚽', desc: 'Performance on the field' },
    { name: 'Sneakers', icon: '👠', desc: 'Trendy street fashion' },
    { name: 'Formal', icon: '👞', desc: 'Office & occasion wear' },
    { name: 'Boots', icon: '🥾', desc: 'Tough & rugged footwear' }
  ];

  const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Vans', 'Converse'];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Step Into Style</h1>
          <p>Discover the latest collection of premium footwear from top brands. Find your perfect pair today with unbeatable prices and free delivery.</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-accent">Shop Now</Link>
            <Link to="/products?category=Running" className="btn btn-outline">Running Shoes</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link to={`/products?category=${cat.name}`} key={cat.name} className="category-card">
                <div className="category-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ backgroundColor: '#fff' }}>
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.slice(0, 8).map((product) => (
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
                      <Link to={`/products/${product._id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to="/products" className="btn btn-outline">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Top Brands</h2>
          <div className="brands-grid">
            {brands.map((brand) => (
              <Link to={`/products?brand=${brand}`} key={brand} className="brand-item">
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ backgroundColor: '#fff' }}>
        <div className="container">
          <h2 className="section-title">Why Choose ShoeStore?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Delivery</h3>
              <p>Free shipping on orders above ₹2000</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Easy Returns</h3>
              <p>30-day hassle-free return policy</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>100% secure payment gateway</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💯</div>
              <h3>Authentic Products</h3>
              <p>100% genuine branded footwear</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
