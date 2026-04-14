import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../css/Admin.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/admin/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Manage Users</h1>

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
            <div className="admin-table-card">
              <div className="table-header">
                <h3>All Users ({users.length})</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td style={{ fontWeight: '500' }}>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.phone || '-'}</td>
                        <td>
                          {new Date(user.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                          No users found
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

export default ManageUsers;
