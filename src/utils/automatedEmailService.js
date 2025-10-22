// Automated Email Service - Automatically sends emails to users
// This uses EmailJS to automatically send emails when admin adds events

import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  publicKey: 'siG0BlxQyXnJq8JCw',
  serviceId: 'service_5tr2hqf',
  templateId: 'template_cdgwahb'
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

/**
 * Automatically send event notification email to user
 * This will send real emails to user's inbox automatically
 */
export const sendAutomatedEventEmail = async (eventData, userEmail) => {
  try {
    console.log('📧 AUTOMATICALLY SENDING EMAIL TO USER INBOX...');
    console.log('To:', userEmail);
    console.log('Event:', eventData.title);
    
    // Prepare email template parameters
    const templateParams = {
      to_email: userEmail,
      to_name: 'YouthInAction Member',
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
      registration_link: 'https://youth-in-action.vercel.app/events',
      organization_name: 'YouthInAction Philippines'
    };
    
    console.log('📧 Sending automated email via EmailJS...');
    console.log('Template params:', templateParams);
    
    // Send email using EmailJS
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    );
    
    console.log('✅ AUTOMATED EMAIL SENT SUCCESSFULLY!', result);
    return {
      success: true,
      message: 'Automated email sent to user inbox',
      result: result,
      userEmail: userEmail
    };
    
  } catch (error) {
    console.error('❌ Error sending automated email:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

/**
 * Automatically send event notifications to all users
 * This will send real emails to all users' inboxes automatically
 */
export const sendAutomatedEventEmailsToAll = async (eventData) => {
  try {
    console.log('📧 AUTOMATICALLY SENDING EMAILS TO ALL USERS...');
    console.log('Event:', eventData.title);
    
    // List of user emails to notify automatically
    const userEmails = [
      'jamestellore@gmail.com', // Your email
      // Add more user emails here
    ];
    
    const results = [];
    let successCount = 0;
    let failureCount = 0;
    
    for (const email of userEmails) {
      try {
        console.log(`📧 Automatically sending email to: ${email}`);
        const result = await sendAutomatedEventEmail(eventData, email);
        
        if (result.success) {
          successCount++;
          console.log(`✅ Email sent successfully to: ${email}`);
        } else {
          failureCount++;
          console.log(`❌ Email failed to: ${email}`, result.message);
        }
        
        results.push({
          email: email,
          success: result.success,
          message: result.message
        });
        
        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        failureCount++;
        console.error(`❌ Error sending to ${email}:`, error);
        results.push({
          email: email,
          success: false,
          message: error.message
        });
      }
    }
    
    console.log(`✅ AUTOMATED EMAIL SUMMARY:`);
    console.log(`📧 Successfully sent: ${successCount} emails`);
    console.log(`❌ Failed to send: ${failureCount} emails`);
    console.log(`📊 Total results:`, results);
    
    return {
      success: successCount > 0,
      message: `Automated emails sent: ${successCount} success, ${failureCount} failed`,
      results: results,
      successCount: successCount,
      failureCount: failureCount
    };
    
  } catch (error) {
    console.error('❌ Error sending automated emails to all users:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

/**
 * Test automated email system
 */
export const testAutomatedEmail = async () => {
  try {
    console.log('🧪 Testing automated email system...');
    
    const testEvent = {
      title: 'TEST EVENT - Community Clean-up Drive',
      description: 'This is a test event to verify the automated email system is working! Join us to clean up our local park.',
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Local Park, Toledo City, Cebu',
      organizer: 'YouthInAction Philippines'
    };
    
    const result = await sendAutomatedEventEmail(testEvent, 'jamestellore@gmail.com');
    return result;
  } catch (error) {
    console.error('❌ Error testing automated email:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.sendAutomatedEventEmail = sendAutomatedEventEmail;
  window.sendAutomatedEventEmailsToAll = sendAutomatedEventEmailsToAll;
  window.testAutomatedEmail = testAutomatedEmail;
  
  console.log('📧 Automated email functions available:');
  console.log('- testAutomatedEmail() - Test automated email system');
  console.log('- sendAutomatedEventEmail(eventData, email) - Send automated email to user');
  console.log('- sendAutomatedEventEmailsToAll(eventData) - Send automated emails to all users');
}



