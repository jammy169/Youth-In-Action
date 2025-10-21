// syncAuthWithFirestore.js
// Utility to sync Firebase Authentication users with Firestore users collection

import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

/**
 * Get all users from Firebase Authentication
 * Note: This requires Firebase Admin SDK in a backend environment
 * For frontend, we'll work with what we can access
 */
export const getAuthUsers = async () => {
  try {
    console.log('🔍 Getting authentication users...');
    
    // Note: In frontend, we can't directly list all auth users
    // This would require Firebase Admin SDK on backend
    // For now, we'll work with the current user
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      console.log('Current authenticated user:', currentUser.email);
      return [currentUser];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting auth users:', error);
    return [];
  }
};

/**
 * Get all users from Firestore users collection
 */
export const getFirestoreUsers = async () => {
  try {
    console.log('🔍 Getting Firestore users...');
    
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${users.length} users in Firestore`);
    return users;
  } catch (error) {
    console.error('Error getting Firestore users:', error);
    return [];
  }
};

/**
 * Compare Auth users with Firestore users
 */
export const compareAuthWithFirestore = async () => {
  try {
    console.log('🔄 Comparing Auth users with Firestore users...');
    
    const authUsers = await getAuthUsers();
    const firestoreUsers = await getFirestoreUsers();
    
    const comparison = {
      authUsers: authUsers.length,
      firestoreUsers: firestoreUsers.length,
      authEmails: authUsers.map(user => user.email),
      firestoreEmails: firestoreUsers.map(user => user.email),
      missingInFirestore: [],
      missingInAuth: [],
      mismatchedEmails: []
    };
    
    // Find users in Auth but not in Firestore
    authUsers.forEach(authUser => {
      const existsInFirestore = firestoreUsers.some(
        fsUser => fsUser.email === authUser.email || fsUser.id === authUser.uid
      );
      if (!existsInFirestore) {
        comparison.missingInFirestore.push(authUser.email);
      }
    });
    
    // Find users in Firestore but not in Auth
    firestoreUsers.forEach(fsUser => {
      const existsInAuth = authUsers.some(
        authUser => authUser.email === fsUser.email || authUser.uid === fsUser.id
      );
      if (!existsInAuth) {
        comparison.missingInAuth.push(fsUser.email);
      }
    });
    
    console.log('📊 Comparison results:', comparison);
    return comparison;
    
  } catch (error) {
    console.error('Error comparing users:', error);
    return null;
  }
};

/**
 * Create missing Firestore documents for Auth users
 */
export const createMissingFirestoreUsers = async (authUsers) => {
  try {
    console.log('🔧 Creating missing Firestore users...');
    
    const results = [];
    
    for (const authUser of authUsers) {
      try {
        // Check if user already exists in Firestore
        const userDocRef = doc(db, 'users', authUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          // Create user document in Firestore
          await setDoc(userDocRef, {
            email: authUser.email,
            displayName: authUser.displayName || authUser.email.split('@')[0],
            createdAt: new Date().toISOString(),
            lastSignIn: authUser.metadata?.lastSignInTime || new Date().toISOString(),
            emailVerified: authUser.emailVerified || false,
            uid: authUser.uid
          });
          
          console.log(`✅ Created Firestore user for: ${authUser.email}`);
          results.push({ email: authUser.email, status: 'created' });
        } else {
          console.log(`⚠️ User already exists in Firestore: ${authUser.email}`);
          results.push({ email: authUser.email, status: 'exists' });
        }
      } catch (error) {
        console.error(`❌ Error creating user ${authUser.email}:`, error);
        results.push({ email: authUser.email, status: 'error', error: error.message });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error creating missing users:', error);
    return [];
  }
};

/**
 * Clean up orphaned Firestore users (users not in Auth)
 */
export const cleanupOrphanedFirestoreUsers = async (authUsers) => {
  try {
    console.log('🧹 Cleaning up orphaned Firestore users...');
    
    const firestoreUsers = await getFirestoreUsers();
    const authEmails = authUsers.map(user => user.email);
    const authUids = authUsers.map(user => user.uid);
    
    const results = [];
    
    for (const fsUser of firestoreUsers) {
      const existsInAuth = authEmails.includes(fsUser.email) || authUids.includes(fsUser.id);
      
      if (!existsInAuth) {
        try {
          await deleteDoc(doc(db, 'users', fsUser.id));
          console.log(`🗑️ Deleted orphaned user: ${fsUser.email}`);
          results.push({ email: fsUser.email, status: 'deleted' });
        } catch (error) {
          console.error(`❌ Error deleting user ${fsUser.email}:`, error);
          results.push({ email: fsUser.email, status: 'error', error: error.message });
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error cleaning up users:', error);
    return [];
  }
};

/**
 * Full sync process
 */
export const syncAuthWithFirestore = async () => {
  try {
    console.log('🚀 Starting full sync process...');
    
    // Step 1: Compare users
    const comparison = await compareAuthWithFirestore();
    if (!comparison) {
      throw new Error('Failed to compare users');
    }
    
    console.log('📊 Sync Summary:');
    console.log(`- Auth users: ${comparison.authUsers}`);
    console.log(`- Firestore users: ${comparison.firestoreUsers}`);
    console.log(`- Missing in Firestore: ${comparison.missingInFirestore.length}`);
    console.log(`- Missing in Auth: ${comparison.missingInAuth.length}`);
    
    // Step 2: Create missing Firestore users
    const authUsers = await getAuthUsers();
    const createResults = await createMissingFirestoreUsers(authUsers);
    
    // Step 3: Clean up orphaned users (optional)
    // const cleanupResults = await cleanupOrphanedFirestoreUsers(authUsers);
    
    return {
      success: true,
      comparison,
      createResults,
      message: 'Sync completed successfully!'
    };
    
  } catch (error) {
    console.error('❌ Sync failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Sync failed!'
    };
  }
};
