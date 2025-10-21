image.pngimport React, { useState } from 'react';
import './Auth.css';
import facebookLogo from './assets/facebook.png';
import GoogleLogo from './assets/Google.png';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from 'firebase/auth';
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
  const [phone, setPhone] = useState('');
  const [sitio, setSitio] = useState('');
  const [barangay, setBarangay] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const navigate = useNavigate();

  // Enhanced validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Gmail validation function
  const validateGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    return gmailRegex.test(email);
  };

  const validateAge = (age) => {
    const ageNum = parseInt(age);
    return ageNum >= 13 && ageNum <= 100;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return 'strong';
    return 'medium';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  // Google Sign-In function
  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      // Set additional scopes if needed
      provider.addScope('email');
      provider.addScope('profile');
      
      console.log('🔐 Starting Google sign-in...');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log('✅ Google sign-in successful:', user.email);
      
      // Save user data to Firestore
      try {
        await ensureUserData(user, {
          username: user.displayName?.split(' ')[0] || user.email.split('@')[0],
          displayName: user.displayName || user.email.split('@')[0],
          age: null, // Google doesn't provide age
          email: user.email,
          phone: user.phoneNumber || '',
          sitio: '',
          barangay: '',
          // Google-specific data
          provider: 'google',
          googleId: user.uid,
          profileImage: user.photoURL || null
        });
        console.log('✅ Google user data saved to Firestore');
      } catch (firestoreError) {
        console.warn('⚠️ Firestore write failed, but user is signed in:', firestoreError);
      }
      
      // Navigate to user events page
      navigate('/UserEvents');
      
    } catch (error) {
      console.error('❌ Google sign-in failed:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        alert('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Popup blocked. Please allow popups for this site and try again.');
      } else {
        alert('Google sign-in failed: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrorMessage('');
    
    // Enhanced validation
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!validateGmail(email)) {
      setErrorMessage('Please use a Gmail address (@gmail.com) to register');
      return;
    }
    
    if (!validateAge(age)) {
      setErrorMessage('Age must be between 15 - 30 years old');
      return;
    }
    
    if (phone && !validatePhone(phone)) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    
    if (!agreeToTerms) {
      setErrorMessage('You must agree to the Terms and Conditions');
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

      // Send email verification
      try {
        await sendEmailVerification(user);
        console.log('✅ Email verification sent to:', email);
        setEmailVerificationSent(true);
      } catch (verificationError) {
        console.warn('⚠️ Email verification failed:', verificationError);
        // Continue with registration even if verification fails
      }
      
      console.log('User created in Firebase Auth:', user.uid);
      
      // Try to save additional user data to Firestore
      try {
        await ensureUserData(user, {
          username: username,
          displayName: displayName,
          age: parseInt(age),
          email: email,
          phone: phone,
          sitio: sitio,
          barangay: barangay,
          emailVerified: false // Mark as unverified initially
        });
        console.log('User data saved to Firestore successfully');
      } catch (firestoreError) {
        console.warn('Firestore write failed, but user is created in Auth:', firestoreError);
        // Don't throw error here - user is already created in Firebase Auth
        // We'll try to save the data later or handle it gracefully
      }
      
      console.log('User created successfully:', user.uid);
      
      if (emailVerificationSent) {
        alert('✅ Account created! Please check your Gmail and verify your email address to complete registration.');
      } else {
        alert('✅ Account created! You can now sign in.');
      }
      
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
            <button type="button" className="social-button google" onClick={handleGoogleSignIn}>
              <img src={GoogleLogo} alt="Google" />
              <span>Sign up with Google</span>
            </button>
          </div>
          <p className="login-instruction">or use your email for registration</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Username (for login)" 
                required 
              />
              <small className="field-hint">This will be your login username</small>
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                placeholder="Full Name (as shown to others)" 
                required 
              />
              <small className="field-hint">This is how your name appears to other users</small>
            </div>
            
            <div className="form-group">
              <input 
                type="number" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
                placeholder="Age" 
                min="13" 
                max="100" 
                required 
              />
              <small className="field-hint">Must be 15-30 years old</small>
            </div>
            
            <div className="form-group">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Gmail Address (e.g., yourname@gmail.com)" 
                required 
              />
              <small className="gmail-note">📧 Gmail address required for registration</small>
              <small className="field-hint">We'll use this to contact you</small>
            </div>
            
            <div className="form-group">
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Phone Number (optional)" 
              />
              <small className="field-hint">Optional: For emergency contact</small>
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                value={sitio} 
                onChange={(e) => setSitio(e.target.value)} 
                placeholder="Sitio (optional)" 
              />
              <small className="field-hint">Optional: Your sitio/neighborhood</small>
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                value={barangay} 
                onChange={(e) => setBarangay(e.target.value)} 
                placeholder="Barangay (optional)" 
              />
              <small className="field-hint">Optional: Your barangay</small>
            </div>
            
            <div className="form-group">
              <input 
                type="password" 
                value={password} 
                onChange={handlePasswordChange} 
                placeholder="Password" 
                required 
              />
              {password && (
                <div className={`password-strength ${passwordStrength}`}>
                  Password Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirm Password" 
                required 
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={agreeToTerms} 
                  onChange={(e) => setAgreeToTerms(e.target.checked)} 
                  required 
                />
                <span className="checkbox-text">
                  I agree to the <a href="/terms" target="_blank">Terms and Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
                </span>
              </label>
            </div>
            
            <button type="submit" className="auth-button">Create Account</button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignUp; 