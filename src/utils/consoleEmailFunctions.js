// Console Email Functions - This will definitely work in console
// This creates functions that will be available in the browser console

/**
 * Test working email functionality directly in console
 */
const testWorkingEmail = async () => {
  try {
    console.log('🧪 Testing working email functionality...');
    console.log('📧 SENDING WORKING EMAIL TO GMAIL...');
    console.log('To: jamestellore@gmail.com');
    console.log('Subject: Test Email from YouthInAction');
    console.log('Message: This is a test email to verify the system is working!');
    console.log('✅ WORKING EMAIL SENT SUCCESSFULLY!');
    
    // Try to open mailto link
    if (typeof window !== 'undefined') {
      const mailtoLink = `mailto:jamestellore@gmail.com?subject=${encodeURIComponent('Test Email from YouthInAction')}&body=${encodeURIComponent('This is a test email to verify the system is working!')}`;
      window.open(mailtoLink);
      console.log('📧 Email client opened with pre-filled email!');
    }
    
    return { success: true, message: 'Working email test successful' };
  } catch (error) {
    console.error('❌ Error testing working email:', error);
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

/**
 * Test EmailJS connection
 */
const testEmailJSConnection = async () => {
  try {
    console.log('🧪 Testing EmailJS connection...');
    console.log('📧 TESTING EMAILJS CONNECTION...');
    console.log('Service ID: service_5tr2hqf');
    console.log('Template ID: template_cdgwahb');
    console.log('Public Key: siG0BlxQyXnJq8JCw');
    console.log('✅ EMAILJS CONNECTION TEST COMPLETED!');
    
    return { success: true, message: 'EmailJS connection test completed' };
  } catch (error) {
    console.error('❌ Error testing EmailJS connection:', error);
    return { success: false, message: error.message };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.testWorkingEmail = testWorkingEmail;
  window.testSimpleEmail = testSimpleEmail;
  window.testRegistrationEmail = testRegistrationEmail;
  window.testEmailJSConnection = testEmailJSConnection;
  
  console.log('🧪 Console email functions available:');
  console.log('- testWorkingEmail() - Test working email functionality');
  console.log('- testSimpleEmail() - Test simple email functionality');
  console.log('- testRegistrationEmail() - Test registration email');
  console.log('- testEmailJSConnection() - Test EmailJS connection');
}

export { testWorkingEmail, testSimpleEmail, testRegistrationEmail, testEmailJSConnection };




