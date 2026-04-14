import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Checkout.css';
import '../css/Auth.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    paymentMethod: 'COD'
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('/api/cart');
        if (!res.data.items || res.data.items.length === 0) {
          navigate('/cart');
          return;
        }
        setCart(res.data);
      } catch (err) {
        navigate('/cart');
      }
      setLoading(false);
    };
    fetchCart();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);

    try {
      const orderData = {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod
      };

      const res = await axios.post('/api/orders', orderData);
      navigate('/order-success', { state: { orderId: res.data._id } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
    setPlacing(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!cart) return null;

  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.product ? item.product.price * item.quantity : 0);
  }, 0);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="checkout-page">
          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* Shipping Address */}
            <div className="checkout-section">
              <h3>📦 Shipping Address</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Enter street address"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Enter ZIP code"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <h3>💳 Payment Method</h3>
              <div className="payment-options">
                <div
                  className={`payment-option ${formData.paymentMethod === 'COD' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={() => {}}
                  />
                  <label>💵 Cash on Delivery (COD)</label>
                </div>
                <div
                  className={`payment-option ${formData.paymentMethod === 'Online' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Online' })}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={formData.paymentMethod === 'Online'}
                    onChange={() => {}}
                  />
                  <label>🏦 Online Payment (Simulated)</label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-accent btn-lg btn-block"
              disabled={placing}
            >
              {placing ? 'Placing Order...' : `Place Order - ₹${total.toLocaleString()}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="checkout-summary">
            <div className="checkout-summary-card">
              <h3>Order Summary ({cart.items.length} items)</h3>
              {cart.items.map((item) => (
                item.product && (
                  <div key={item._id} className="checkout-item">
                    <img src={item.product.image} alt={item.product.name} />
                    <div className="checkout-item-info">
                      <h4>{item.product.name}</h4>
                      <p>Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                      <p className="item-price">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                )
              ))}
              <div style={{ marginTop: '16px' }}>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
