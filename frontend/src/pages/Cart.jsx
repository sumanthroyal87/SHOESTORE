import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
    setLoading(false);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const res = await axios.put(`/api/cart/${itemId}`, { quantity: newQuantity });
      setCart(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating cart');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await axios.delete(`/api/cart/${itemId}`);
      setCart(res.data);
    } catch (err) {
      alert('Error removing item');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <h2>🛒 Your Cart is Empty</h2>
            <p>Looks like you haven't added any shoes yet.</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.product ? item.product.price * item.quantity : 0);
  }, 0);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Shopping Cart ({cart.items.length} items)</h1>

        <div className="cart-page">
          <div className="cart-items">
            {cart.items.map((item) => (
              item.product && (
                <div key={item._id} className="cart-item">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>
                      <Link to={`/products/${item.product._id}`}>{item.product.name}</Link>
                    </h3>
                    <p className="cart-item-meta">
                      {item.product.brand} | Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="cart-item-price">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeItem(item._id)}>
                      ✕ Remove
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p style={{ fontSize: '12px', color: 'var(--success)', marginTop: '4px' }}>
                  Add ₹{(2000 - subtotal).toLocaleString()} more for free shipping
                </p>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <button
                className="btn btn-accent btn-block"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
              <Link
                to="/products"
                className="btn btn-outline btn-block"
                style={{ marginTop: '8px' }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
