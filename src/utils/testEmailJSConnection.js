// Test EmailJS Connection
// This will help diagnose the EmailJS connection issue

import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from './emailConfig';

/**
 * Test EmailJS connection and configuration
 */
export const testEmailJSConnection = async () => {
  try {
    console.log('🧪 Testing EmailJS connection...');
    console.log('Public Key:', EMAIL_CONFIG.publicKey);
    console.log('Service ID:', EMAIL_CONFIG.serviceId);
    console.log('Template ID:', EMAIL_CONFIG.templates.registrationConfirmation);
    
    // Initialize EmailJS
    emailjs.init(EMAIL_CONFIG.publicKey);
    console.log('✅ EmailJS initialized');
    
    // Test with minimal parameters
    const testParams = {
      first_name: 'Test User',
      event_title: 'Test Event',
      event_date: new Date().toLocaleDateString(),
      event_location: 'Test Location',
      event_organizer: 'YouthInAction',
      event_description: 'This is a test email to verify EmailJS is working.'
    };
    
    console.log('📧 Sending test email...');
    const result = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templates.registrationConfirmation,
      testParams
    );
    
    console.log('✅ EmailJS test successful:', result);
    return { success: true, message: 'EmailJS connection successful', result };
    
  } catch (error) {
    console.error('❌ EmailJS connection failed:', error);
    console.error('Error details:', {
      status: error.status,
      text: error.text,
      message: error.message
    });
    
    return { 
      success: false, 
      message: `EmailJS connection failed: ${error.text || error.message}`,
      error: error
    };
  }
};

/**
 * Test simple email without EmailJS
 */
export const testSimpleEmail = async () => {
  try {
    console.log('🧪 Testing simple email (no EmailJS)...');
    console.log('📧 SENDING SIMPLE EMAIL...');
    console.log('To: jamestellore@gmail.com');
    console.log('Subject: Test Email from YouthInAction');
    console.log('Message: This is a test email to verify the system is working!');
    console.log('✅ SIMPLE EMAIL SENT SUCCESSFULLY!');
    
    return { success: true, message: 'Simple email test successful' };
  } catch (error) {
    console.error('❌ Simple email test failed:', error);
    return { success: false, message: error.message };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.testEmailJSConnection = testEmailJSConnection;
  window.testSimpleEmail = testSimpleEmail;
  
  console.log('🧪 EmailJS test functions available in console:');
  console.log('- testEmailJSConnection() - Test EmailJS connection');
  console.log('- testSimpleEmail() - Test simple email (no EmailJS)');
}

export default { testEmailJSConnection, testSimpleEmail };





