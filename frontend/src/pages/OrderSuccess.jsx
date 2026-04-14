import { Link, useLocation } from 'react-router-dom';
import '../css/Checkout.css';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="page">
      <div className="container">
        <div className="order-success">
          <div className="success-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your purchase. Your order has been confirmed.</p>
          {orderId && (
            <p className="order-id">Order ID: #{orderId}</p>
          )}
          <p>You will receive an email confirmation shortly.</p>
          <div>
            <Link to="/orders" className="btn btn-primary">View My Orders</Link>
            <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
