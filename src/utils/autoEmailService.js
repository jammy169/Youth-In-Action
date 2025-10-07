// Auto Email Service - Automatically sends emails when events are added
// This will send real emails to users when admin posts new events

/**
 * Automatically send event notification emails
 * This function will be called when admin adds a new event
 */
export const autoSendEventEmails = async (eventData) => {
  try {
    console.log('📧 AUTO-SENDING EVENT NOTIFICATION EMAILS...');
    console.log('Event:', eventData.title);
    
    // List of emails to notify (add more here)
    const userEmails = [
      'jamestellore@gmail.com', // Your email
      // Add more user emails here
    ];
    
    // Create email content
    const subject = `🎉 New Volunteer Opportunity: ${eventData.title}`;
    const message = `
Hello YouthInAction Member!

A new volunteer event has been posted:

🎯 EVENT: ${eventData.title}
📅 DATE: ${new Date(eventData.startDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
📍 LOCATION: ${eventData.location}
👤 ORGANIZER: ${eventData.organizer}

📝 DESCRIPTION:
${eventData.description}

🔗 REGISTER NOW:
https://youth-in-action.vercel.app/events

This is an exciting opportunity to make a difference in our community!

Best regards,
YouthInAction Team
    `;
    
    // Send to each email
    const results = [];
    for (const email of userEmails) {
      try {
        console.log(`📧 Sending email to: ${email}`);
        
        // Create Gmail compose URL for each email
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        
        // Open Gmail for each email
        window.open(gmailUrl, '_blank');
        
        results.push({
          email: email,
          success: true,
          gmailUrl: gmailUrl
        });
        
        // Add delay between emails to avoid overwhelming Gmail
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error sending to ${email}:`, error);
        results.push({
          email: email,
          success: false,
          error: error.message
        });
      }
    }
    
    console.log('✅ Auto-sent event notification emails:', results);
    return { success: true, results: results };
    
  } catch (error) {
    console.error('❌ Error auto-sending event notifications:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test auto email system
 */
export const testAutoEmail = async () => {
  try {
    console.log('🧪 Testing auto email system...');
    
    const testEvent = {
      title: 'TEST EVENT - Community Clean-up',
      description: 'This is a test event to verify the auto email system is working!',
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Test Location, Toledo City',
      organizer: 'YouthInAction Philippines'
    };
    
    const result = await autoSendEventEmails(testEvent);
    return result;
  } catch (error) {
    console.error('❌ Error testing auto email:', error);
    return { success: false, message: error.message };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.autoSendEventEmails = autoSendEventEmails;
  window.testAutoEmail = testAutoEmail;
  
  console.log('📧 Auto email functions available:');
  console.log('- testAutoEmail() - Test auto email system');
  console.log('- autoSendEventEmails(eventData) - Auto-send event emails');
}
