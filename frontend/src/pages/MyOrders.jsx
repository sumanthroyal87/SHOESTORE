import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Orders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const map = {
      'Processing': 'badge-warning',
      'Confirmed': 'badge-info',
      'Shipped': 'badge-info',
      'Delivered': 'badge-success',
      'Cancelled': 'badge-danger'
    };
    return map[status] || 'badge-info';
  };

  const getPaymentBadge = (status) => {
    const map = {
      'Pending': 'badge-warning',
      'Paid': 'badge-success',
      'Failed': 'badge-danger'
    };
    return map[status] || 'badge-warning';
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
        <h1 className="page-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <h2>📦 No Orders Yet</h2>
            <p>You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date" style={{ marginLeft: '16px' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="order-status">
                    <span className={`badge ${getStatusBadge(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className={`badge ${getPaymentBadge(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-list">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <img src={item.image} alt={item.name} />
                        <div className="order-item-info">
                          <h4>{item.name}</h4>
                          <p>Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                          <p style={{ fontWeight: '600', color: 'var(--primary)' }}>
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-card-footer">
                  <span className="order-total">Total: ₹{order.totalAmount.toLocaleString()}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                    {order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '🏦 Online Payment'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
