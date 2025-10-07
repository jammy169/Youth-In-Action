// Gmail Email Service - Opens Gmail directly
// This will open Gmail in your browser instead of your PC's mail app

/**
 * Send email via Gmail (opens Gmail in browser)
 */
export const sendGmailEmail = async (to, subject, message) => {
  try {
    console.log('📧 SENDING EMAIL VIA GMAIL...');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Message:', message);
    
    // Create Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    
    // Open Gmail in new tab
    if (typeof window !== 'undefined') {
      window.open(gmailUrl, '_blank');
      console.log('✅ GMAIL OPENED IN NEW TAB:', gmailUrl);
    }
    
    return { 
      success: true, 
      message: 'Gmail opened in new tab',
      gmailUrl: gmailUrl
    };
  } catch (error) {
    console.error('❌ Error opening Gmail:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send registration confirmation via Gmail
 */
export const sendRegistrationConfirmationEmail = async (registrationData, eventData) => {
  try {
    console.log('📧 Sending registration confirmation via Gmail...');
    
    const subject = `Registration Confirmation - ${eventData.title}`;
    const message = `
Hello ${registrationData.firstName}!

Thank you for registering for our volunteer event:

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

Registration Status: Pending Approval
We will review your registration and notify you of the approval status.

You can view your events at: https://youth-in-action.vercel.app/userevents

If you have any questions, please contact us at info@youthinaction.com

Best regards,
YouthInAction Team
    `;
    
    const result = await sendGmailEmail(registrationData.email, subject, message);
    return result;
  } catch (error) {
    console.error('Error sending Gmail registration confirmation:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test Gmail email functionality
 */
export const testGmailEmail = async () => {
  try {
    console.log('🧪 Testing Gmail email functionality...');
    
    const testMessage = `
This is a test email from YouthInAction to verify the email system is working.

If you receive this email, the email notification system is functioning correctly!

Timestamp: ${new Date().toISOString()}

Best regards,
YouthInAction Team
    `;
    
    const result = await sendGmailEmail(
      'jamestellore@gmail.com',
      'Test Email from YouthInAction',
      testMessage
    );
    
    return result;
  } catch (error) {
    console.error('Error testing Gmail email:', error);
    return { success: false, message: error.message };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.sendGmailEmail = sendGmailEmail;
  window.sendRegistrationConfirmationEmail = sendRegistrationConfirmationEmail;
  window.testGmailEmail = testGmailEmail;
  
  // Add a simple test function that's easier to call
  window.testGmail = () => {
    console.log('🧪 Testing Gmail email functionality...');
    const testEmail = 'jamestellore@gmail.com';
    const testSubject = 'Test Email from YouthInAction (Gmail)';
    const testMessage = 'This is a test email to verify the Gmail system is working!';
    return sendGmailEmail(testEmail, testSubject, testMessage);
  };
  
  console.log('🧪 Gmail email functions available in console:');
  console.log('- testGmail() - Test Gmail email functionality (simple)');
  console.log('- testGmailEmail() - Test Gmail email functionality (full)');
  console.log('- sendGmailEmail(to, subject, message) - Send email via Gmail');
  console.log('- sendRegistrationConfirmationEmail(registrationData, eventData) - Send registration confirmation via Gmail');
}

export { sendGmailEmail, sendRegistrationConfirmationEmail, testGmailEmail };
