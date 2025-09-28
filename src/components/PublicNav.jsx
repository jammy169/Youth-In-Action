// src/components/PublicNav.jsx
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import './PublicNav.css';

export default function PublicNav() {
  const [hideNav, setHideNav] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  let lastScrollY = window.scrollY;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setHideNav(true); // scrolling down
      } else {
        setHideNav(false); // scrolling up
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.public-tab-nav') && !event.target.closest('.mobile-dropdown')) {
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`public-tab-nav ${hideNav ? "hide" : ""}`}>
        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/join">Join</NavLink>
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
        <NavLink to="/" end onClick={closeMobileMenu}>Home</NavLink>
        <NavLink to="/events" onClick={closeMobileMenu}>Events</NavLink>
        <NavLink to="/about" onClick={closeMobileMenu}>About Us</NavLink>
        <NavLink to="/join" onClick={closeMobileMenu}>Join</NavLink>
      </div>
    </>
  );
}
