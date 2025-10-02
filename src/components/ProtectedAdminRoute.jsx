import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChange, isAuthenticatedAdmin } from '../utils/adminAuth';
import AdminAccessDenied from './AdminAccessDenied';
import './ProtectedAdminRoute.css';

const ProtectedAdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser, isAdmin) => {
      console.log('🔐 Admin Auth State Changed:', { 
        user: currentUser?.email, 
        isAdmin,
        isAuthenticated: isAdmin 
      });
      
      setUser(currentUser);
      setIsAuthenticated(isAdmin);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>🔐 Verifying admin access...</p>
      </div>
    );
  }

  // Show access denied page if not authenticated
  if (!isAuthenticated) {
    console.log('🚫 Admin access denied - showing access denied page');
    return <AdminAccessDenied />;
  }

  // Show admin content if authenticated
  console.log('✅ Admin access granted for:', user?.email);
  return (
    <div className="protected-admin-container">
      <div className="admin-header">
        <div className="admin-info">
          <span className="admin-badge">🔐 Admin</span>
          <span className="admin-email">{user?.email}</span>
        </div>
        <button 
          className="admin-signout-btn"
          onClick={async () => {
            const { signOutAdmin } = await import('../utils/adminAuth');
            await signOutAdmin();
            window.location.href = '/admin-signin';
          }}
        >
          Sign Out
        </button>
      </div>
      {children}
    </div>
  );
};

export default ProtectedAdminRoute;
