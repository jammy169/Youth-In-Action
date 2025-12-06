// eventSoftDelete.js
// Soft delete events instead of hard delete to preserve registrations

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Soft delete an event (mark as cancelled instead of deleting)
 * This preserves registrations and notifies users properly
 */
export const softDeleteEvent = async (eventId) => {
  try {
    console.log('🔄 Soft deleting event:', eventId);
    
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      status: 'cancelled',
      deletedAt: new Date().toISOString(),
      deletedBy: 'admin', // You can get this from auth
      reason: 'Event cancelled by admin'
    });
    
    console.log('✅ Event soft deleted successfully');
    return { success: true, message: 'Event cancelled successfully' };
  } catch (error) {
    console.error('❌ Error soft deleting event:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Restore a soft-deleted event
 */
export const restoreEvent = async (eventId) => {
  try {
    console.log('🔄 Restoring event:', eventId);
    
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      status: 'active',
      deletedAt: null,
      deletedBy: null,
      reason: null
    });
    
    console.log('✅ Event restored successfully');
    return { success: true, message: 'Event restored successfully' };
  } catch (error) {
    console.error('❌ Error restoring event:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Get event status for display
 */
export const getEventStatus = (event) => {
  if (event.status === 'cancelled') {
    return {
      status: 'cancelled',
      message: 'This event has been cancelled',
      canRegister: false,
      showCancelled: true
    };
  }
  
  if (event.status === 'completed') {
    return {
      status: 'completed',
      message: 'This event has ended',
      canRegister: false,
      showCompleted: true
    };
  }
  
  // Regular status logic here...
  return {
    status: 'active',
    message: 'Event is active',
    canRegister: true
  };
};






