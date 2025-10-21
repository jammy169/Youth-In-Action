// createAdminAccount.js
// Utility to create admin account programmatically
// USE ONLY FOR DEVELOPMENT - NOT FOR PRODUCTION

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Create admin account programmatically
 * WARNING: This is for development only!
 */
export const createAdminAccount = async () => {
  const auth = getAuth();
  
  try {
    console.log('🔐 Creating admin account...');
    
    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@youthinaction.com', 
      'YouthAdmin2025!'
    );
    
    const user = userCredential.user;
    console.log('✅ Admin account created:', user.email);
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
      isAdmin: true
    });
    
    console.log('✅ Admin user document created in Firestore');
    
    // Sign out after creation
    await auth.signOut();
    console.log('✅ Admin account setup complete!');
    
    return {
      success: true,
      message: 'Admin account created successfully!',
      email: user.email
    };
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      return {
        success: false,
        message: 'Admin account already exists. You can try signing in.',
        error: error.code
      };
    }
    
    return {
      success: false,
      message: `Error creating admin account: ${error.message}`,
      error: error.code
    };
  }
};

/**
 * Test admin account login
 */
export const testAdminLogin = async () => {
  const auth = getAuth();
  
  try {
    console.log('🔐 Testing admin login...');
    
    const userCredential = await signInWithEmailAndPassword(
      auth,
      'admin@youthinaction.com',
      'YouthAdmin2025!'
    );
    
    console.log('✅ Admin login successful:', userCredential.user.email);
    
    // Sign out after test
    await auth.signOut();
    
    return {
      success: true,
      message: 'Admin login test successful!'
    };
    
  } catch (error) {
    console.error('❌ Admin login test failed:', error);
    return {
      success: false,
      message: `Login test failed: ${error.message}`,
      error: error.code
    };
  }
};

/**
 * Complete admin setup process
 */
export const setupAdminAccount = async () => {
  console.log('🚀 Starting complete admin setup...');
  
  // Step 1: Create account
  const createResult = await createAdminAccount();
  console.log('Step 1 - Create Account:', createResult);
  
  if (!createResult.success && createResult.error !== 'auth/email-already-in-use') {
    return createResult;
  }
  
  // Step 2: Test login
  const loginResult = await testAdminLogin();
  console.log('Step 2 - Test Login:', loginResult);
  
  return {
    success: createResult.success && loginResult.success,
    message: createResult.success ? 
      'Admin account created and tested successfully!' : 
      'Admin account already exists and login works!',
    details: {
      create: createResult,
      login: loginResult
    }
  };
};
