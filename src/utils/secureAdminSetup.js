// Secure Admin Setup Utility
// This file contains instructions and utilities for secure admin account creation

/**
 * SECURE ADMIN ACCOUNT CREATION METHODS
 * 
 * Choose ONE of these methods to create admin accounts securely:
 */

// ========================================
// METHOD 1: FIREBASE CONSOLE (RECOMMENDED)
// ========================================
/*
STEPS:
1. Go to Firebase Console → Authentication → Users
2. Click "Add User"
3. Enter admin email and password
4. Click "Add User"
5. The user will be created and can sign in through /admin-signin

ADVANTAGES:
- No code changes needed
- Completely secure
- Full Firebase control
- Easy to manage multiple admins
*/

// ========================================
// METHOD 2: FIREBASE CLI (DEVELOPER)
// ========================================
/*
STEPS:
1. Install Firebase CLI: npm install -g firebase-tools
2. Login: firebase login
3. Run this command:
   firebase auth:import users.json --project your-project-id

users.json format:
[
  {
    "localId": "admin1",
    "email": "admin@youthinaction.com",
    "passwordHash": "hashed_password_here",
    "emailVerified": true
  }
]

ADVANTAGES:
- Programmatic creation
- Can be automated
- Good for multiple admins
*/

// ========================================
// METHOD 3: ENVIRONMENT VARIABLES (SIMPLE)
// ========================================
/*
STEPS:
1. Create .env file in project root
2. Add: REACT_APP_ADMIN_EMAILS=admin1@example.com,admin2@example.com
3. Update adminAuth.js to read from environment

ADVANTAGES:
- Simple to implement
- No database changes
- Easy to manage
*/

// ========================================
// METHOD 4: DATABASE-BASED ADMIN LIST
// ========================================
/*
STEPS:
1. Create 'admins' collection in Firestore
2. Add admin documents with email field
3. Update adminAuth.js to check database

ADVANTAGES:
- Dynamic admin management
- Can add/remove admins without code changes
- Audit trail possible
*/

/**
 * CURRENT ADMIN EMAILS (UPDATE THESE)
 * Add your admin emails here after creating them in Firebase Console
 */
export const SECURE_ADMIN_EMAILS = [
  // Add your admin emails here
  'admin@youthinaction.com',
  'jamestellore@gmail.com', // Your Gmail account
  // Add more as needed
];

/**
 * Check if email is in secure admin list
 * @param {string} email - Email to check
 * @returns {boolean} - True if email is admin
 */
export const isSecureAdmin = (email) => {
  if (!email) return false;
  
  // Check against secure admin list
  return SECURE_ADMIN_EMAILS.includes(email.toLowerCase());
};

/**
 * Get list of secure admin emails
 * @returns {Array} - List of admin emails
 */
export const getSecureAdminEmails = () => {
  return [...SECURE_ADMIN_EMAILS];
};

/**
 * Add new admin email to secure list (for development only)
 * @param {string} email - New admin email
 * @returns {boolean} - True if added successfully
 */
export const addSecureAdmin = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const normalizedEmail = email.toLowerCase();
  
  if (!SECURE_ADMIN_EMAILS.includes(normalizedEmail)) {
    SECURE_ADMIN_EMAILS.push(normalizedEmail);
    console.log(`✅ Admin email added: ${normalizedEmail}`);
    return true;
  }
  
  console.log(`⚠️ Admin email already exists: ${normalizedEmail}`);
  return false;
};

/**
 * Remove admin email from secure list
 * @param {string} email - Admin email to remove
 * @returns {boolean} - True if removed successfully
 */
export const removeSecureAdmin = (email) => {
  if (!email) return false;
  
  const normalizedEmail = email.toLowerCase();
  const index = SECURE_ADMIN_EMAILS.indexOf(normalizedEmail);
  
  if (index > -1) {
    SECURE_ADMIN_EMAILS.splice(index, 1);
    console.log(`✅ Admin email removed: ${normalizedEmail}`);
    return true;
  }
  
  console.log(`⚠️ Admin email not found: ${normalizedEmail}`);
  return false;
};

export default {
  SECURE_ADMIN_EMAILS,
  isSecureAdmin,
  getSecureAdminEmails,
  addSecureAdmin,
  removeSecureAdmin
};


