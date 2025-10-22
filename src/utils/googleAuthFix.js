// googleAuthFix.js
// Temporary fix for Google authentication domain issues

import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

/**
 * Enhanced Google sign-in with better error handling
 */
export const handleGoogleSignIn = async () => {
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    
    // Set additional scopes
    provider.addScope('email');
    provider.addScope('profile');
    
    console.log('🔐 Starting Google sign-in...');
    
    // Try to sign in
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log('✅ Google sign-in successful:', user.email);
    return { success: true, user };
    
  } catch (error) {
    console.error('❌ Google sign-in failed:', error);
    
    // Handle specific error types
    if (error.code === 'auth/unauthorized-domain') {
      return {
        success: false,
        error: 'Domain not authorized. Please contact admin to add this domain to Firebase.',
        code: error.code
      };
    } else if (error.code === 'auth/popup-closed-by-user') {
      return {
        success: false,
        error: 'Sign-in cancelled. Please try again.',
        code: error.code
      };
    } else if (error.code === 'auth/popup-blocked') {
      return {
        success: false,
        error: 'Popup blocked. Please allow popups for this site and try again.',
        code: error.code
      };
    } else {
      return {
        success: false,
        error: `Google sign-in failed: ${error.message}`,
        code: error.code
      };
    }
  }
};

/**
 * Check if domain is authorized (client-side check)
 */
export const checkDomainAuthorization = () => {
  const currentDomain = window.location.hostname;
  const authorizedDomains = [
    'localhost',
    'youth-in-action.vercel.app',
    'youth-in-action-git-main-jamfloydestellore-1838s-projects.vercel.app',
    'youth-in-action-lhprtdzqd-jamfloydestellore-1838s-projects.vercel.app'
  ];
  
  const isAuthorized = authorizedDomains.includes(currentDomain);
  
  console.log('🌐 Current domain:', currentDomain);
  console.log('✅ Domain authorized:', isAuthorized);
  
  return {
    domain: currentDomain,
    authorized: isAuthorized,
    message: isAuthorized ? 
      'Domain is authorized' : 
      'Domain needs to be added to Firebase Console'
  };
};



