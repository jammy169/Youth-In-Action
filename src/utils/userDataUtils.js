// userDataUtils.js
// Utility functions for managing user data in Firestore

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Save or update user data in Firestore
 * @param {string} userId - Firebase Auth user ID
 * @param {Object} userData - User data to save
 * @returns {Promise<boolean>} - Success status
 */
export const saveUserData = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('User data saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

/**
 * Get user data from Firestore
 * @param {string} userId - Firebase Auth user ID
 * @returns {Promise<Object|null>} - User data or null if not found
 */
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Ensure user data exists in Firestore
 * Creates user data if it doesn't exist
 * @param {Object} user - Firebase Auth user object
 * @param {Object} additionalData - Additional user data
 * @returns {Promise<Object>} - User data
 */
export const ensureUserData = async (user, additionalData = {}) => {
  try {
    // Try to get existing user data
    let userData = await getUserData(user.uid);
    
    if (!userData) {
      // Create user data if it doesn't exist
      const newUserData = {
        username: user.displayName || user.email.split('@')[0],
        displayName: user.displayName || user.email.split('@')[0],
        email: user.email,
        createdAt: new Date().toISOString(),
        totalServiceHours: 0,
        ...additionalData
      };
      
      const saved = await saveUserData(user.uid, newUserData);
      if (saved) {
        userData = newUserData;
      }
    }
    
    return userData;
  } catch (error) {
    console.error('Error ensuring user data:', error);
    return null;
  }
};

/**
 * Update user service hours
 * @param {string} userId - Firebase Auth user ID
 * @param {number} hours - Hours to add
 * @returns {Promise<boolean>} - Success status
 */
export const updateServiceHours = async (userId, hours) => {
  try {
    const userData = await getUserData(userId);
    if (userData) {
      const newTotal = (userData.totalServiceHours || 0) + hours;
      await saveUserData(userId, { totalServiceHours: newTotal });
      console.log(`Updated user ${userId} total service hours: ${userData.totalServiceHours || 0} + ${hours} = ${newTotal}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating service hours:', error);
    return false;
  }
};

/**
 * Recalculate user service hours from all attended registrations
 * @param {string} userId - Firebase Auth user ID
 * @param {Array} registrations - Array of user's registrations
 * @returns {Promise<boolean>} - Success status
 */
export const recalculateUserServiceHours = async (userId, registrations) => {
  try {
    const totalHours = registrations
      .filter(reg => reg.status === 'attended')
      .reduce((total, reg) => total + (reg.serviceHours || 0), 0);
    
    await saveUserData(userId, { totalServiceHours: totalHours });
    console.log(`Recalculated user ${userId} total service hours: ${totalHours}`);
    return true;
  } catch (error) {
    console.error('Error recalculating service hours:', error);
    return false;
  }
};
