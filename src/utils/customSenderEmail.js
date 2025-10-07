// Custom Sender Email Service - Change the sender account
// This allows you to specify a different sender account for emails

/**
 * Send emails with custom sender account
 * This opens Gmail compose with a different sender account
 */
export const sendEmailsWithCustomSender = async (eventData, senderEmail = 'youthinaction@gmail.com') => {
  try {
    console.log('📧 SENDING EMAILS WITH CUSTOM SENDER ACCOUNT...');
    console.log('Event:', eventData.title);
    console.log('Sender Email:', senderEmail);
    
    // Get ALL registered users from database
    const { getWorkingAllUsers } = await import('./workingAllUsersEmail');
    const allUsers = await getWorkingAllUsers();
    
    if (allUsers.length === 0) {
      console.log('⚠️ No registered users found');
      return {
        success: false,
        message: 'No registered users found to notify',
        userCount: 0
      };
    }
    
    console.log(`📧 Sending emails to ALL ${allUsers.length} registered users with custom sender...`);
    
    const results = [];
    let successCount = 0;
    let failureCount = 0;
    
    // Send email to EACH registered user with custom sender
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      try {
        console.log(`📧 [${i + 1}/${allUsers.length}] Sending email to: ${user.email} (${user.firstName} ${user.lastName})`);
        
        const subject = `🎉 New Volunteer Opportunity: ${eventData.title}`;
        const message = `
Hello ${user.firstName}!

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
        
        // Create Gmail compose URL with custom sender
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(user.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}&from=${encodeURIComponent(senderEmail)}`;
        
        // Open Gmail compose for this user
        window.open(gmailUrl, '_blank');
        console.log(`✅ Gmail compose opened for: ${user.email} with sender: ${senderEmail}`);
        
        results.push({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          sender: senderEmail,
          success: true,
          gmailUrl: gmailUrl
        });
        
        successCount++;
        
        // Add delay between emails
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        failureCount++;
        console.error(`❌ Error sending to ${user.email}:`, error);
        results.push({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          sender: senderEmail,
          success: false,
          error: error.message
        });
      }
    }
    
    console.log(`✅ CUSTOM SENDER EMAIL SUMMARY:`);
    console.log(`📧 Total registered users: ${allUsers.length}`);
    console.log(`📧 Successfully opened Gmail for: ${successCount} users`);
    console.log(`📧 Sender account: ${senderEmail}`);
    console.log(`❌ Failed to open Gmail for: ${failureCount} users`);
    console.log(`📊 Results:`, results);
    
    return {
      success: successCount > 0,
      message: `Custom sender emails processed: ${successCount} success, ${failureCount} failed`,
      userCount: allUsers.length,
      successCount: successCount,
      failureCount: failureCount,
      senderEmail: senderEmail,
      results: results
    };
    
  } catch (error) {
    console.error('❌ Error sending custom sender emails:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

/**
 * Test custom sender email system
 */
export const testCustomSenderEmail = async (senderEmail = 'youthinaction@gmail.com') => {
  try {
    console.log('🧪 Testing custom sender email system...');
    console.log('Sender Email:', senderEmail);
    
    const testEvent = {
      title: 'CUSTOM SENDER TEST EVENT - Community Clean-up Drive',
      description: 'This is a test event to verify the custom sender email system is working!',
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Custom Sender Test Location, Toledo City, Cebu',
      organizer: 'YouthInAction Philippines'
    };
    
    const result = await sendEmailsWithCustomSender(testEvent, senderEmail);
    return result;
  } catch (error) {
    console.error('❌ Error testing custom sender email:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

/**
 * Send emails with YouthInAction organization account
 */
export const sendEmailsWithOrgAccount = async (eventData) => {
  const orgEmail = 'youthinaction@gmail.com'; // Change this to your organization email
  return await sendEmailsWithCustomSender(eventData, orgEmail);
};

/**
 * Send emails with admin account
 */
export const sendEmailsWithAdminAccount = async (eventData) => {
  const adminEmail = 'admin@youthinaction.com'; // Change this to your admin email
  return await sendEmailsWithCustomSender(eventData, adminEmail);
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.sendEmailsWithCustomSender = sendEmailsWithCustomSender;
  window.testCustomSenderEmail = testCustomSenderEmail;
  window.sendEmailsWithOrgAccount = sendEmailsWithOrgAccount;
  window.sendEmailsWithAdminAccount = sendEmailsWithAdminAccount;
  
  console.log('📧 Custom sender email functions available:');
  console.log('- testCustomSenderEmail(senderEmail) - Test custom sender email system');
  console.log('- sendEmailsWithCustomSender(eventData, senderEmail) - Send emails with custom sender');
  console.log('- sendEmailsWithOrgAccount(eventData) - Send emails with organization account');
  console.log('- sendEmailsWithAdminAccount(eventData) - Send emails with admin account');
}

export { sendEmailsWithCustomSender, testCustomSenderEmail, sendEmailsWithOrgAccount, sendEmailsWithAdminAccount };
