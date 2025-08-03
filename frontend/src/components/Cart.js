import React, { useState, useEffect } from 'react';
import { cartAPI, ordersAPI } from '../services/api';
import './Cart.css';

const Cart = ({ onCheckoutSuccess, onClose }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartAPI.getCart();
        setCart(response.data || { items: [] });
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (!cart.items || cart.items.length === 0) return;
    
    try {
      setCheckoutLoading(true);
      await ordersAPI.createOrder({
        orderItems: cart.items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {},
        paymentMethod: 'stripe',
        itemsPrice: cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
      });
      
      // Clear the cart after successful order
      await cartAPI.clearCart();
      
      if (onCheckoutSuccess) {
        onCheckoutSuccess();
      }
      
      window.alert('Order placed successfully!');
      onClose();
    } catch (error) {
      console.error('Checkout error:', error);
      window.alert('Failed to place order: ' + (error.response?.data?.message || error.message));
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const itemCount = cart.items?.length || 0;
  const total = cart.items?.reduce((sum, item) => sum + (item.item?.price || 0), 0) || 0;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      {itemCount === 0 ? (
        <div className="empty-cart">Your cart is empty</div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((cartItem) => (
              <div key={`${cartItem.cart_id}-${cartItem.item_id}`} className="cart-item">
                <div className="item-details">
                  <h4>{cartItem.item?.name || 'Unknown Item'}</h4>
                  <p>Quantity: 1</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total Items:</span>
              <span>{itemCount}</span>
            </div>
            <button 
              onClick={handleCheckout} 
              disabled={checkoutLoading}
              className="checkout-btn"
            >
              {checkoutLoading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
