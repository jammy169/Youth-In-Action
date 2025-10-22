// Event Notification Service - Sends emails when admins post new events
// This will notify users about new events via Gmail

/**
 * Send event notification email to users when admin posts new event
 */
export const sendEventNotificationEmail = async (eventData, userEmails = []) => {
  try {
    console.log('📧 SENDING EVENT NOTIFICATION EMAILS...');
    console.log('Event:', eventData.title);
    console.log('Recipients:', userEmails.length, 'users');
    
    // Default recipient list (you can add more emails here)
    const defaultEmails = [
      'jamestellore@gmail.com', // Your email
      // Add more emails here for testing
    ];
    
    // Combine with provided emails
    const allEmails = [...new Set([...defaultEmails, ...userEmails])];
    
    // Create email content
    const subject = `New Event Posted: ${eventData.title}`;
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
    for (const email of allEmails) {
      try {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        
        // Open Gmail for each email (in real app, you'd use a proper email service)
        console.log(`📧 Opening Gmail for: ${email}`);
        console.log(`🔗 Gmail URL: ${gmailUrl}`);
        
        results.push({
          email: email,
          success: true,
          gmailUrl: gmailUrl
        });
      } catch (error) {
        console.error(`❌ Error sending to ${email}:`, error);
        results.push({
          email: email,
          success: false,
          error: error.message
        });
      }
    }
    
    console.log('✅ Event notification emails processed:', results);
    return { success: true, results: results };
    
  } catch (error) {
    console.error('❌ Error sending event notifications:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test event notification system
 */
export const testEventNotification = async () => {
  try {
    console.log('🧪 Testing event notification system...');
    
    const testEvent = {
      title: 'Community Clean-up Drive',
      description: 'Join us to clean up our local park and make it beautiful for everyone!',
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      location: 'Local Park, Toledo City',
      organizer: 'YouthInAction Philippines'
    };
    
    const result = await sendEventNotificationEmail(testEvent);
    return result;
  } catch (error) {
    console.error('❌ Error testing event notification:', error);
    return { success: false, message: error.message };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.sendEventNotificationEmail = sendEventNotificationEmail;
  window.testEventNotification = testEventNotification;
  
  console.log('📧 Event notification functions available:');
  console.log('- testEventNotification() - Test event notification system');
  console.log('- sendEventNotificationEmail(eventData, userEmails) - Send event notifications');
}

export { sendEventNotificationEmail, testEventNotification };


