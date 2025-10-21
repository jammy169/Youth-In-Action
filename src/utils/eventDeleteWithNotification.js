// eventDeleteWithNotification.js
// Delete event but update registrations to "cancelled" and notify users

import { doc, deleteDoc, collection, query, where, getDocs, writeBatch, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { sendEventCancellationEmail } from './gmailEmailService';

/**
 * Delete event and update all registrations to "cancelled"
 * This is the best approach for user experience
 */
export const deleteEventWithNotification = async (eventId, eventTitle) => {
  try {
    console.log('🗑️ Deleting event with user notification:', eventId);
    
    // Get all registrations for this event
    const registrationsRef = collection(db, 'registrations');
    const q = query(registrationsRef, where('eventId', '==', eventId));
    const registrationsSnapshot = await getDocs(q);
    
    console.log(`📊 Found ${registrationsSnapshot.size} registrations to update`);
    
    // Use batch to update registrations and delete event
    const batch = writeBatch(db);
    
    // Update all registrations to "cancelled"
    registrationsSnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancellationReason: 'Event cancelled by admin'
      });
    });
    
    // Delete the event
    const eventRef = doc(db, 'events', eventId);
    batch.delete(eventRef);
    
    // Commit all changes
    await batch.commit();
    
    // Send cancellation emails to all registered users
    console.log('📧 Sending cancellation emails...');
    for (const registrationDoc of registrationsSnapshot.docs) {
      const registration = registrationDoc.data();
      try {
        await sendEventCancellationEmail(registration, eventTitle);
        console.log('✅ Cancellation email sent to:', registration.email);
      } catch (emailError) {
        console.error('❌ Failed to send email to:', registration.email, emailError);
      }
    }
    
    console.log('✅ Event deleted and users notified successfully');
    return { 
      success: true, 
      message: `Event deleted and ${registrationsSnapshot.size} users notified` 
    };
  } catch (error) {
    console.error('❌ Error deleting event with notification:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send cancellation email to user
 */
export const sendEventCancellationEmail = async (registration, eventTitle) => {
  try {
    const subject = `Event Cancelled - ${eventTitle}`;
    const message = `
Hello ${registration.firstName}!

We regret to inform you that the following event has been cancelled:

Event: ${eventTitle}
Your Registration Status: Cancelled

We apologize for any inconvenience this may cause. 

If you have any questions, please contact us at info@youthinaction.com

Best regards,
YouthInAction Team
    `;
    
    // Use your existing email service
    return await sendGmailEmail(registration.email, subject, message);
  } catch (error) {
    console.error('❌ Error sending cancellation email:', error);
    return { success: false, message: error.message };
  }
};
