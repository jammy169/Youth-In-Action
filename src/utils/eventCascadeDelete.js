// eventCascadeDelete.js
// Cascade delete events and all related registrations

import { doc, deleteDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Cascade delete an event and all its registrations
 * WARNING: This permanently deletes all data!
 */
export const cascadeDeleteEvent = async (eventId) => {
  try {
    console.log('🗑️ Cascade deleting event and registrations:', eventId);
    
    // Get all registrations for this event
    const registrationsRef = collection(db, 'registrations');
    const q = query(registrationsRef, where('eventId', '==', eventId));
    const registrationsSnapshot = await getDocs(q);
    
    console.log(`📊 Found ${registrationsSnapshot.size} registrations to delete`);
    
    // Use batch to delete everything atomically
    const batch = writeBatch(db);
    
    // Delete all registrations
    registrationsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
      console.log('🗑️ Marking registration for deletion:', doc.id);
    });
    
    // Delete the event
    const eventRef = doc(db, 'events', eventId);
    batch.delete(eventRef);
    
    // Commit all deletions
    await batch.commit();
    
    console.log('✅ Event and all registrations deleted successfully');
    return { 
      success: true, 
      message: `Event and ${registrationsSnapshot.size} registrations deleted successfully` 
    };
  } catch (error) {
    console.error('❌ Error cascade deleting event:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Get registrations count before deletion (for confirmation)
 */
export const getEventRegistrationsCount = async (eventId) => {
  try {
    const registrationsRef = collection(db, 'registrations');
    const q = query(registrationsRef, where('eventId', '==', eventId));
    const snapshot = await getDocs(q);
    
    return {
      success: true,
      count: snapshot.size,
      registrations: snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    };
  } catch (error) {
    console.error('❌ Error getting registrations count:', error);
    return { success: false, message: error.message };
  }
};
