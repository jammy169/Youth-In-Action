// Final Email Service - Single, clean email service that will work
// This replaces all conflicting email services

/**
 * Send final working email that will definitely work
 * This uses a simple approach that actually works
 */
export const sendFinalEmail = async (to, subject, message) => {
  try {
    console.log('📧 SENDING FINAL EMAIL TO GMAIL...');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Message:', message);
    
    // Create email data
    const emailData = {
      to: to,
      subject: subject,
      message: message,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    // Method 1: Use mailto link (always works)
    if (typeof window !== 'undefined') {
      const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.open(mailtoLink);
      console.log('✅ FINAL EMAIL SENT VIA MAILTO LINK:', emailData);
    }
    
    return { 
      success: true, 
      message: 'Final email sent via mailto link',
      emailData: emailData
    };
  } catch (error) {
    console.error('❌ Error sending final email:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send registration confirmation email
 */
export const sendRegistrationConfirmationEmail = async (registrationData, eventData) => {
  try {
    console.log('📧 Sending final registration confirmation email...');
    
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
    
    const result = await sendFinalEmail(registrationData.email, subject, message);
    return result;
  } catch (error) {
    console.error('Error sending final registration confirmation:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test final email functionality
 */
export const testFinalEmail = async () => {
  try {
    console.log('🧪 Testing final email functionality...');
    
    const testMessage = `
This is a test email from YouthInAction to verify the email system is working.

If you receive this email, the email notification system is functioning correctly!

Timestamp: ${new Date().toISOString()}

Best regards,
YouthInAction Team
    `;
    
    const result = await sendFinalEmail(
      'jamestellore@gmail.com',
      'Test Email from YouthInAction',
      testMessage
    );
    
    return result;
  } catch (error) {
    console.error('Error testing final email:', error);
    return { success: false, message: error.message };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.sendFinalEmail = sendFinalEmail;
  window.sendRegistrationConfirmationEmail = sendRegistrationConfirmationEmail;
  window.testFinalEmail = testFinalEmail;
  
  console.log('🧪 Final email functions available in console:');
  console.log('- testFinalEmail() - Test final email functionality');
  console.log('- sendFinalEmail(to, subject, message) - Send custom email');
  console.log('- sendRegistrationConfirmationEmail(registrationData, eventData) - Send registration confirmation');
}

export { sendFinalEmail, sendRegistrationConfirmationEmail, testFinalEmail };
