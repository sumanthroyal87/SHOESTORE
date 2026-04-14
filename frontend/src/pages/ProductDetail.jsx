import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../css/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        if (res.data.sizes && res.data.sizes.length > 0) {
          setSelectedSize(res.data.sizes[0]);
        }
        if (res.data.colors && res.data.colors.length > 0) {
          setSelectedColor(res.data.colors[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedSize) {
      setMessage('Please select a size');
      return;
    }
    if (!selectedColor) {
      setMessage('Please select a color');
      return;
    }

    try {
      await axios.post('/api/cart', {
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor
      });
      setMessage('Added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.post(`/api/wishlist/${product._id}`);
      setMessage(res.data.message);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="page">
      <div className="container">
        {message && (
          <div className={`alert ${message.includes('success') || message.includes('Added') || message.includes('wishlist') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="product-detail">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-detail-info">
            <div className="product-detail-brand">{product.brand}</div>
            <h1 className="product-detail-name">{product.name}</h1>

            <div className="product-detail-rating">
              {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
              <span>{product.rating} ({product.numReviews} reviews)</span>
            </div>

            <div className="product-detail-price">
              <span className="current-price">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="discount">{discount}% OFF</span>
                </>
              )}
            </div>

            <p className="product-detail-desc">{product.description}</p>

            {/* Size Selector */}
            <div className="size-selector">
              <h4>Select Size (UK)</h4>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="color-selector">
              <h4>Select Color</h4>
              <div className="color-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="quantity-selector">
              <h4>Quantity:</h4>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
            </div>

            {/* Stock Status */}
            <div className={`product-detail-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
            </div>

            {/* Actions */}
            <div className="product-detail-actions">
              <button
                className="btn btn-accent"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                🛒 Add to Cart
              </button>
              <button className="btn btn-outline" onClick={handleWishlist}>
                ♡ Wishlist
              </button>
            </div>

            {/* Meta Info */}
            <div className="product-detail-meta">
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Gender:</strong> {product.gender}</p>
              <p><strong>Free Delivery:</strong> On orders above ₹2000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
