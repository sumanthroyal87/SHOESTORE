import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../css/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (user) {
        try {
          const res = await axios.get('/api/cart');
          setCartCount(res.data.items ? res.data.items.length : 0);
        } catch (err) {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, [user, location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className={`navbar ${menuOpen ? 'open' : ''}`}>
      <div className="container">
        <Link to="/" className="navbar-brand">
          👟 Shoe<span>Store</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className="navbar-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/products" className={isActive('/products')}>Products</Link>
          {user && (
            <>
              <Link to="/cart" className={`cart-link ${isActive('/cart')}`}>
                🛒 Cart
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
              <Link to="/wishlist" className={isActive('/wishlist')}>♡ Wishlist</Link>
              <Link to="/orders" className={isActive('/orders')}>Orders</Link>
            </>
          )}
        </div>

        {user ? (
          <div className="navbar-user">
            {user.role === 'admin' && (
              <Link to="/admin" className="admin-link">Admin</Link>
            )}
            <Link to="/profile" className="user-name">👤 {user.name}</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <div className="navbar-auth">
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-accent btn-sm">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
