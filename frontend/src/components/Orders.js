import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import './Orders.css';

const Orders = ({ onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getMyOrders();
        // The backend returns the orders array directly
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Your Orders</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      {orders.length === 0 ? (
        <div className="no-orders">You don't have any orders yet.</div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id || order.id} className="order-card">
              <div className="order-header">
                <h3>Order #{order._id || order.id}</h3>
                <span className="order-date">
                  {new Date(order.createdAt || order.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="order-items">
                <h4>Items:</h4>
                {order.orderItems?.map((item, index) => (
                  <div key={`${order._id || order.id}-${index}`} className="order-item">
                    <span>{item.name || `Product ${item.product}`}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>${item.price.toFixed(2)} each</span>
                  </div>
                )) || <div>No items found</div>}
              </div>
              
              <div className="order-total">
                <span>Total Items:</span>
                <span>{order.cart?.cart_items?.length || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
