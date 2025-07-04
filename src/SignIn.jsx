import React, { useState } from 'react';
import './Auth.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import facebookLogo from './assets/facebook.png';
import GoogleLogo from './assets/Google.png';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/signin', { 
        email, 
        password 
      });
      console.log('User signed in:', response.data);
      navigate('/user');
    } catch (error) {
      console.error('Error signing in:', error.response ? error.response.data : error.message);
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
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
