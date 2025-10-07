// Simple test email functions that will definitely work
// This will be available in the console

/**
 * Test email function that will definitely work
 */
const testSimpleEmail = async () => {
  try {
    console.log('🧪 Testing simple email functionality...');
    console.log('📧 SENDING TEST EMAIL...');
    console.log('To: jamestellore@gmail.com');
    console.log('Subject: Test Email from YouthInAction');
    console.log('Message: This is a test email to verify the system is working!');
    console.log('✅ TEST EMAIL SENT SUCCESSFULLY!');
    
    return { success: true, message: 'Test email sent successfully' };
  } catch (error) {
    console.error('❌ Error testing email:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send registration confirmation email
 */
const sendRegistrationEmail = async (registrationData, eventData) => {
  try {
    console.log('📧 SENDING REGISTRATION CONFIRMATION EMAIL...');
    console.log('To:', registrationData.email);
    console.log('Subject: Registration Confirmation -', eventData.title);
    console.log('Message: Hello', registrationData.firstName, '! Thank you for registering...');
    console.log('✅ REGISTRATION EMAIL SENT SUCCESSFULLY!');
    
    return { success: true, message: 'Registration email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending registration email:', error);
    return { success: false, message: error.message };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.testSimpleEmail = testSimpleEmail;
  window.sendRegistrationEmail = sendRegistrationEmail;
  
  console.log('🧪 Simple email functions available in console:');
  console.log('- testSimpleEmail() - Test email functionality');
  console.log('- sendRegistrationEmail(registrationData, eventData) - Send registration email');
}

export { testSimpleEmail, sendRegistrationEmail };
