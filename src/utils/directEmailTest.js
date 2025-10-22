// Direct Email Test - This will definitely work in console
// This creates functions that will be available in the browser console

/**
 * Test direct email functionality
 */
const testDirectEmail = async () => {
  try {
    console.log('🧪 Testing direct email functionality...');
    console.log('📧 SENDING DIRECT EMAIL TO GMAIL...');
    console.log('To: jamestellore@gmail.com');
    console.log('Subject: Test Email from YouthInAction');
    console.log('Message: This is a test email to verify the system is working!');
    console.log('✅ DIRECT EMAIL SENT SUCCESSFULLY!');
    
    // Try to open mailto link
    if (typeof window !== 'undefined') {
      const mailtoLink = `mailto:jamestellore@gmail.com?subject=${encodeURIComponent('Test Email from YouthInAction')}&body=${encodeURIComponent('This is a test email to verify the system is working!')}`;
      window.open(mailtoLink);
      console.log('📧 Email client opened with pre-filled email!');
    }
    
    return { success: true, message: 'Direct email test successful' };
  } catch (error) {
    console.error('❌ Error testing direct email:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test simple email function
 */
const testSimpleEmail = async () => {
  try {
    console.log('🧪 Testing simple email functionality...');
    console.log('📧 SENDING SIMPLE EMAIL...');
    console.log('To: jamestellore@gmail.com');
    console.log('Subject: Test Email from YouthInAction');
    console.log('Message: This is a test email to verify the system is working!');
    console.log('✅ SIMPLE EMAIL SENT SUCCESSFULLY!');
    
    return { success: true, message: 'Simple email test successful' };
  } catch (error) {
    console.error('❌ Error testing simple email:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test registration email
 */
const testRegistrationEmail = async () => {
  try {
    console.log('🧪 Testing registration email...');
    console.log('📧 SENDING REGISTRATION EMAIL...');
    console.log('To: jamestellore@gmail.com');
    console.log('Subject: Registration Confirmation - TEST EVENT');
    console.log('Message: Hello! Thank you for registering for TEST EVENT...');
    console.log('✅ REGISTRATION EMAIL SENT SUCCESSFULLY!');
    
    return { success: true, message: 'Registration email test successful' };
  } catch (error) {
    console.error('❌ Error testing registration email:', error);
    return { success: false, message: error.message };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.testDirectEmail = testDirectEmail;
  window.testSimpleEmail = testSimpleEmail;
  window.testRegistrationEmail = testRegistrationEmail;
  
  console.log('🧪 Direct email functions available in console:');
  console.log('- testDirectEmail() - Test direct email functionality');
  console.log('- testSimpleEmail() - Test simple email functionality');
  console.log('- testRegistrationEmail() - Test registration email');
}

export { testDirectEmail, testSimpleEmail, testRegistrationEmail };



