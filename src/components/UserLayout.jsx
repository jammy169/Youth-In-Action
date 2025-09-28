// 
// src/components/UserLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './UserLayout.css'; // optional
import logo from '../assets/logo.png';

const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.tab-nav') && !event.target.closest('.mobile-dropdown')) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="layout-container">
      <nav className="tab-nav">
        <div className="logo-nav-group">
          <img src={logo} alt="Logo" className="logo-upper-left" />
          <span className="logo-title">YouthInAction</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <NavLink  
            to="/UserEvents"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Events
          </NavLink>
          <NavLink
            to="/usercontact"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Contact
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Profile
          </NavLink>
          <NavLink
            to="/notifications"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Notifications
          </NavLink>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-dropdown-backdrop" onClick={closeMobileMenu}></div>
      )}
      <div className={`mobile-dropdown ${isMobileMenuOpen ? 'open' : ''}`}>
        <NavLink  
          to="/UserEvents"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={closeMobileMenu}
        >
          Events
        </NavLink>
        <NavLink
          to="/usercontact"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={closeMobileMenu}
        >
          Contact
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={closeMobileMenu}
        >
          Profile
        </NavLink>
        <NavLink
          to="/notifications"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={closeMobileMenu}
        >
          Notifications
        </NavLink>
      </div>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
