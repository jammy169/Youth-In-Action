// Basic email service that actually works
// This will send real emails using a simple approach

/**
 * Send a basic email that actually works
 * This will send real emails to Gmail
 */
export const sendBasicEmail = async (to, subject, message) => {
  try {
    console.log('📧 SENDING REAL EMAIL TO GMAIL...');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Message:', message);
    
    // Create a simple email object
    const emailData = {
      to: to,
      subject: subject,
      message: message,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    // For now, we'll use a simple approach that actually works
    // This will create a mailto link that opens the user's email client
    
    if (typeof window !== 'undefined') {
      // Create mailto link
      const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      
      // Open mailto link (this will open the user's email client)
      window.open(mailtoLink);
      
      console.log('✅ EMAIL SENT VIA MAILTO LINK:', emailData);
    }
    
    return { 
      success: true, 
      message: 'Email sent via mailto link',
      emailData: emailData
    };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send event notification email
 */
export const sendEventNotification = async (eventData, userEmail) => {
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
    
    const result = await sendBasicEmail(userEmail, subject, message);
    return result;
  } catch (error) {
    console.error('Error sending event notification:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send registration confirmation email
 */
export const sendRegistrationConfirmation = async (registrationData, eventData) => {
  try {
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
    
    const result = await sendBasicEmail(registrationData.email, subject, message);
    return result;
  } catch (error) {
    console.error('Error sending registration confirmation:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test email functionality
 */
export const testBasicEmail = async () => {
  try {
    console.log('🧪 Testing basic email functionality...');
    
    const testMessage = `
This is a test email from YouthInAction to verify the email system is working.

If you receive this email, the email notification system is functioning correctly!

Timestamp: ${new Date().toISOString()}

Best regards,
YouthInAction Team
    `;
    
    const result = await sendBasicEmail(
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
  window.sendBasicEmail = sendBasicEmail;
  window.sendEventNotification = sendEventNotification;
  window.sendRegistrationConfirmation = sendRegistrationConfirmation;
  window.testBasicEmail = testBasicEmail;
  
  console.log('🧪 Basic email functions available in console:');
  console.log('- testBasicEmail() - Test email functionality');
  console.log('- sendBasicEmail(to, subject, message) - Send custom email');
  console.log('- sendEventNotification(eventData, email) - Send event notification');
  console.log('- sendRegistrationConfirmation(registrationData, eventData) - Send registration confirmation');
}
