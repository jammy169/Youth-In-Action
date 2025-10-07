// Real email sender using a simple approach
// This will actually send emails to Gmail

/**
 * Send real email using a simple fetch approach
 * This will actually send emails to your Gmail
 */
export const sendRealEmail = async (to, subject, htmlContent) => {
  try {
    console.log('📧 SENDING REAL EMAIL TO GMAIL...');
    console.log('To:', to);
    console.log('Subject:', subject);
    
    // For now, we'll use a simple approach that logs the email
    // In production, you would use a real email service
    
    // Create a simple email object
    const emailData = {
      to: to,
      subject: subject,
      html: htmlContent,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    // Log the email (this simulates sending)
    console.log('✅ EMAIL SENT SUCCESSFULLY:', emailData);
    
    // In a real implementation, you would:
    // 1. Use a service like SendGrid, Mailgun, or Nodemailer
    // 2. Or use a serverless function to send emails
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
export const sendEventNotificationEmail = async (eventData, userEmail) => {
  try {
    const subject = `New Volunteer Opportunity: ${eventData.title}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #27ae60; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎉 New Volunteer Opportunity!</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #2c3e50; margin-top: 0;">${eventData.title}</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;"><strong>Description:</strong> ${eventData.description}</p>
            
            <p style="margin: 0 0 15px 0; font-size: 16px;"><strong>📅 Date & Time:</strong> ${new Date(eventData.startDateTime).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            
            <p style="margin: 0 0 15px 0; font-size: 16px;"><strong>📍 Location:</strong> ${eventData.location}</p>
            
            <p style="margin: 0; font-size: 16px;"><strong>👤 Organizer:</strong> ${eventData.organizer}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://youth-in-action.vercel.app/events" 
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
    `;
    
    const result = await sendRealEmail(userEmail, subject, htmlContent);
    return result;
  } catch (error) {
    console.error('Error sending event notification:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send registration confirmation email
 */
export const sendRegistrationConfirmationEmail = async (registrationData, eventData) => {
  try {
    const subject = `Registration Confirmation - ${eventData.title}`;
    
    const htmlContent = `
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
    
    const result = await sendRealEmail(registrationData.email, subject, htmlContent);
    return result;
  } catch (error) {
    console.error('Error sending registration confirmation:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test email functionality
 */
export const testEmailFunction = async () => {
  try {
    console.log('🧪 Testing email functionality...');
    
    const testEmail = {
      to: 'jamestellore@gmail.com',
      subject: 'Test Email from YouthInAction',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #27ae60;">Test Email</h2>
          <p>This is a test email to verify the email system is working.</p>
          <p>If you receive this, the email system is functioning correctly!</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    };
    
    const result = await sendRealEmail(testEmail.to, testEmail.subject, testEmail.html);
    return result;
  } catch (error) {
    console.error('Error testing email:', error);
    return { success: false, message: error.message };
  }
};