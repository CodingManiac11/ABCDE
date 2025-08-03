import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaBoxOpen, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaBars, FaTimes, FaUserShield, FaHome } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ isLoggedIn, user, cartItemCount, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          E-Shop
        </Link>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-links">
              <FaHome className="nav-icon" /> Home
            </Link>
          </li>
          
          {isLoggedIn ? (
            <>
              {user?.role === 'admin' && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-links">
                    <FaUserShield className="nav-icon" /> Admin
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link to="/orders" className="nav-links">
                  <FaBoxOpen className="nav-icon" />
                  <span>My Orders</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/cart" className="nav-links cart-link">
                  <FaShoppingCart className="nav-icon" />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="cart-badge">{cartItemCount}</span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links logout-btn">
                  <FaSignOutAlt className="nav-icon" />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  <FaSignInAlt className="nav-icon" />
                  <span>Login</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links">
                  <FaUserPlus className="nav-icon" />
                  <span>Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
