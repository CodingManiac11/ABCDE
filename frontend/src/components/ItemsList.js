import React, { useState, useEffect } from 'react';
import { itemsAPI, cartAPI, ordersAPI } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ItemsList.css';

const ItemsList = ({ onCartUpdate, onCheckoutSuccess }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState({ items: [] });
  const [addingItem, setAddingItem] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, cartRes] = await Promise.all([
        itemsAPI.getItems(),
        cartAPI.getCart().catch(() => ({ data: { items: [] } }))
      ]);
      
      const productsData = productsRes.data?.data || productsRes.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCart(cartRes.data || { items: [] });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setAddingItem(productId);
      await cartAPI.addToCart(productId);
      
      // Refresh cart
      const cartRes = await cartAPI.getCart();
      setCart(cartRes.data);
      
      if (onCartUpdate) {
        onCartUpdate(cartRes.data);
      }
      
      toast.success('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setAddingItem(null);
    }
  };

  const handleViewCart = async () => {
    try {
      const cartRes = await cartAPI.getCart();
      const cartItems = cartRes.data?.items || [];
      
      if (cartItems.length === 0) {
        toast.info('Your cart is empty');
        return;
      }
      
      const cartDetails = cartItems.map(item => 
        `Item ID: ${item.product?._id || 'N/A'}, 
         Name: ${item.product?.name || 'N/A'}, 
         Qty: ${item.quantity}`
      ).join('\n\n');
      
      alert('Your Cart Items:\n\n' + cartDetails);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    }
  };

  const handleViewOrderHistory = async () => {
    try {
      const ordersRes = await ordersAPI.getMyOrders();
      const orders = ordersRes.data?.data || [];
      
      if (orders.length === 0) {
        toast.info('No orders found');
        return;
      }
      
      const orderDetails = orders.map(order => 
        `Order ID: ${order._id}\n` +
        `Date: ${new Date(order.createdAt).toLocaleDateString()}\n` +
        `Total: $${order.totalAmount.toFixed(2)}`
      ).join('\n\n');
      
      alert('Your Order History:\n\n' + orderDetails);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load order history');
    }
  };

  const handleCheckout = async () => {
    if (cart.items?.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }

    if (!window.confirm('Proceed to checkout?')) {
      return;
    }

    try {
      setIsCheckingOut(true);
      await ordersAPI.createOrder();
      
      // Clear cart
      setCart({ items: [] });
      if (onCartUpdate) {
        onCartUpdate({ items: [] });
      }
      
      toast.success('Order placed successfully!');
      
      if (onCheckoutSuccess) {
        onCheckoutSuccess();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="items-container">
      <div className="action-buttons">
        <button 
          onClick={handleCheckout} 
          disabled={isCheckingOut || !cart.items?.length}
          className="btn btn-primary"
        >
          {isCheckingOut ? 'Processing...' : 'Checkout'}
        </button>
        <button 
          onClick={handleViewCart} 
          className="btn btn-secondary"
        >
          View Cart ({cart.items?.length || 0})
        </button>
        <button 
          onClick={handleViewOrderHistory} 
          className="btn btn-secondary"
        >
          Order History
        </button>
      </div>

      <h2>Available Products</h2>
      <div className="items-grid">
        {products.map((product) => (
          <div key={product._id || product.id} className="item-card">
            {product.image && (
              <div className="item-image">
                <img src={product.image} alt={product.name} />
              </div>
            )}
            <div className="item-details">
              <h3>{product.name}</h3>
              <p className="price">${product.price?.toFixed(2)}</p>
              <p className="description">{product.description || 'No description available'}</p>
              <button 
                onClick={() => handleAddToCart(product._id || product.id)}
                disabled={addingItem === (product._id || product.id)}
                className="btn btn-primary"
              >
                {addingItem === (product._id || product.id) 
                  ? 'Adding...' 
                  : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
