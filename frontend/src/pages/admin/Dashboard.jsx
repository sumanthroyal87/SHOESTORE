import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../css/Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const isActive = (path) => location.pathname === path ? 'active' : '';

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
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="admin-layout">
          {/* Sidebar */}
          <div className="admin-sidebar">
            <div className="admin-sidebar-card">
              <h3>⚙️ Admin Menu</h3>
              <Link to="/admin" className={isActive('/admin')}>📊 Dashboard</Link>
              <Link to="/admin/products" className={isActive('/admin/products')}>📦 Products</Link>
              <Link to="/admin/orders" className={isActive('/admin/orders')}>🛍️ Orders</Link>
              <Link to="/admin/users" className={isActive('/admin/users')}>👥 Users</Link>
            </div>
          </div>

          {/* Content */}
          <div className="admin-content">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-value">{stats?.totalProducts || 0}</div>
                <div className="stat-label">Total Products</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛍️</div>
                <div className="stat-value">{stats?.totalOrders || 0}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{stats?.totalUsers || 0}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">₹{(stats?.totalRevenue || 0).toLocaleString()}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>

            {/* Order Status Summary */}
            {stats?.ordersByStatus && stats.ordersByStatus.length > 0 && (
              <div className="admin-table-card" style={{ marginBottom: '20px' }}>
                <div className="table-header">
                  <h3>Order Status Overview</h3>
                </div>
                <div style={{ padding: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {stats.ordersByStatus.map((item) => (
                    <div key={item._id} style={{
                      padding: '12px 20px',
                      background: 'var(--bg)',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>
                        {item.count}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>{item._id}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders */}
            <div className="admin-table-card">
              <div className="table-header">
                <h3>Recent Orders</h3>
                <Link to="/admin/orders" className="btn btn-primary btn-sm">View All</Link>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-8).toUpperCase()}</td>
                      <td>{order.user?.name || 'N/A'}</td>
                      <td>₹{order.totalAmount.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${
                          order.orderStatus === 'Delivered' ? 'badge-success' :
                          order.orderStatus === 'Cancelled' ? 'badge-danger' :
                          'badge-warning'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                  {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
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
  );
};

export default Dashboard;
