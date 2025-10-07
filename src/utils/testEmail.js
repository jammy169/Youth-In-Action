// Test email functionality
// Run this in the browser console to test email sending

import { testEmail, sendEventNotification, sendRegistrationConfirmation } from './simpleEmailSender';

/**
 * Test the email system
 * Run this function in the browser console to test email functionality
 */
export const runEmailTest = async () => {
  console.log('🧪 Starting email system test...');
  
  try {
    // Test 1: Basic email test
    console.log('📧 Test 1: Basic email test');
    const testResult = await testEmail();
    console.log('Test 1 result:', testResult);
    
    // Test 2: Event notification test
    console.log('📧 Test 2: Event notification test');
    const eventData = {
      title: 'Test Event',
      description: 'This is a test event for email notifications',
      startDateTime: new Date().toISOString(),
      location: 'Test Location',
      organizer: 'Test Organizer'
    };
    
    const eventResult = await sendEventNotification(eventData, 'jamestellore@gmail.com');
    console.log('Test 2 result:', eventResult);
    
    // Test 3: Registration confirmation test
    console.log('📧 Test 3: Registration confirmation test');
    const registrationData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'jamestellore@gmail.com'
    };
    
    const registrationResult = await sendRegistrationConfirmation(registrationData, eventData);
    console.log('Test 3 result:', registrationResult);
    
    console.log('✅ All email tests completed!');
    return {
      success: true,
      message: 'All email tests completed successfully',
      results: {
        test1: testResult,
        test2: eventResult,
        test3: registrationResult
      }
    };
  } catch (error) {
    console.error('❌ Email test failed:', error);
    return {
      success: false,
      message: 'Email test failed',
      error: error.message
    };
  }
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  window.runEmailTest = runEmailTest;
  window.testEmail = testEmail;
  window.sendEventNotification = sendEventNotification;
  window.sendRegistrationConfirmation = sendRegistrationConfirmation;
  
  console.log('🧪 Email test functions available in console:');
  console.log('- runEmailTest() - Run all email tests');
  console.log('- testEmail() - Test basic email');
  console.log('- sendEventNotification(eventData, email) - Test event notification');
  console.log('- sendRegistrationConfirmation(registrationData, eventData) - Test registration confirmation');
}
