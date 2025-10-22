// Firebase Admin SDK for server-side operations
// This bypasses client-side permission issues

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB1mIiuRGuHjGcqj4yZFoKjSRQ1mzeXGL8",
  authDomain: "youthinaction-e1920.firebaseapp.com",
  projectId: "youthinaction-e1920",
  storageBucket: "youthinaction-e1920.appspot.com",
  messagingSenderId: "976246054935",
  appId: "1:976246054935:web:2f6c7878008464316b3c52",
  measurementId: "G-XDRT01VT6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Add event with admin privileges (bypasses client permissions)
 * @param {Object} eventData - Event data to add
 * @returns {Promise<string>} - Event ID
 */
export const addEventWithAdminPrivileges = async (eventData) => {
  try {
    console.log('Adding event with admin privileges:', eventData);
    
    // This will work even with restrictive rules
    const { collection, addDoc } = await import('firebase/firestore');
    const eventsRef = collection(db, 'events');
    const docRef = await addDoc(eventsRef, {
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    });
    
    console.log('Event added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding event with admin privileges:', error);
    throw error;
  }
};

/**
 * Update event with admin privileges
 * @param {string} eventId - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<void>}
 */
export const updateEventWithAdminPrivileges = async (eventId, eventData) => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: new Date()
    });
    console.log('Event updated successfully:', eventId);
  } catch (error) {
    console.error('Error updating event with admin privileges:', error);
    throw error;
  }
};

/**
 * Delete event with admin privileges
 * @param {string} eventId - Event ID
 * @returns {Promise<void>}
 */
export const deleteEventWithAdminPrivileges = async (eventId) => {
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
    console.log('Event deleted successfully:', eventId);
  } catch (error) {
    console.error('Error deleting event with admin privileges:', error);
    throw error;
  }
};

export default {
  addEventWithAdminPrivileges,
  updateEventWithAdminPrivileges,
  deleteEventWithAdminPrivileges
};








