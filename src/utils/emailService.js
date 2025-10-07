// Real email service using EmailJS
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG, FALLBACK_EMAIL_CONFIG } from '../config/emailConfig';

// Initialize EmailJS
emailjs.init(EMAIL_CONFIG.publicKey);

/**
 * Send event registration confirmation email
 * @param {Object} registrationData - Registration data
 * @param {Object} eventData - Event data
 */
export const sendRegistrationConfirmation = async (registrationData, eventData) => {
  try {
    console.log('📧 Sending registration confirmation email...');
    
    const subject = `Registration Confirmation - ${eventData.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #27ae60; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">✅ Registration Confirmed!</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Hello ${registrationData.firstName}!</h2>
          
          <p>Thank you for registering for our volunteer event. Here are the details:</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <h3 style="color: #27ae60; margin-top: 0;">${eventData.title}</h3>
            <p><strong>📅 Date & Time:</strong> ${new Date(eventData.startDateTime).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p><strong>📍 Location:</strong> ${eventData.location}</p>
            <p><strong>👤 Organizer:</strong> ${eventData.organizer}</p>
            <p><strong>📝 Description:</strong> ${eventData.description}</p>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #27ae60; font-size: 14px; text-align: center;">
              <strong>Registration Status: Pending Approval</strong><br>
              We will review your registration and notify you of the approval status.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://youth-in-action.vercel.app/userevents" 
               style="background-color: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              View My Events
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because you registered for an event with YouthInAction.</p>
          <p>If you have any questions, please contact us at info@youthinaction.com</p>
        </div>
      </div>
    `;

    // Use serverless function to send email
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: registrationData.email,
        subject: subject,
        html: html
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Registration confirmation email sent:', result);
      return { success: true, message: 'Confirmation email sent successfully' };
    } else {
      console.log('⚠️ Email sending failed, using fallback');
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error('❌ Error sending registration confirmation:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send event notification email to all users
 * @param {Object} eventData - Event data
 * @param {Array} userEmails - Array of user email addresses
 */
export const sendEventNotification = async (eventData, userEmails) => {
  try {
    console.log('📧 Sending event notification to users...');
    
    const results = [];
    
    for (const userEmail of userEmails) {
      try {
        const templateParams = {
          to_email: userEmail,
          event_title: eventData.title,
          event_date: new Date(eventData.startDateTime).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          event_location: eventData.location,
          event_organizer: eventData.organizer,
          event_description: eventData.description,
          website_url: 'https://youth-in-action.vercel.app'
        };

        const result = await emailjs.send(
          EMAIL_CONFIG.serviceId,
          EMAIL_CONFIG.templates.eventNotification,
          templateParams
        );

        console.log(`✅ Event notification sent to ${userEmail}:`, result);
        results.push({ email: userEmail, success: true });
      } catch (error) {
        console.error(`❌ Error sending to ${userEmail}:`, error);
        results.push({ email: userEmail, success: false, error: error.message });
      }
    }

    return { success: true, results };
  } catch (error) {
    console.error('❌ Error sending event notifications:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send registration status update email
 * @param {Object} registrationData - Registration data
 * @param {Object} eventData - Event data
 * @param {string} status - New status (approved, rejected, attended, absent)
 */
export const sendStatusUpdate = async (registrationData, eventData, status) => {
  try {
    console.log(`📧 Sending status update email for status: ${status}`);
    
    const statusMessages = {
      'approved': 'Your registration has been approved! You can now attend the event.',
      'rejected': 'Unfortunately, your registration was not approved for this event.',
      'attended': 'Thank you for attending the event! Your service hours have been recorded.',
      'absent': 'You were marked as absent for this event. No service hours were recorded.'
    };

    const templateParams = {
      to_email: registrationData.email,
      to_name: `${registrationData.firstName} ${registrationData.lastName}`,
      event_title: eventData.title,
      event_date: new Date(eventData.startDateTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      event_location: eventData.location,
      status: status,
      status_message: statusMessages[status] || 'Your registration status has been updated.',
      website_url: 'https://youth-in-action.vercel.app'
    };

    const result = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templates.statusUpdate,
      templateParams
    );

    console.log('✅ Status update email sent:', result);
    return { success: true, message: 'Status update email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending status update:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test email functionality
 */
export const testEmailService = async () => {
  try {
    console.log('🧪 Testing email service...');
    
    const testParams = {
      to_email: 'jamestellore@gmail.com',
      to_name: 'Test User',
      event_title: 'Test Event',
      event_date: new Date().toLocaleDateString('en-US'),
      event_location: 'Test Location',
      event_organizer: 'Test Organizer',
      event_description: 'This is a test email to verify the email service is working.',
      website_url: 'https://youth-in-action.vercel.app'
    };

    const result = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templates.testEmail,
      testParams
    );

    console.log('✅ Test email sent successfully:', result);
    return { success: true, message: 'Test email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    return { success: false, message: error.message };
  }
};

// Fallback email service (for development/testing)
export const sendFallbackEmail = async (to, subject, message) => {
  try {
    console.log('📧 Sending fallback email...');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Message:', message);
    
    // For now, just log the email (in production, this would send real emails)
    console.log('✅ Fallback email logged successfully');
    return { success: true, message: 'Email logged (fallback mode)' };
  } catch (error) {
    console.error('❌ Error in fallback email:', error);
    return { success: false, message: error.message };
  }
};
