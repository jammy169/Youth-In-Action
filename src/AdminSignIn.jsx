import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAsAdmin } from './utils/adminAuth';
import './Auth.css';

const AdminSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await signInAsAdmin(email, password);
      console.log('Admin sign-in successful:', result);
      navigate('/admin');
    } catch (error) {
      console.error('Admin sign-in error:', error);
      setErrorMessage(error.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-left">
          <h2>Admin Access</h2>
          <p>Sign in with your admin credentials to manage events and users</p>
          <button 
            className="auth-button"
            onClick={() => navigate('/signin')}
          >
            Back to User Login
          </button>
        </div>
        <div className="auth-right">
          <h2>Admin Sign In</h2>
          <p className="login-instruction">Enter your admin credentials</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Admin Email" 
              required 
            />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password" 
              required 
            />
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}
            <button 
              type="submit" 
              className="auth-submit-button"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In as Admin'}
            </button>
            
            <div className="auth-links">
              <p>Need to set up admin access?</p>
              <button 
                type="button"
                className="auth-link-button"
                onClick={() => navigate('/secure-admin-setup')}
              >
                🔐 Secure Admin Setup
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
