// Custom Sender Email Service - Change the sender account
// This allows you to specify a different sender account for emails

import { EMAIL_CONFIG } from '../config/emailConfig';

/**
 * Send emails with custom sender account
 * This opens Gmail compose with a different sender account
 * 
 * IMPORTANT NOTE ABOUT GMAIL:
 * Gmail's compose URL cannot change the "From" address via URL parameters.
 * The email will always send from the account you're logged into.
 * 
 * TO SEND FROM ORGANIZATION EMAIL:
 * Option 1: Log into Gmail with the organization account (youthinaction.ph@gmail.com)
 * Option 2: Set up "Send mail as" in Gmail:
 *   - Go to Gmail Settings > Accounts and Import > Send mail as
 *   - Click "Add another email address"
 *   - Add your organization email and verify it
 *   - When composing, use the "From" dropdown to select the organization account
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
        
        // Create Gmail compose URL
        // NOTE: Gmail's 'from' parameter doesn't work - it always uses the logged-in account
        // To send from a different account, you must:
        // 1. Be logged into that account in Gmail, OR
        // 2. Set up "Send mail as" in Gmail Settings > Accounts and Import
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(user.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        
        // Open Gmail compose for this user
        window.open(gmailUrl, '_blank');
        console.log(`✅ Gmail compose opened for: ${user.email}`);
        console.log(`📧 NOTE: To send from ${senderEmail}, you must:`);
        console.log(`   1. Log into Gmail with ${senderEmail}, OR`);
        console.log(`   2. Use Gmail's "Send mail as" feature in the compose window's "From" dropdown`);
        
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
 * IMPORTANT: To actually send from this email, you must configure Gmail's "Send mail as" feature:
 * 1. Log into the Gmail account you want to send FROM (the organization account)
 * 2. Go to Settings > Accounts and Import > Send mail as > Add another email address
 * 3. Add the organization email address and verify it
 * 4. When composing emails, use the dropdown next to "From" to select the organization account
 * 
 * Note: The Gmail URL 'from' parameter doesn't work - Gmail always uses the logged-in account.
 * You must be logged into the organization account OR use "Send mail as" feature.
 */
export const sendEmailsWithOrgAccount = async (eventData) => {
  // Get organization email from config, or use default
  const orgEmail = EMAIL_CONFIG?.settings?.organizationEmail || 'youthinaction.ph@gmail.com';
  console.log('📧 Using organization email:', orgEmail);
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
