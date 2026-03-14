import React, { useState } from 'react';
import './Auth.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
