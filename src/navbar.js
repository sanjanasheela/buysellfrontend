import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/searchitems', label: 'Search' },
    { path: '/ordershistory', label: 'Orders' },
    { path: '/deliveritems', label: 'Delivery' },
    { path: '/sell', label: 'Sell' },
    { path: '/mycart', label: 'Cart' }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      {/* Logo Section */}
      <div className="navbar-brand">
        <Link to="/home" className="brand-link">
          <span className="brand-text">MarketPlace</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="nav-links">
        {navItems.map((item) => (
          <div key={item.path} className="nav-item">
            <Link 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''}`}
            >
              <span className="nav-text">{item.label}</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Right Section */}
      <div className="navbar-actions">
        <button 
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'hamburger-open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="mobile-menu-content">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`mobile-nav-link ${location.pathname === item.path ? 'mobile-nav-link-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mobile-nav-text">{item.label}</span>
            </Link>
          ))}
          <button 
            className="mobile-logout-btn"
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
          >
            Logout
          </button>
        </div>
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      </div>
    </nav>
  );
}

export default Navbar;