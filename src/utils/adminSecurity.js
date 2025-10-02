// Admin Security Middleware
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { isAdmin } from './adminAuth';

/**
 * Security configuration for admin access
 */
export const ADMIN_SECURITY_CONFIG = {
  // Session timeout (in milliseconds) - 2 hours
  SESSION_TIMEOUT: 2 * 60 * 60 * 1000,
  
  // Maximum login attempts before lockout
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Lockout duration (in milliseconds) - 15 minutes
  LOCKOUT_DURATION: 15 * 60 * 1000,
  
  // Required admin permissions
  REQUIRED_PERMISSIONS: [
    'admin.dashboard.view',
    'admin.events.manage',
    'admin.users.manage',
    'admin.registrations.view',
    'admin.feedback.view'
  ]
};

/**
 * Track login attempts for security
 */
const loginAttempts = new Map();

/**
 * Track admin sessions
 */
const adminSessions = new Map();

/**
 * Check if user is locked out due to failed attempts
 * @param {string} email - User email
 * @returns {boolean} - True if user is locked out
 */
export const isUserLockedOut = (email) => {
  const attempts = loginAttempts.get(email);
  if (!attempts) return false;
  
  const { count, lastAttempt } = attempts;
  const timeSinceLastAttempt = Date.now() - lastAttempt;
  
  // Reset attempts if lockout period has passed
  if (timeSinceLastAttempt > ADMIN_SECURITY_CONFIG.LOCKOUT_DURATION) {
    loginAttempts.delete(email);
    return false;
  }
  
  // Check if user exceeded max attempts
  return count >= ADMIN_SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
};

/**
 * Record a failed login attempt
 * @param {string} email - User email
 */
export const recordFailedAttempt = (email) => {
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  attempts.count += 1;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(email, attempts);
  
  console.log(`🚨 Failed login attempt for ${email}. Attempts: ${attempts.count}`);
};

/**
 * Clear failed attempts for successful login
 * @param {string} email - User email
 */
export const clearFailedAttempts = (email) => {
  loginAttempts.delete(email);
  console.log(`✅ Cleared failed attempts for ${email}`);
};

/**
 * Start admin session tracking
 * @param {Object} user - Firebase user object
 */
export const startAdminSession = (user) => {
  const sessionId = `admin_${user.uid}_${Date.now()}`;
  adminSessions.set(sessionId, {
    userId: user.uid,
    email: user.email,
    startTime: Date.now(),
    lastActivity: Date.now(),
    isActive: true
  });
  
  console.log(`🔐 Admin session started for ${user.email}`);
  return sessionId;
};

/**
 * Update admin session activity
 * @param {string} sessionId - Session ID
 */
export const updateSessionActivity = (sessionId) => {
  const session = adminSessions.get(sessionId);
  if (session) {
    session.lastActivity = Date.now();
    adminSessions.set(sessionId, session);
  }
};

/**
 * End admin session
 * @param {string} sessionId - Session ID
 */
export const endAdminSession = (sessionId) => {
  const session = adminSessions.get(sessionId);
  if (session) {
    session.isActive = false;
    adminSessions.set(sessionId, session);
    console.log(`🔓 Admin session ended for ${session.email}`);
  }
};

/**
 * Check if admin session is valid
 * @param {string} sessionId - Session ID
 * @returns {boolean} - True if session is valid
 */
export const isSessionValid = (sessionId) => {
  const session = adminSessions.get(sessionId);
  if (!session || !session.isActive) return false;
  
  const timeSinceLastActivity = Date.now() - session.lastActivity;
  return timeSinceLastActivity < ADMIN_SECURITY_CONFIG.SESSION_TIMEOUT;
};

/**
 * Get all active admin sessions
 * @returns {Array} - Array of active sessions
 */
export const getActiveSessions = () => {
  return Array.from(adminSessions.values()).filter(session => session.isActive);
};

/**
 * Security middleware for admin routes
 * @param {Function} callback - Callback function
 * @returns {Function} - Middleware function
 */
export const adminSecurityMiddleware = (callback) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.log('🚫 Security: No authenticated user');
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      // Check if user is admin
      if (!isAdmin(user)) {
        console.log('🚫 Security: User is not admin');
        return res.status(403).json({ error: 'Admin privileges required' });
      }
      
      // Check if user is locked out
      if (isUserLockedOut(user.email)) {
        console.log('🚫 Security: User is locked out');
        return res.status(423).json({ error: 'Account temporarily locked due to failed attempts' });
      }
      
      // Proceed with callback
      return callback(req, res, next);
    } catch (error) {
      console.error('🚨 Security middleware error:', error);
      return res.status(500).json({ error: 'Security check failed' });
    }
  };
};

/**
 * Log admin security events
 * @param {string} event - Security event
 * @param {Object} details - Event details
 */
export const logSecurityEvent = (event, details = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    details,
    severity: event.includes('failed') || event.includes('lockout') ? 'HIGH' : 'INFO'
  };
  
  console.log(`🔒 Security Event [${logEntry.severity}]:`, logEntry);
  
  // In production, you would send this to a security monitoring service
  // Example: sendToSecurityService(logEntry);
};

/**
 * Clean up expired sessions and attempts
 */
export const cleanupSecurityData = () => {
  const now = Date.now();
  
  // Clean up expired login attempts
  for (const [email, attempts] of loginAttempts.entries()) {
    const timeSinceLastAttempt = now - attempts.lastAttempt;
    if (timeSinceLastAttempt > ADMIN_SECURITY_CONFIG.LOCKOUT_DURATION) {
      loginAttempts.delete(email);
    }
  }
  
  // Clean up expired sessions
  for (const [sessionId, session] of adminSessions.entries()) {
    const timeSinceLastActivity = now - session.lastActivity;
    if (timeSinceLastActivity > ADMIN_SECURITY_CONFIG.SESSION_TIMEOUT) {
      adminSessions.delete(sessionId);
    }
  }
  
  console.log('🧹 Security data cleanup completed');
};

// Run cleanup every 5 minutes
setInterval(cleanupSecurityData, 5 * 60 * 1000);

export default {
  ADMIN_SECURITY_CONFIG,
  isUserLockedOut,
  recordFailedAttempt,
  clearFailedAttempts,
  startAdminSession,
  updateSessionActivity,
  endAdminSession,
  isSessionValid,
  getActiveSessions,
  adminSecurityMiddleware,
  logSecurityEvent,
  cleanupSecurityData
};
