import React, { useState } from 'react';
import './Auth.css';
import facebookLogo from './assets/facebook.png';
import GoogleLogo from './assets/Google.png';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ensureUserData } from './utils/userDataUtils';

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
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    
    try {
      const auth = getAuth();
      
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateProfile(user, {
        displayName: displayName
      });
      
      console.log('User created in Firebase Auth:', user.uid);
      
      // Try to save additional user data to Firestore
      try {
        await ensureUserData(user, {
          username: username,
          displayName: displayName,
          age: parseInt(age),
          email: email
        });
        console.log('User data saved to Firestore successfully');
      } catch (firestoreError) {
        console.warn('Firestore write failed, but user is created in Auth:', firestoreError);
        // Don't throw error here - user is already created in Firebase Auth
        // We'll try to save the data later or handle it gracefully
      }
      
      console.log('User created successfully:', user.uid);
      navigate('/UserEvents');
    } catch (error) {
      console.error('Error signing up:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Email is already registered');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Password is too weak');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email address');
      } else {
        setErrorMessage('Error during sign-up process: ' + error.message);
      }
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