// registrationNotificationService.js
// Service to send notifications when registration status changes

import { sendGmailEmail } from './gmailEmailService';

/**
 * Send approval notification to user
 */
export const sendApprovalNotification = async (registration) => {
  try {
    console.log('📧 Sending approval notification to:', registration.email);
    
    const subject = `Registration Approved - ${registration.eventTitle}`;
    const message = `
Hello ${registration.firstName}!

🎉 Great news! Your registration has been approved!

Event Details:
📅 Event: ${registration.eventTitle}
📅 Date: ${new Date(registration.eventDate).toLocaleDateString()}
📍 Location: ${registration.eventLocation}

Your Registration Status: ✅ APPROVED

What's Next:
• 📧 You'll receive event details and reminders
• 📱 Check your notifications for updates
• 🎯 Prepare for the event day
• 📞 Contact us if you have questions

Thank you for volunteering with us!

Best regards,
YouthInAction Team
    `;
    
    const result = await sendGmailEmail(registration.email, subject, message);
    console.log('✅ Approval notification sent successfully');
    return result;
  } catch (error) {
    console.error('❌ Error sending approval notification:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send rejection notification to user
 */
export const sendRejectionNotification = async (registration, reason = '') => {
  try {
    console.log('📧 Sending rejection notification to:', registration.email);
    
    const subject = `Registration Update - ${registration.eventTitle}`;
    const message = `
Hello ${registration.firstName}!

We regret to inform you that your registration for the following event could not be approved at this time:

Event Details:
📅 Event: ${registration.eventTitle}
📅 Date: ${new Date(registration.eventDate).toLocaleDateString()}
📍 Location: ${registration.eventLocation}

Your Registration Status: ❌ NOT APPROVED

${reason ? `Reason: ${reason}` : 'Unfortunately, we could not accommodate your registration for this event.'}

What's Next:
• 🔄 You can register for other available events
• 📱 Check our events page for new opportunities
• 📞 Contact us if you have questions
• 🤝 We appreciate your interest in volunteering

Thank you for your understanding.

Best regards,
YouthInAction Team
    `;
    
    const result = await sendGmailEmail(registration.email, subject, message);
    console.log('✅ Rejection notification sent successfully');
    return result;
  } catch (error) {
    console.error('❌ Error sending rejection notification:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send status change notification (generic)
 */
export const sendStatusChangeNotification = async (registration, newStatus, reason = '') => {
  try {
    console.log(`📧 Sending status change notification: ${newStatus} to:`, registration.email);
    
    const statusMessages = {
      'approved': {
        subject: `Registration Approved - ${registration.eventTitle}`,
        icon: '✅',
        message: 'Your registration has been approved!'
      },
      'rejected': {
        subject: `Registration Update - ${registration.eventTitle}`,
        icon: '❌',
        message: 'Your registration could not be approved at this time.'
      },
      'cancelled': {
        subject: `Event Cancelled - ${registration.eventTitle}`,
        icon: '🚫',
        message: 'The event has been cancelled.'
      }
    };
    
    const statusInfo = statusMessages[newStatus] || {
      subject: `Registration Update - ${registration.eventTitle}`,
      icon: '📝',
      message: `Your registration status has been updated to: ${newStatus}`
    };
    
    const message = `
Hello ${registration.firstName}!

${statusInfo.icon} ${statusInfo.message}

Event Details:
📅 Event: ${registration.eventTitle}
📅 Date: ${new Date(registration.eventDate).toLocaleDateString()}
📍 Location: ${registration.eventLocation}

Your Registration Status: ${statusInfo.icon} ${newStatus.toUpperCase()}

${reason ? `Additional Information: ${reason}` : ''}

What's Next:
• 📱 Check your notifications for updates
• 🔄 You can register for other events
• 📞 Contact us if you have questions

Thank you for your interest in volunteering!

Best regards,
YouthInAction Team
    `;
    
    const result = await sendGmailEmail(registration.email, statusInfo.subject, message);
    console.log(`✅ Status change notification sent: ${newStatus}`);
    return result;
  } catch (error) {
    console.error('❌ Error sending status change notification:', error);
    return { success: false, message: error.message };
  }
};




