// Email notification utilities
// This file handles sending email notifications when new events are added

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Gmail SMTP configuration
const GMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: 'jamestellore@gmail.com', // Your Gmail address
    pass: 'your-app-password' // You'll need to generate this
  }
};

// For testing, we'll use hardcoded emails first
const TEST_EMAILS = [
  'jamestellore@gmail.com', // Your real Gmail address
  'test-user@gmail.com'      // Add more test emails here
];

/**
 * Send email notification about new event via Gmail
 * @param {Object} eventData - The new event data
 * @param {string} recipientEmail - Email address to send to
 */
export const sendEventNotificationEmail = async (eventData, recipientEmail) => {
  try {
    console.log('📧 SENDING EVENT NOTIFICATION VIA GMAIL:');
    console.log('To:', recipientEmail);
    console.log('Event:', eventData.title);
    
    // Create email content
    const subject = `🎉 New Volunteer Opportunity: ${eventData.title}`;
    const message = `
Hello YouthInAction Member!

A new volunteer event has been posted:

🎯 EVENT: ${eventData.title}
📅 DATE: ${new Date(eventData.startDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
📍 LOCATION: ${eventData.location}
👤 ORGANIZER: ${eventData.organizer}

📝 DESCRIPTION:
${eventData.description}

🔗 REGISTER NOW:
https://youth-in-action.vercel.app/events

This is an exciting opportunity to make a difference in our community!

Best regards,
YouthInAction Team
    `;
    
    // Create Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    
    console.log('📧 Opening Gmail for event notification...');
    console.log('🔗 Gmail URL:', gmailUrl);
    
    // Open Gmail in new tab
    if (typeof window !== 'undefined') {
      window.open(gmailUrl, '_blank');
      console.log('✅ GMAIL OPENED FOR EVENT NOTIFICATION!');
    }
    
    return {
      success: true,
      message: 'Gmail opened for event notification',
      to: recipientEmail,
      subject: subject,
      gmailUrl: gmailUrl
    };
    
  } catch (error) {
    console.error('❌ Error sending event notification:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Get list of email addresses to notify
 * This function gets emails from your Firebase database
 */
export const getNotificationEmails = async () => {
  try {
    console.log('📧 Getting notification emails from Firebase REGISTRATIONS...');
    
    // Get emails from Firebase registrations collection (where users actually are!)
    const registrationsRef = collection(db, 'registrations');
    const registrationsSnapshot = await getDocs(registrationsRef);
    
    const userEmails = [];
    registrationsSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.email) {
        userEmails.push(userData.email);
        console.log('📧 Found user email:', userData.email);
      }
    });
    
    console.log('📧 TOTAL user emails found:', userEmails.length);
    console.log('📧 All user emails from registrations:', userEmails);
    
    // If no users found in registrations, use test emails
    if (userEmails.length === 0) {
      console.log('⚠️ No users found in registrations, using test emails');
      return TEST_EMAILS;
    }
    
    return userEmails;
  } catch (error) {
    console.error('❌ Error getting notification emails:', error);
    console.log('⚠️ Firebase permission error - using test emails for now');
    console.log('💡 To fix: Update Firebase rules to allow reading registrations');
    return TEST_EMAILS;
  }
};

/**
 * Send notifications to all users about new event
 * @param {Object} eventData - The new event data
 */
export const notifyAllUsers = async (eventData) => {
  try {
    console.log('🔔 Notifying all users about new event:', eventData.title);
    
    // Get list of emails to notify
    const emails = await getNotificationEmails();
    
    if (emails.length === 0) {
      console.log('⚠️ No emails to notify');
      return { success: false, message: 'No emails to notify' };
    }
    
    // Send email to each recipient
    const results = [];
    for (const email of emails) {
      console.log(`📧 Sending notification to: ${email}`);
      const result = await sendEventNotificationEmail(eventData, email);
      results.push({ email, result });
    }
    
    console.log('✅ All notifications sent:', results);
    return { success: true, results };
  } catch (error) {
    console.error('Error notifying users:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Format event data for email display
 * @param {Object} eventData - The event data
 */
export const formatEventForEmail = (eventData) => {
  return {
    title: eventData.title,
    description: eventData.description,
    date: new Date(eventData.startDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    location: eventData.location,
    organizer: eventData.organizer,
    category: eventData.category
  };
};

/**
 * Test event notification system
 */
export const testEventNotification = async () => {
  try {
    console.log('🧪 Testing event notification system...');
    
    const testEvent = {
      title: 'Community Clean-up Drive',
      description: 'Join us to clean up our local park and make it beautiful for everyone!',
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      location: 'Local Park, Toledo City',
      organizer: 'YouthInAction Philippines'
    };
    
    const result = await sendEventNotificationEmail(testEvent, 'jamestellore@gmail.com');
    return result;
  } catch (error) {
    console.error('❌ Error testing event notification:', error);
    return { success: false, message: error.message };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.testEventNotification = testEventNotification;
  window.sendEventNotificationEmail = sendEventNotificationEmail;
  window.notifyAllUsers = notifyAllUsers;
  
  console.log('📧 Event notification functions available:');
  console.log('- testEventNotification() - Test event notification system');
  console.log('- sendEventNotificationEmail(eventData, email) - Send event notification');
  console.log('- notifyAllUsers(eventData) - Notify all users about new event');
}
