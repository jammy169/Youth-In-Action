// 
// src/components/UserLayout.jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './UserLayout.css'; // optional
import logo from '../assets/logo.png';

const UserLayout = () => {
  return (
    <div className="layout-container">
      <nav className="tab-nav">
        <div className="logo-nav-group">
          <img src={logo} alt="Logo" className="logo-upper-left" />
          <span className="logo-title">YouthInAction</span>
        </div>
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
        
        
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
