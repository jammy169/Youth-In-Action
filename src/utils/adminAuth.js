// Admin Authentication Utility
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { SECURE_ADMIN_EMAILS, isSecureAdmin } from './secureAdminSetup';

// Admin email addresses - now managed securely
const ADMIN_EMAILS = SECURE_ADMIN_EMAILS;

/**
 * Check if the current user is an admin
 * @param {Object} user - Firebase user object
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = (user) => {
  if (!user || !user.email) return false;
  
  // Use secure admin check
  return isSecureAdmin(user.email);
};

/**
 * Get current authenticated user
 * @returns {Object|null} - Current user or null
 */
export const getCurrentUser = () => {
  const auth = getAuth();
  return auth.currentUser;
};

/**
 * Check if user is authenticated and is admin
 * @returns {boolean} - True if user is authenticated admin
 */
export const isAuthenticatedAdmin = () => {
  const user = getCurrentUser();
  return user && isAdmin(user);
};

/**
 * Sign in as admin
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<Object>} - User object if successful
 */
export const signInAsAdmin = async (email, password) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (!isAdmin(user)) {
      await signOut(auth);
      throw new Error('Access denied. Admin privileges required.');
    }
    
    console.log('Admin signed in successfully:', user.email);
    return user;
  } catch (error) {
    console.error('Admin sign-in error:', error);
    throw error;
  }
};

/**
 * Sign out admin
 * @returns {Promise<void>}
 */
export const signOutAdmin = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    console.log('Admin signed out successfully');
  } catch (error) {
    console.error('Admin sign-out error:', error);
    throw error;
  }
};

/**
 * Listen for authentication state changes
 * @param {Function} callback - Callback function
 * @returns {Function} - Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  const auth = getAuth();
  return onAuthStateChanged(auth, (user) => {
    const isAdminUser = user ? isAdmin(user) : false;
    callback(user, isAdminUser);
  });
};

/**
 * Check if admin authentication is required
 * @returns {boolean} - True if admin auth is required
 */
export const requireAdminAuth = () => {
  const user = getCurrentUser();
  const isAdminUser = isAdmin(user);
  
  if (!isAdminUser) {
    console.log('Admin authentication required');
    return false;
  }
  
  return true;
};

/**
 * SECURITY NOTICE: Admin account creation is disabled for security
 * Use Firebase Console or secure methods to create admin accounts
 * See secureAdminSetup.js for proper admin creation methods
 */
export const createAdminUser = async (email, password) => {
  throw new Error('Admin account creation is disabled for security. Please contact system administrator.');
};

export default {
  isAdmin,
  getCurrentUser,
  isAuthenticatedAdmin,
  signInAsAdmin,
  signOutAdmin,
  onAuthStateChange,
  requireAdminAuth,
  createAdminUser,
  ADMIN_EMAILS
};
