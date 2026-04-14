import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Cart.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get('/api/wishlist');
      setWishlist(res.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
    setLoading(false);
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await axios.post(`/api/wishlist/${productId}`);
      setWishlist(res.data.wishlist);
    } catch (err) {
      alert('Error removing from wishlist');
    }
  };

  const addToCart = async (product) => {
    try {
      await axios.post('/api/cart', {
        productId: product._id,
        quantity: 1,
        size: product.sizes[0],
        color: product.colors[0]
      });
      alert('Added to cart! Redirecting...');
      navigate('/cart');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">My Wishlist ({wishlist.length} items)</h1>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <h2>♡ Your Wishlist is Empty</h2>
            <p>Save your favorite shoes for later.</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div key={product._id} className="wishlist-item">
                <Link to={`/products/${product._id}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className="wishlist-item-body">
                  <h3>{product.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>{product.brand}</p>
                  <p className="price">₹{product.price.toLocaleString()}</p>
                  <div className="wishlist-item-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ background: '#fde8e8', color: '#c0392b' }}
                      onClick={() => removeFromWishlist(product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
