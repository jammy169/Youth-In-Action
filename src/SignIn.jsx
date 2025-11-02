import React, { useState, useEffect } from 'react';
import './Auth.css';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import facebookLogo from './assets/facebook.png';
import GoogleLogo from './assets/Google.png';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from navigation state (e.g., after account deletion)
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
      // Auto-hide message after 8 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/UserEvents');
    } catch (error) {
      console.error('Sign in error:', error.code, error.message);
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      {/* Success Message Banner (e.g., after account deletion) */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#27ae60',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          maxWidth: '500px',
          whiteSpace: 'pre-line',
          textAlign: 'center',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
            <span style={{ flex: 1 }}>{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage('')}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '18px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="auth-box">
        <div className="auth-left">
          <h2>Welcome Back!</h2>
          <p>To keep connected with us, please log in with your personal info</p>
          <Link to="/join" className="auth-button">Sign Up</Link>
        </div>
        <div className="auth-right">
          <h2>Sign In</h2>
          <p className="login-instruction">or use your email for login</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email" 
              required 
            />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password" 
              required 
            />
            <button type="submit" className="auth-button">Sign In</button>
          </form>
          <p>
            <button
              type="button"
              className="forgot-password-link"
              onClick={() => setShowReset(true)}
              style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", padding: 0 }}
            >
              Forgot Password?
            </button>
          </p>
          {showReset && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setResetMessage('');
                try {
                  await sendPasswordResetEmail(getAuth(), resetEmail);
                  setResetMessage('Password reset email sent! Check your inbox.');
                } catch (error) {
                  setResetMessage('Error sending reset email. Please check the email address.');
                }
              }}
              className="auth-form"
              style={{ marginTop: "1em" }}
            >
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <button type="submit" className="auth-button">Send Reset Email</button>
              <button
                type="button"
                onClick={() => setShowReset(false)}
                style={{ marginLeft: "1em" }}
              >
                Cancel
              </button>
              {resetMessage && <p className="info-message">{resetMessage}</p>}
            </form>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
