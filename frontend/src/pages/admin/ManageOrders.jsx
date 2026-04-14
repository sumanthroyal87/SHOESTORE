import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../css/Admin.css';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, orderStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { orderStatus });
      setMessage(`Order status updated to ${orderStatus}`);
      fetchOrders();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating order status');
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { paymentStatus });
      setMessage(`Payment status updated to ${paymentStatus}`);
      fetchOrders();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating payment status');
    }
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Manage Orders</h1>

        <div className="admin-layout">
          <div className="admin-sidebar">
            <div className="admin-sidebar-card">
              <h3>⚙️ Admin Menu</h3>
              <Link to="/admin" className={isActive('/admin')}>📊 Dashboard</Link>
              <Link to="/admin/products" className={isActive('/admin/products')}>📦 Products</Link>
              <Link to="/admin/orders" className={isActive('/admin/orders')}>🛍️ Orders</Link>
              <Link to="/admin/users" className={isActive('/admin/users')}>👥 Users</Link>
            </div>
          </div>

          <div className="admin-content">
            {message && <div className="alert alert-success">{message}</div>}

            <div className="admin-table-card">
              <div className="table-header">
                <h3>All Orders ({orders.length})</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Order Status</th>
                      <th>Payment Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-8).toUpperCase()}</td>
                        <td>
                          <div>{order.user?.name || 'N/A'}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                            {order.user?.email || ''}
                          </div>
                        </td>
                        <td>{order.items.length} items</td>
                        <td style={{ fontWeight: '600' }}>₹{order.totalAmount.toLocaleString()}</td>
                        <td>{order.paymentMethod}</td>
                        <td>
                          <select
                            className="status-select"
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <select
                            className="status-select"
                            value={order.paymentStatus}
                            onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                          No orders yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
