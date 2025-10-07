// EmailJS Service - This will send REAL emails to Gmail
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from './emailConfig';

// Initialize EmailJS
emailjs.init(EMAIL_CONFIG.publicKey);

/**
 * Send real email using EmailJS
 * This will actually send emails to Gmail
 */
export const sendEmailJSEmail = async (to, subject, message) => {
  try {
    console.log('📧 SENDING REAL EMAIL VIA EMAILJS...');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Message:', message);
    
    // Check if EmailJS is configured
    if (EMAIL_CONFIG.publicKey === 'YOUR_PUBLIC_KEY_HERE') {
      console.log('⚠️ EmailJS not configured, using fallback');
      return { success: false, message: 'EmailJS not configured. Please set up EmailJS credentials.' };
    }
    
    // Send email using EmailJS
    const templateParams = {
      first_name: 'User',
      event_title: 'Test Event',
      event_date: new Date().toLocaleDateString(),
      event_location: 'Test Location',
      event_organizer: 'YouthInAction',
      event_description: message
    };
    
    const result = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templates.registrationConfirmation,
      templateParams
    );
    
    console.log('✅ EMAIL SENT VIA EMAILJS:', result);
    return { success: true, message: 'Email sent via EmailJS', result };
    
  } catch (error) {
    console.error('❌ Error sending email via EmailJS:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send event notification email
 */
export const sendEventNotificationEmail = async (eventData, userEmail) => {
  try {
    const subject = `New Volunteer Opportunity: ${eventData.title}`;
    const message = `
Hello!

A new volunteer opportunity has been added to YouthInAction:

Event: ${eventData.title}
Date: ${new Date(eventData.startDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
Location: ${eventData.location}
Organizer: ${eventData.organizer}

Description: ${eventData.description}

Visit our website to register: https://youth-in-action.vercel.app/events

Thank you for being part of YouthInAction!
Best regards,
YouthInAction Team
    `;
    
    const result = await sendEmailJSEmail(userEmail, subject, message);
    return result;
  } catch (error) {
    console.error('Error sending event notification:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send registration confirmation email
 */
export const sendRegistrationConfirmationEmail = async (registrationData, eventData) => {
  try {
    console.log('📧 Sending registration confirmation via EmailJS...');
    
    // Check if EmailJS is configured
    if (EMAIL_CONFIG.publicKey === 'YOUR_PUBLIC_KEY_HERE') {
      console.log('⚠️ EmailJS not configured, using fallback');
      return { success: false, message: 'EmailJS not configured. Please set up EmailJS credentials.' };
    }
    
    // Prepare template parameters for the email template
    const templateParams = {
      first_name: registrationData.firstName,
      event_title: eventData.title,
      event_date: new Date(eventData.startDateTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      event_location: eventData.location,
      event_organizer: eventData.organizer,
      event_description: eventData.description
    };
    
    // Send email using EmailJS
    const result = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templates.registrationConfirmation,
      templateParams
    );
    
    console.log('✅ Registration confirmation sent via EmailJS:', result);
    return { success: true, message: 'Registration confirmation sent successfully', result };
    
  } catch (error) {
    console.error('❌ Error sending registration confirmation:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test email functionality
 */
export const testEmailJSEmail = async () => {
  try {
    console.log('🧪 Testing EmailJS email functionality...');
    
    const testMessage = `
This is a test email from YouthInAction to verify the email system is working.

If you receive this email, the email notification system is functioning correctly!

Timestamp: ${new Date().toISOString()}

Best regards,
YouthInAction Team
    `;
    
    const result = await sendEmailJSEmail(
      'jamestellore@gmail.com',
      'Test Email from YouthInAction',
      testMessage
    );
    
    return result;
  } catch (error) {
    console.error('Error testing email:', error);
    return { success: false, message: error.message };
  }
};

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  window.sendEmailJSEmail = sendEmailJSEmail;
  window.sendEventNotificationEmail = sendEventNotificationEmail;
  window.sendRegistrationConfirmationEmail = sendRegistrationConfirmationEmail;
  window.testEmailJSEmail = testEmailJSEmail;
  
  console.log('🧪 EmailJS functions available in console:');
  console.log('- testEmailJSEmail() - Test EmailJS functionality');
  console.log('- sendEmailJSEmail(to, subject, message) - Send custom email via EmailJS');
  console.log('- sendEventNotificationEmail(eventData, email) - Send event notification via EmailJS');
  console.log('- sendRegistrationConfirmationEmail(registrationData, eventData) - Send registration confirmation via EmailJS');
}
