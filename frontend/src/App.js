import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Register from './components/Register';
import ItemsList from './components/ItemsList';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Navbar from './components/Navbar';
import AdminDashboard from './components/admin/AdminDashboard';
import './App.css';

// Import the demo component (it will be tree-shaken in production)
const ImageUploadDemo = React.lazy(() => import('./pages/demo/ImageUploadDemo'));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [] });
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    // Check if user is already logged in
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      // Clear invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    try {
      setIsLoggedIn(true);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  };

  const handleRegisterSuccess = (userData) => {
    try {
      setIsLoggedIn(true);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const handleCartUpdate = (updatedCart) => {
    setCart(updatedCart);
  };

  const handleOrderSuccess = () => {
    setCart({ items: [] });
  };

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const location = useLocation();

  return (
    <div className="app">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        user={user}
        cartItemCount={cartItemCount} 
        onLogout={handleLogout} 
      />
      
      <main className="main-content">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <ItemsList onCartUpdate={handleCartUpdate} />
              ) : (
                <Navigate to="/login" state={{ from: location }} replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <div className="auth-container">
                  <Login onLoginSuccess={handleLoginSuccess} />
                </div>
              )
            }
          />
          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <div className="auth-container">
                  <Register onRegisterSuccess={handleRegisterSuccess} />
                </div>
              )
            }
          />
          <Route
            path="/cart"
            element={
              isLoggedIn ? (
                <div className="page-container">
                  <Cart onOrderSuccess={handleOrderSuccess} cart={cart} />
                </div>
              ) : (
                <Navigate to="/login" state={{ from: '/cart' }} replace />
              )
            }
          />
          <Route
            path="/orders"
            element={
              isLoggedIn ? (
                <div className="page-container">
                  <Orders />
                </div>
              ) : (
                <Navigate to="/login" state={{ from: '/orders' }} replace />
              )
            }
          />
          {isDevelopment && (
            <Route
              path="/demo/image-upload"
              element={
                <div className="page-container">
                  <Suspense fallback={<div className="loading">Loading...</div>}>
                    <ImageUploadDemo />
                  </Suspense>
                </div>
              }
            />
          )}
          <Route
            path="/admin"
            element={
              isLoggedIn && user?.role === 'admin' ? (
                <div className="page-container">
                  <AdminDashboard />
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <footer className="footer">
        <div className="footer-content">
          <p> {new Date().getFullYear()} E-Shop. All rights reserved.</p>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
