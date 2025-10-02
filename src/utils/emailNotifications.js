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
 * Send email notification about new event
 * @param {Object} eventData - The new event data
 * @param {string} recipientEmail - Email address to send to
 */
export const sendEventNotificationEmail = async (eventData, recipientEmail) => {
  try {
    console.log('📧 SENDING EMAIL NOTIFICATION:');
    console.log('To:', recipientEmail);
    console.log('Event:', eventData.title);
    
    // Create email content
    const subject = `New Volunteer Opportunity: ${eventData.title}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #27ae60; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎉 New Volunteer Opportunity!</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #2c3e50; margin-top: 0;">${eventData.title}</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;"><strong>Description:</strong> ${eventData.description}</p>
            
            <p style="margin: 0 0 15px 0; font-size: 16px;"><strong>📅 Date & Time:</strong> ${new Date(eventData.startDateTime).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            
            <p style="margin: 0 0 15px 0; font-size: 16px;"><strong>📍 Location:</strong> ${eventData.location}</p>
            
            <p style="margin: 0; font-size: 16px;"><strong>👤 Organizer:</strong> ${eventData.organizer}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://your-website.com/events" 
               style="background-color: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
              🚀 View Event Details & Register
            </a>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #27ae60; font-size: 14px; text-align: center;">
              <strong>Thank you for being part of YouthInAction!</strong><br>
              Make a difference in your community by volunteering.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because you're registered with YouthInAction.</p>
          <p>If you no longer want to receive these notifications, please contact us.</p>
        </div>
      </div>
    `;
    
    // Send REAL email via serverless function
    console.log('📧 SENDING REAL EMAIL TO GMAIL...');
    console.log('📧 To:', recipientEmail);
    console.log('📧 Subject:', subject);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: subject,
          htmlContent: htmlContent
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ REAL EMAIL SENT TO GMAIL:', recipientEmail);
        console.log('📧 Email delivered successfully!');
        console.log('📧 Timestamp:', result.timestamp);
        return { success: true, message: 'Real email sent to Gmail successfully', realEmail: true };
      } else {
        console.log('❌ Real email failed to send to:', recipientEmail, result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('❌ Error calling serverless function:', error);
      return { success: false, message: error.message };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Get list of email addresses to notify
 * This function gets emails from your Firebase database
 */
export const getNotificationEmails = async () => {
  try {
    console.log('📧 Getting notification emails from Firebase...');
    
    // Get emails from Firebase registrations collection (where users actually are!)
    const registrationsRef = collection(db, 'registrations');
    const registrationsSnapshot = await getDocs(registrationsRef);
    
    const userEmails = [];
    registrationsSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.email) {
        userEmails.push(userData.email);
      }
    });
    
    console.log('📧 Found user emails from registrations:', userEmails);
    
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
