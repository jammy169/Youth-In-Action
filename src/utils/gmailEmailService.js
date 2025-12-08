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

    // Create email body with prominent warning at top
    const message = `⚠️⚠️⚠️ CRITICAL: CHECK "FROM" FIELD BEFORE SENDING! ⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MUST SEND FROM: ${orgEmail}
DO NOT SEND FROM: jamestellore@gmail.com or any other account!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hello ${userName}!

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
    
    // Show critical warning about sender account - use confirm to force acknowledgment
    const warningMessage = `🚨 CRITICAL: SENDER ACCOUNT CHECK REQUIRED 🚨

BEFORE SENDING, YOU MUST:
1. Check the "From" dropdown in Gmail (next to your name at top)
2. It MUST show: ${orgEmail}
3. If it shows jamestellore@gmail.com or another account, CLICK the dropdown and SELECT ${orgEmail}

⚠️ WARNING: Sending from wrong account = email goes to wrong sent folder!

Click OK only after you've verified the From field shows ${orgEmail}`;

    // Use confirm to force user to acknowledge
    const userAcknowledged = confirm(warningMessage);
    if (!userAcknowledged) {
      return {
        success: false,
        message: 'Email cancelled - please verify sender account before sending'
      };
    }
    
    // Open Gmail compose window
    console.log(`📧 Opening Gmail compose for: ${userEmail}`);
    console.log(`⚠️ CRITICAL: User must select ${orgEmail} from the "From" dropdown before sending!`);
    const emailWindow = window.open(gmailUrl, '_blank');
    
    // Check if popup was blocked
    if (!emailWindow || emailWindow.closed || typeof emailWindow.closed === 'undefined') {
      console.warn('⚠️ Popup blocker may have blocked the email window');
      alert('⚠️ Popup blocked! Please allow popups for this site and try again.');
      return {
        success: false,
        message: 'Popup blocked - please allow popups for this site',
        gmailUrl: gmailUrl
      };
    }
    
    console.log(`✅ Registration confirmation email compose opened successfully`);
    console.log(`📧 CRITICAL REMINDER: User must select ${orgEmail} from the "From" dropdown before sending!`);
    
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

/**
 * Generic Gmail email sender
 * Opens Gmail compose window with custom subject and message
 * 
 * @param {string} userEmail - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} message - Email body/message
 * @returns {Promise<Object>} - Result object with success status
 */
export const sendGmailEmail = async (userEmail, subject, message) => {
  try {
    console.log('📧 Sending Gmail email...');
    console.log('To:', userEmail);
    console.log('Subject:', subject);

    if (!userEmail || !subject || !message) {
      console.error('❌ Missing required email parameters');
      return {
        success: false,
        message: 'Missing required email parameters (email, subject, message)'
      };
    }

    // Get organization email from config
    const orgEmail = EMAIL_CONFIG?.settings?.organizationEmail || 'youthinactionpoblacion@gmail.com';

    // Show critical warning about sender account - use confirm to force acknowledgment
    const warningMessage = `🚨 CRITICAL: SENDER ACCOUNT CHECK REQUIRED 🚨

BEFORE SENDING, YOU MUST:
1. Check the "From" dropdown in Gmail (next to your name at top)
2. It MUST show: ${orgEmail}
3. If it shows jamestellore@gmail.com or another account, CLICK the dropdown and SELECT ${orgEmail}

⚠️ WARNING: Sending from wrong account = email goes to wrong sent folder!

Click OK only after you've verified the From field shows ${orgEmail}`;

    // Use confirm to force user to acknowledge
    const userAcknowledged = confirm(warningMessage);
    if (!userAcknowledged) {
      return {
        success: false,
        message: 'Email cancelled - please verify sender account before sending'
      };
    }

    // Create Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(userEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    
    // Open Gmail compose window
    console.log(`📧 Opening Gmail compose for: ${userEmail}`);
    console.log(`⚠️ CRITICAL: User must select ${orgEmail} from the "From" dropdown before sending!`);
    const emailWindow = window.open(gmailUrl, '_blank');
    
    // Check if popup was blocked
    if (!emailWindow || emailWindow.closed || typeof emailWindow.closed === 'undefined') {
      console.warn('⚠️ Popup blocker may have blocked the email window');
      alert('⚠️ Popup blocked! Please allow popups for this site and try again.');
      return {
        success: false,
        message: 'Popup blocked - please allow popups for this site',
        gmailUrl: gmailUrl
      };
    }
    
    console.log(`✅ Gmail compose opened successfully`);
    console.log(`📧 CRITICAL REMINDER: User must select ${orgEmail} from the "From" dropdown before sending!`);
    
    return {
      success: true,
      message: 'Gmail compose opened successfully',
      userEmail: userEmail,
      subject: subject,
      gmailUrl: gmailUrl,
      senderEmail: orgEmail
    };

  } catch (error) {
    console.error('❌ Error sending Gmail email:', error);
    return {
      success: false,
      message: error.message || 'Failed to send Gmail email',
      error: error
    };
  }
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.sendRegistrationConfirmationEmail = sendRegistrationConfirmationEmail;
  window.testRegistrationConfirmationEmail = testRegistrationConfirmationEmail;
  window.sendGmailEmail = sendGmailEmail;
  
  console.log('📧 Gmail Email Service functions available:');
  console.log('- sendRegistrationConfirmationEmail(registrationData, eventData)');
  console.log('- testRegistrationConfirmationEmail()');
  console.log('- sendGmailEmail(userEmail, subject, message)');
}
