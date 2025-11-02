// Gmail Email Service - Registration Confirmation Emails
// Sends registration confirmation emails via Gmail compose

import { EMAIL_CONFIG } from '../config/emailConfig';

/**
 * Send registration confirmation email to user
 * Opens Gmail compose window with pre-filled registration confirmation email
 * 
 * @param {Object} registrationData - Registration data from user
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} - Result object with success status
 */
export const sendRegistrationConfirmationEmail = async (registrationData, eventData) => {
  try {
    console.log('📧 Sending registration confirmation email...');
    console.log('Registration Data:', registrationData);
    console.log('Event Data:', eventData);

    if (!registrationData || !eventData) {
      console.error('❌ Missing registration or event data');
      return {
        success: false,
        message: 'Missing registration or event data'
      };
    }

    const userEmail = registrationData.email;
    const userName = `${registrationData.firstName || ''} ${registrationData.lastName || ''}`.trim() || 'Volunteer';
    
    // Format event date
    let eventDateStr = 'Date TBD';
    if (eventData.startDateTime) {
      try {
        const eventDate = new Date(eventData.startDateTime);
        eventDateStr = eventDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (dateError) {
        console.warn('⚠️ Error formatting date:', dateError);
      }
    } else if (eventData.date) {
      eventDateStr = eventData.date;
    }

    // Get organization email from config
    const orgEmail = EMAIL_CONFIG?.settings?.organizationEmail || 'youthinactionpoblacion@gmail.com';
    const websiteUrl = EMAIL_CONFIG?.settings?.websiteUrl || 'https://youth-in-action.vercel.app';

    // Create email subject
    const subject = `✅ Registration Confirmation: ${eventData.title || 'Event'}`;

    // Create email body
    const message = `Hello ${userName}!

Thank you for registering for our volunteer event! Your registration has been received and is pending admin approval.

📋 REGISTRATION DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 EVENT: ${eventData.title || 'Volunteer Event'}
📅 DATE & TIME: ${eventDateStr}
📍 LOCATION: ${eventData.location || 'TBD'}
👤 ORGANIZER: ${eventData.organizer || 'YouthInAction Team'}
📝 DESCRIPTION: ${eventData.description || 'Community service event'}

👤 YOUR INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${userName}
Email: ${userEmail}
Phone: ${registrationData.phone || 'N/A'}
Age: ${registrationData.age || 'N/A'}

📊 REGISTRATION STATUS: Pending Approval
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your registration is now pending admin approval. You will be notified via email once your status changes.

⏰ APPROVAL PROCESS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• We typically review registrations within 24 hours
• You'll receive an email notification when your status changes
• Check your email regularly for updates

🔗 NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Check your email for approval status updates
• View your event registrations: ${websiteUrl}/userevents
• Contact us if you have questions

💚 Thank you for your interest in volunteering with YouthInAction!

Best regards,
YouthInAction Team
${orgEmail}

---
This is an automated confirmation email. Please do not reply directly to this email.
For inquiries, please contact us through our website or email directly.`;

    // Create Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(userEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    
    // Open Gmail compose window
    console.log(`📧 Opening Gmail compose for: ${userEmail}`);
    window.open(gmailUrl, '_blank');
    
    console.log(`✅ Registration confirmation email compose opened successfully`);
    console.log(`📧 NOTE: To send from ${orgEmail}, you must:`);
    console.log(`   1. Log into Gmail with ${orgEmail}, OR`);
    console.log(`   2. Use Gmail's "Send mail as" feature in the compose window's "From" dropdown`);
    
    return {
      success: true,
      message: 'Registration confirmation email compose opened',
      userEmail: userEmail,
      userName: userName,
      eventTitle: eventData.title,
      gmailUrl: gmailUrl,
      senderEmail: orgEmail
    };

  } catch (error) {
    console.error('❌ Error sending registration confirmation email:', error);
    return {
      success: false,
      message: error.message || 'Failed to send registration confirmation email',
      error: error
    };
  }
};

/**
 * Test registration confirmation email
 */
export const testRegistrationConfirmationEmail = async () => {
  try {
    console.log('🧪 Testing registration confirmation email...');
    
    const testRegistration = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      phone: '123-456-7890',
      age: '25'
    };
    
    const testEvent = {
      title: 'Community Clean-up Drive - TEST',
      description: 'This is a test event for email confirmation',
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Test Location, Toledo City',
      organizer: 'YouthInAction Team'
    };
    
    const result = await sendRegistrationConfirmationEmail(testRegistration, testEvent);
    return result;
  } catch (error) {
    console.error('❌ Error testing registration confirmation email:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.sendRegistrationConfirmationEmail = sendRegistrationConfirmationEmail;
  window.testRegistrationConfirmationEmail = testRegistrationConfirmationEmail;
  
  console.log('📧 Gmail Email Service functions available:');
  console.log('- sendRegistrationConfirmationEmail(registrationData, eventData)');
  console.log('- testRegistrationConfirmationEmail()');
}
