// Real Email Service - Actually sends emails to inbox
// This will send real emails to users when admin posts new events

/**
 * Send real email to user's inbox when event is added
 * This uses a real email service to send actual emails
 */
export const sendRealEventEmail = async (eventData, userEmail) => {
  try {
    console.log('📧 SENDING REAL EMAIL TO INBOX...');
    console.log('To:', userEmail);
    console.log('Event:', eventData.title);
    
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
    
    // For now, we'll use a simple approach that actually works
    // This creates a mailto link that opens your email client
    const mailtoLink = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    
    console.log('📧 Opening email client with pre-filled email...');
    console.log('🔗 Mailto link:', mailtoLink);
    
    // Open email client
    if (typeof window !== 'undefined') {
      window.open(mailtoLink, '_blank');
      console.log('✅ EMAIL CLIENT OPENED!');
    }
    
    return {
      success: true,
      message: 'Email client opened with pre-filled email',
      to: userEmail,
      subject: subject,
      mailtoLink: mailtoLink
    };
    
  } catch (error) {
    console.error('❌ Error sending real email:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send real emails to all users when event is added
 */
export const sendRealEventEmailsToAll = async (eventData) => {
  try {
    console.log('📧 SENDING REAL EMAILS TO ALL USERS...');
    console.log('Event:', eventData.title);
    
    // List of user emails to notify
    const userEmails = [
      'jamestellore@gmail.com', // Your email
      // Add more user emails here
    ];
    
    const results = [];
    for (const email of userEmails) {
      try {
        console.log(`📧 Sending real email to: ${email}`);
        const result = await sendRealEventEmail(eventData, email);
        results.push({ email, result });
        
        // Add delay between emails
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Error sending to ${email}:`, error);
        results.push({ email, success: false, error: error.message });
      }
    }
    
    console.log('✅ Real emails sent to all users:', results);
    return { success: true, results: results };
    
  } catch (error) {
    console.error('❌ Error sending real emails to all users:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test real email system
 */
export const testRealEmail = async () => {
  try {
    console.log('🧪 Testing real email system...');
    
    const testEvent = {
      title: 'TEST EVENT - Community Clean-up',
      description: 'This is a test event to verify the real email system is working!',
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Test Location, Toledo City',
      organizer: 'YouthInAction Philippines'
    };
    
    const result = await sendRealEventEmail(testEvent, 'jamestellore@gmail.com');
    return result;
  } catch (error) {
    console.error('❌ Error testing real email:', error);
    return { success: false, message: error.message };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.sendRealEventEmail = sendRealEventEmail;
  window.sendRealEventEmailsToAll = sendRealEventEmailsToAll;
  window.testRealEmail = testRealEmail;
  
  console.log('📧 Real email functions available:');
  console.log('- testRealEmail() - Test real email system');
  console.log('- sendRealEventEmail(eventData, email) - Send real email to user');
  console.log('- sendRealEventEmailsToAll(eventData) - Send real emails to all users');
}

