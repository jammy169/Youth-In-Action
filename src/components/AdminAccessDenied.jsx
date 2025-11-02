import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAccessDenied.css';

const AdminAccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-access-denied">
      <div className="access-denied-container">
        <div className="access-denied-icon">🚫</div>
        <h1>Access Denied</h1>
        <p className="access-denied-message">
          You don't have permission to access the admin dashboard.
        </p>
        <p className="access-denied-subtitle">
          Admin privileges are required to manage events and users.
        </p>
        
        <div className="access-denied-actions">
          <button 
            className="admin-signin-btn"
            onClick={() => navigate('/admin-signin')}
          >
            🔐 Admin Sign In
          </button>
          
          <button 
            className="back-to-home-btn"
            onClick={() => navigate('/')}
          >
            🏠 Back to Home
          </button>
        </div>
        
        <div className="access-denied-info">
          <p>Need admin access? Contact your system administrator.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAccessDenied;









