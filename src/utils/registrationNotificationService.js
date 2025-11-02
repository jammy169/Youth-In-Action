// Registration Notification Service - Status Change Notifications
// Sends email notifications to users when their registration status changes

import { EMAIL_CONFIG } from '../config/emailConfig';
import { STATUS_CONFIG } from './volunteerStatusUtils';

/**
 * Send status change notification to user
 * Opens Gmail compose window with pre-filled status update email
 * 
 * @param {Object} registrationData - Current registration data
 * @param {string} newStatus - New status (pending, approved, rejected, attended, absent)
 * @returns {Promise<Object>} - Result object with success status and gmailUrl
 */
export const sendStatusChangeNotification = async (registrationData, newStatus) => {
  try {
    console.log('📧 Sending status change notification...');
    console.log('Registration Data:', registrationData);
    console.log('New Status:', newStatus);

    if (!registrationData || !newStatus) {
      console.error('❌ Missing registration data or new status');
      return {
        success: false,
        message: 'Missing registration data or new status'
      };
    }

    const userEmail = registrationData.email;
    if (!userEmail) {
      console.error('❌ No email found in registration data');
      return {
        success: false,
        message: 'No email address found for registration'
      };
    }

    const userName = `${registrationData.firstName || ''} ${registrationData.lastName || ''}`.trim() || 'Volunteer';
    const eventTitle = registrationData.eventTitle || 'Volunteer Event';
    const currentStatus = registrationData.status || 'pending';
    
    // Format event date
    let eventDateStr = 'Date TBD';
    if (registrationData.eventStartDate) {
      try {
        const eventDate = new Date(registrationData.eventStartDate);
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
    }

    // Get organization email from config
    const orgEmail = EMAIL_CONFIG?.settings?.organizationEmail || 'youthinactionpoblacion@gmail.com';
    const websiteUrl = EMAIL_CONFIG?.settings?.websiteUrl || 'https://youth-in-action.vercel.app';

    // Get status information
    const statusInfo = STATUS_CONFIG[newStatus] || {
      text: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
      description: 'Your registration status has been updated'
    };

    // Create email subject based on status
    let subject = '';
    let emoji = '';
    let statusMessage = '';
    let actionMessage = '';

    switch (newStatus.toLowerCase()) {
      case 'approved':
        subject = `✅ Registration Approved: ${eventTitle}`;
        emoji = '✅';
        statusMessage = 'Congratulations! Your registration has been approved!';
        actionMessage = 'You are now registered to attend this event. Please mark your calendar and prepare for the event.';
        break;
      
      case 'rejected':
        subject = `❌ Registration Update: ${eventTitle}`;
        emoji = '❌';
        statusMessage = 'Your registration status has been updated.';
        actionMessage = 'Unfortunately, your registration for this event could not be approved at this time. We appreciate your interest and encourage you to apply for future events.';
        break;
      
      case 'attended':
        subject = `🎉 Thank You for Attending: ${eventTitle}`;
        emoji = '🎉';
        statusMessage = 'Thank you for attending the event!';
        actionMessage = `You have successfully attended the event and ${registrationData.serviceHours || 4} service hours have been credited to your account.`;
        break;
      
      case 'absent':
        subject = `📝 Registration Update: ${eventTitle}`;
        emoji = '📝';
        statusMessage = 'Your attendance status has been recorded.';
        actionMessage = 'You were marked as absent for this event. No service hours were awarded. If you believe this is an error, please contact us.';
        break;
      
      case 'pending':
      default:
        subject = `⏳ Registration Status: ${eventTitle}`;
        emoji = '⏳';
        statusMessage = 'Your registration status update.';
        actionMessage = 'Your registration is currently pending admin review. We will notify you once your status changes.';
        break;
    }

    // Create email body
    const message = `Hello ${userName}!

${statusMessage}

📋 REGISTRATION STATUS UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${emoji} EVENT: ${eventTitle}
📅 DATE: ${eventDateStr}
📊 STATUS: ${statusInfo.text}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${actionMessage}

${newStatus === 'approved' ? `
📌 IMPORTANT REMINDERS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Make sure to arrive on time for the event
• Bring any required items or documents
• Contact the organizer if you have questions
• Check the event details for any updates

` : ''}

${newStatus === 'attended' && registrationData.serviceHours ? `
⭐ SERVICE HOURS CREDITED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Hours Awarded: ${registrationData.serviceHours} hours
• Total Service Hours: Check your profile to see your updated total
• Thank you for your volunteer service!

` : ''}

🔗 NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• View your event registrations: ${websiteUrl}/userevents
• Check your profile: ${websiteUrl}/profile
• Contact us if you have questions

${newStatus === 'rejected' ? `
💚 We appreciate your interest in volunteering with YouthInAction. 
We encourage you to apply for other upcoming events!

` : ''}

Best regards,
YouthInAction Team
${orgEmail}

---
This is an automated notification email. Please do not reply directly to this email.
For inquiries, please contact us through our website or email directly.`;

    // Create Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(userEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    
    console.log(`📧 Gmail compose URL created for status change notification: ${userEmail}`);
    console.log(`📧 URL: ${gmailUrl.substring(0, 100)}...`);
    console.log(`📧 Status: ${currentStatus} → ${newStatus}`);
    console.log(`📧 NOTE: To send from ${orgEmail}, you must:`);
    console.log(`   1. Log into Gmail with ${orgEmail}, OR`);
    console.log(`   2. Use Gmail's "Send mail as" feature in the compose window's "From" dropdown`);
    
    return {
      success: true,
      message: 'Status change notification email compose opened',
      userEmail: userEmail,
      userName: userName,
      eventTitle: eventTitle,
      oldStatus: currentStatus,
      newStatus: newStatus,
      statusText: statusInfo.text,
      gmailUrl: gmailUrl,
      senderEmail: orgEmail
    };

  } catch (error) {
    console.error('❌ Error sending status change notification:', error);
    return {
      success: false,
      message: error.message || 'Failed to send status change notification',
      error: error
    };
  }
};

/**
 * Test status change notification
 */
export const testStatusChangeNotification = async (testStatus = 'approved') => {
  try {
    console.log('🧪 Testing status change notification...');
    
    const testRegistration = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      phone: '123-456-7890',
      eventTitle: 'Community Clean-up Drive - TEST',
      status: 'pending',
      serviceHours: testStatus === 'attended' ? 4 : 0,
      eventStartDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    const result = await sendStatusChangeNotification(testRegistration, testStatus);
    return result;
  } catch (error) {
    console.error('❌ Error testing status change notification:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.sendStatusChangeNotification = sendStatusChangeNotification;
  window.testStatusChangeNotification = testStatusChangeNotification;
  
  console.log('📧 Registration Notification Service functions available:');
  console.log('- sendStatusChangeNotification(registrationData, newStatus)');
  console.log('- testStatusChangeNotification(status)');
}
