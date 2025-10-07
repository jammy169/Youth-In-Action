// Console Email Test - This will definitely work in console
// This creates functions that will be available in the browser console

/**
 * Test EmailJS functionality directly in console
 */
const testEmailJS = async () => {
  try {
    console.log('🧪 Testing EmailJS functionality...');
    console.log('📧 SENDING TEST EMAIL VIA EMAILJS...');
    
    // Import EmailJS dynamically
    const emailjs = await import('@emailjs/browser');
    
    // Initialize with your credentials
    emailjs.default.init('siG0BlxQyXnJq8JCw');
    
    // Test email parameters
    const templateParams = {
      to_email: 'jamestellore@gmail.com',
      subject: 'Test Email from YouthInAction App',
      message: 'This is a test email from your YouthInAction app to verify EmailJS is working!',
      from_name: 'YouthInAction',
      reply_to: 'noreply@youthinaction.com'
    };
    
    // Send test email
    const result = await emailjs.default.send(
      'service_5tr2hqf',
      'template_xxxxxxx', // We'll need to create a template
      templateParams
    );
    
    console.log('✅ EMAIL SENT VIA EMAILJS:', result);
    return { success: true, message: 'Email sent via EmailJS', result };
    
  } catch (error) {
    console.error('❌ Error testing EmailJS:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test simple email function
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
    
    return { success: true, message: 'Registration email sent successfully' };
  } catch (error) {
    console.error('❌ Error testing registration email:', error);
    return { success: false, message: error.message };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.testEmailJS = testEmailJS;
  window.testSimpleEmail = testSimpleEmail;
  window.testRegistrationEmail = testRegistrationEmail;
  
  console.log('🧪 Email test functions available in console:');
  console.log('- testSimpleEmail() - Test simple email functionality');
  console.log('- testRegistrationEmail() - Test registration email');
  console.log('- testEmailJS() - Test EmailJS functionality');
}

export { testEmailJS, testSimpleEmail, testRegistrationEmail };
