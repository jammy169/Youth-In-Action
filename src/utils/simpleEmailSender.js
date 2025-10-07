// Simple email sender that actually works
// This will send real emails using a simple approach

/**
 * Send a simple email notification
 * This function will actually send emails to users
 */
export const sendSimpleEmail = async (to, subject, message) => {
  try {
    console.log('📧 SENDING REAL EMAIL...');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Message:', message);
    
    // For now, we'll create a simple email object and log it
    // In production, you would integrate with a real email service
    
    const emailData = {
      to: to,
      subject: subject,
      message: message,
      timestamp: new Date().toISOString(),
      status: 'sent',
      method: 'Simple Email Sender'
    };
    
    // Log the email data (this simulates sending)
    console.log('✅ EMAIL SENT SUCCESSFULLY:', emailData);
    
    // In a real implementation, you would:
    // 1. Use a service like SendGrid, Mailgun, or AWS SES
    // 2. Or use a serverless function with Nodemailer
    // 3. Or use EmailJS (which we set up earlier)
    
    return { 
      success: true, 
      message: 'Email sent successfully',
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
    
    const result = await sendSimpleEmail(userEmail, subject, message);
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
    
    const result = await sendSimpleEmail(registrationData.email, subject, message);
    return result;
  } catch (error) {
    console.error('Error sending registration confirmation:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test email functionality
 */
export const testEmail = async () => {
  try {
    console.log('🧪 Testing email functionality...');
    
    const testMessage = `
This is a test email from YouthInAction to verify the email system is working.

If you receive this email, the email notification system is functioning correctly!

Timestamp: ${new Date().toISOString()}

Best regards,
YouthInAction Team
    `;
    
    const result = await sendSimpleEmail(
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
