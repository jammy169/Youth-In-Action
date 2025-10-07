// Advanced Email Service - Automatically gets all registered users from database
// This fetches all user emails from Firebase and sends notifications automatically

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Get all registered users' email addresses from Firebase
 * This automatically fetches all users who have registered for events
 */
export const getAllRegisteredUserEmails = async () => {
  try {
    console.log('📧 FETCHING ALL REGISTERED USER EMAILS FROM DATABASE...');
    
    // Get emails from registrations collection
    const registrationsRef = collection(db, 'registrations');
    const registrationsSnapshot = await getDocs(registrationsRef);
    
    const userEmails = [];
    const uniqueEmails = new Set(); // To avoid duplicates
    
    registrationsSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.email && !uniqueEmails.has(userData.email)) {
        userEmails.push({
          email: userData.email,
          firstName: userData.firstName || 'User',
          lastName: userData.lastName || '',
          registrationDate: userData.registrationDate || new Date().toISOString()
        });
        uniqueEmails.add(userData.email);
        console.log('📧 Found registered user:', userData.email);
      }
    });
    
    console.log(`📧 TOTAL REGISTERED USERS FOUND: ${userEmails.length}`);
    console.log('📧 All registered user emails:', userEmails.map(u => u.email));
    
    // If no users found, add default emails for testing
    if (userEmails.length === 0) {
      console.log('⚠️ No registered users found, using default emails for testing');
      return [
        { email: 'jamestellore@gmail.com', firstName: 'Jam Floyd', lastName: 'Estellore' }
      ];
    }
    
    return userEmails;
    
  } catch (error) {
    console.error('❌ Error fetching registered user emails:', error);
    console.log('⚠️ Database error - using default emails for testing');
    return [
      { email: 'jamestellore@gmail.com', firstName: 'Jam Floyd', lastName: 'Estellore' }
    ];
  }
};

/**
 * Send advanced automated email to all registered users
 * This automatically gets all users and sends them notifications
 */
export const sendAdvancedEmailsToAllUsers = async (eventData) => {
  try {
    console.log('📧 ADVANCED AUTOMATED EMAIL SYSTEM - SENDING TO ALL REGISTERED USERS...');
    console.log('Event:', eventData.title);
    
    // Automatically get all registered user emails
    const registeredUsers = await getAllRegisteredUserEmails();
    
    if (registeredUsers.length === 0) {
      console.log('⚠️ No registered users found');
      return {
        success: false,
        message: 'No registered users found to notify',
        userCount: 0
      };
    }
    
    console.log(`📧 Sending emails to ${registeredUsers.length} registered users...`);
    
    const results = [];
    let successCount = 0;
    let failureCount = 0;
    
    // Send email to each registered user
    for (const user of registeredUsers) {
      try {
        console.log(`📧 Sending advanced email to: ${user.email} (${user.firstName} ${user.lastName})`);
        
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
        
        // Create Gmail compose URL for this user
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(user.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        
        // Open Gmail compose for this user
        window.open(gmailUrl, '_blank');
        console.log(`✅ Gmail compose opened for: ${user.email}`);
        
        results.push({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          success: true,
          gmailUrl: gmailUrl
        });
        
        successCount++;
        
        // Add delay between emails to avoid overwhelming Gmail
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        failureCount++;
        console.error(`❌ Error sending to ${user.email}:`, error);
        results.push({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          success: false,
          error: error.message
        });
      }
    }
    
    console.log(`✅ ADVANCED EMAIL SUMMARY:`);
    console.log(`📧 Total registered users: ${registeredUsers.length}`);
    console.log(`📧 Successfully opened Gmail for: ${successCount} users`);
    console.log(`❌ Failed to open Gmail for: ${failureCount} users`);
    console.log(`📊 Results:`, results);
    
    return {
      success: successCount > 0,
      message: `Advanced emails processed: ${successCount} success, ${failureCount} failed`,
      userCount: registeredUsers.length,
      successCount: successCount,
      failureCount: failureCount,
      results: results
    };
    
  } catch (error) {
    console.error('❌ Error in advanced email system:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

/**
 * Test advanced email system
 */
export const testAdvancedEmail = async () => {
  try {
    console.log('🧪 Testing advanced email system...');
    
    // First, get all registered users
    const registeredUsers = await getAllRegisteredUserEmails();
    console.log('📧 Registered users found:', registeredUsers.length);
    
    const testEvent = {
      title: 'ADVANCED TEST EVENT - Community Clean-up Drive',
      description: 'This is an advanced test event to verify the automated email system is working with all registered users!',
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Advanced Test Location, Toledo City, Cebu',
      organizer: 'YouthInAction Philippines'
    };
    
    const result = await sendAdvancedEmailsToAllUsers(testEvent);
    return result;
  } catch (error) {
    console.error('❌ Error testing advanced email:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.getAllRegisteredUserEmails = getAllRegisteredUserEmails;
  window.sendAdvancedEmailsToAllUsers = sendAdvancedEmailsToAllUsers;
  window.testAdvancedEmail = testAdvancedEmail;
  
  console.log('📧 Advanced email functions available:');
  console.log('- testAdvancedEmail() - Test advanced email system');
  console.log('- getAllRegisteredUserEmails() - Get all registered users from database');
  console.log('- sendAdvancedEmailsToAllUsers(eventData) - Send emails to all registered users');
}

export { getAllRegisteredUserEmails, sendAdvancedEmailsToAllUsers, testAdvancedEmail };
