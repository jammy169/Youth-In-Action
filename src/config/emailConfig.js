// Email configuration for YouthInAction
// This file contains the email settings for the application

// EmailJS Configuration
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/
// 2. Create a free account
// 3. Create a new service (Gmail, Outlook, etc.)
// 4. Create email templates
// 5. Get your service ID, template IDs, and public key
// 6. Update the values below

export const EMAIL_CONFIG = {
  // EmailJS Service Configuration
  serviceId: 'service_your_service_id', // Replace with your EmailJS service ID
  publicKey: 'your_public_key', // Replace with your EmailJS public key
  
  // Email Templates
  templates: {
    registrationConfirmation: 'template_registration_confirmation', // Replace with your template ID
    eventNotification: 'template_event_notification', // Replace with your template ID
    statusUpdate: 'template_status_update', // Replace with your template ID
    testEmail: 'template_test_email' // Replace with your template ID
  },
  
  // Email Settings
  settings: {
    fromName: 'YouthInAction',
    fromEmail: 'noreply@youthinaction.com',
    replyTo: 'info@youthinaction.com',
    websiteUrl: 'https://youth-in-action.vercel.app',
    // Organization email for sending event notifications
    organizationEmail: 'youthinactionpoblacion@gmail.com' // Organization Gmail account
  }
};

// Fallback email configuration (for development/testing)
export const FALLBACK_EMAIL_CONFIG = {
  enabled: true, // Set to false in production
  logToConsole: true, // Log emails to console instead of sending
  adminEmail: 'jamestellore@gmail.com' // Admin email for fallback notifications
};

// Email templates content
export const EMAIL_TEMPLATES = {
  registrationConfirmation: {
    subject: 'Registration Confirmation - {{event_title}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #27ae60; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">✅ Registration Confirmed!</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Hello {{to_name}}!</h2>
          
          <p>Thank you for registering for our volunteer event. Here are the details:</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <h3 style="color: #27ae60; margin-top: 0;">{{event_title}}</h3>
            <p><strong>📅 Date & Time:</strong> {{event_date}}</p>
            <p><strong>📍 Location:</strong> {{event_location}}</p>
            <p><strong>👤 Organizer:</strong> {{event_organizer}}</p>
            <p><strong>📝 Description:</strong> {{event_description}}</p>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #27ae60; font-size: 14px; text-align: center;">
              <strong>Registration Status: Pending Approval</strong><br>
              We will review your registration and notify you of the approval status.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{website_url}}/userevents" 
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
    `
  },
  
  eventNotification: {
    subject: 'New Volunteer Opportunity: {{event_title}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #27ae60; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎉 New Volunteer Opportunity!</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #2c3e50; margin-top: 0;">{{event_title}}</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;"><strong>Description:</strong> {{event_description}}</p>
            <p style="margin: 0 0 15px 0; font-size: 16px;"><strong>📅 Date & Time:</strong> {{event_date}}</p>
            <p style="margin: 0 0 15px 0; font-size: 16px;"><strong>📍 Location:</strong> {{event_location}}</p>
            <p style="margin: 0; font-size: 16px;"><strong>👤 Organizer:</strong> {{event_organizer}}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{website_url}}/events" 
               style="background-color: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
              🚀 View Event Details & Register
            </a>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #27ae60; font-size: 14px; text-align: center;">
              <strong>Thank you for being part of YouthInAction!</strong><br>
              Make a difference in your community by volunteering.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because you're registered with YouthInAction.</p>
          <p>If you no longer want to receive these notifications, please contact us.</p>
        </div>
      </div>
    `
  }
};

// Instructions for setting up EmailJS
export const EMAILJS_SETUP_INSTRUCTIONS = `
📧 EMAILJS SETUP INSTRUCTIONS:

1. Go to https://www.emailjs.com/
2. Create a free account
3. Create a new service:
   - Choose Gmail, Outlook, or your preferred email service
   - Connect your email account
4. Create email templates:
   - registrationConfirmation: For registration confirmations
   - eventNotification: For new event notifications
   - statusUpdate: For status updates
5. Get your credentials:
   - Service ID
   - Template IDs
   - Public Key
6. Update the EMAIL_CONFIG object above with your credentials
7. Test the email functionality

For more help, visit: https://www.emailjs.com/docs/
`;
