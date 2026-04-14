import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>👟 ShoeStore</h3>
            <p>Your one-stop destination for premium footwear. We bring you the best brands and latest styles at affordable prices.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/products?category=Running">Running Shoes</Link>
            <Link to="/products?category=Sneakers">Sneakers</Link>
          </div>
          <div className="footer-section">
            <h3>Customer Service</h3>
            <Link to="/orders">Track Order</Link>
            <a href="#">Return Policy</a>
            <a href="#">FAQ</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>📍 123 Shoe Street, Mumbai, India</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ support@shoestore.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 ShoeStore. All rights reserved. | AWT ESE Project</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
