import React, { useState } from 'react';
import './Auth.css';
import facebookLogo from './assets/facebook.png';
import GoogleLogo from './assets/Google.png';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const safeWarn = (message) => {
  if (typeof console !== "undefined" && typeof message === 'string') {
    console.warn(message);
  } else {
    console.warn('Warning: message is not a string or is undefined');
  }
};

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/signup', { 
        email, 
        password, 
        username, 
        displayName, 
        age 
      });
      console.log('User created:', response.data);
      navigate('/UserEvents');
    } catch (error) {
      console.error('Error signing up:', error.response ? error.response.data : error.message);
      setErrorMessage('Error during sign-up process');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-left">
          <h2>Welcome Back!</h2>
          <p>To keep connected with us please login with your personal info</p>
          <Link to="/signin" className="auth-button">Sign In</Link>
        </div>
        <div className="auth-right">
          <h2>Create Account</h2>
          <div className="social-login">
            <a href="#" className="social-button facebook">
              <img src={facebookLogo} alt="Facebook" />
            </a>
            <a href="#" className="social-button google">
              <img src={GoogleLogo} alt="Google" />
            </a>
          </div>
          <p className="login-instruction">or use your email for registration</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display Name" required />
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
            <button type="submit" className="auth-button">Sign Up</button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignUp; 