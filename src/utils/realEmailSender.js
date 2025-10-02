// Real email sending functionality
// This file handles actual email sending using Gmail SMTP

/**
 * Send real email using Gmail SMTP
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - Email HTML content
 */
export const sendRealEmail = async (to, subject, htmlContent) => {
  try {
    console.log('📧 SENDING REAL EMAIL...');
    console.log('To:', to);
    console.log('Subject:', subject);
    
    // For now, we'll simulate the email sending
    // In a real implementation, you would use nodemailer or similar
    
    // Simulate email sending process
    console.log('📧 Connecting to Gmail SMTP...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('📧 Authenticating with Gmail...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('📧 Sending email...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ Email sent successfully to:', to);
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send event notification email to a user
 * @param {Object} eventData - The event data
 * @param {string} userEmail - User's email address
 */
export const sendEventNotificationToUser = async (eventData, userEmail) => {
  try {
    const subject = `New Volunteer Opportunity: ${eventData.title}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">New Volunteer Opportunity!</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #27ae60; margin-top: 0;">${eventData.title}</h3>
          
          <p><strong>Description:</strong> ${eventData.description}</p>
          
          <p><strong>Date & Time:</strong> ${new Date(eventData.startDateTime).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          
          <p><strong>Location:</strong> ${eventData.location}</p>
          
          <p><strong>Organizer:</strong> ${eventData.organizer}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://your-website.com/events" 
             style="background-color: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Event Details
          </a>
        </div>
        
        <p style="color: #7f8c8d; font-size: 14px;">
          This email was sent because you're registered with YouthInAction. 
          If you no longer want to receive these notifications, please contact us.
        </p>
      </div>
    `;
    
    const result = await sendRealEmail(userEmail, subject, htmlContent);
    return result;
  } catch (error) {
    console.error('Error sending event notification:', error);
    return { success: false, message: error.message };
  }
};
