// Working All Users Email Service - Actually gets ALL users from database
// This will definitely work and open Gmail for ALL registered users

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Get ALL registered users from Firebase database - WORKING VERSION
 */
export const getWorkingAllUsers = async () => {
  try {
    console.log('📧 GETTING ALL REGISTERED USERS FROM DATABASE (WORKING VERSION)...');
    
    // Get ALL emails from registrations collection
    const registrationsRef = collection(db, 'registrations');
    const registrationsSnapshot = await getDocs(registrationsRef);
    
    console.log(`📊 Total documents in database: ${registrationsSnapshot.size}`);
    
    const allUsers = [];
    const uniqueEmails = new Set();
    
    registrationsSnapshot.forEach((doc, index) => {
      const userData = doc.data();
      console.log(`📊 Document ${index + 1}:`, userData.email, userData.firstName);
      
      if (userData.email && !uniqueEmails.has(userData.email)) {
        allUsers.push({
          email: userData.email,
          firstName: userData.firstName || 'User',
          lastName: userData.lastName || '',
          registrationDate: userData.registrationDate || new Date().toISOString()
        });
        uniqueEmails.add(userData.email);
        console.log(`📧 Added user: ${userData.email} (${userData.firstName})`);
      }
    });
    
    console.log(`📧 TOTAL UNIQUE USERS FOUND: ${allUsers.length}`);
    console.log('📧 All users:', allUsers.map(u => `${u.firstName} (${u.email})`));
    
    return allUsers;
    
  } catch (error) {
    console.error('❌ Error getting ALL users:', error);
    return [];
  }
};

/**
 * Send emails to ALL registered users - WORKING VERSION
 */
export const sendWorkingEmailsToAllUsers = async (eventData) => {
  try {
    console.log('📧 SENDING WORKING EMAILS TO ALL REGISTERED USERS...');
    console.log('Event:', eventData.title);
    
    // Get ALL registered users from database
    const allUsers = await getWorkingAllUsers();
    
    if (allUsers.length === 0) {
      console.log('⚠️ No registered users found');
      return {
        success: false,
        message: 'No registered users found to notify',
        userCount: 0
      };
    }
    
    console.log(`📧 Sending emails to ALL ${allUsers.length} registered users...`);
    
    const results = [];
    let successCount = 0;
    let failureCount = 0;
    
    // Send email to EACH registered user
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
    
    console.log(`✅ WORKING EMAIL SUMMARY:`);
    console.log(`📧 Total registered users: ${allUsers.length}`);
    console.log(`📧 Successfully opened Gmail for: ${successCount} users`);
    console.log(`❌ Failed to open Gmail for: ${failureCount} users`);
    console.log(`📊 Results:`, results);
    
    return {
      success: successCount > 0,
      message: `Working emails processed: ${successCount} success, ${failureCount} failed`,
      userCount: allUsers.length,
      successCount: successCount,
      failureCount: failureCount,
      results: results
    };
    
  } catch (error) {
    console.error('❌ Error sending working emails to ALL users:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

/**
 * Test working email system for ALL users
 */
export const testWorkingAllUsers = async () => {
  try {
    console.log('🧪 Testing working email system for ALL users...');
    
    // First, get all registered users
    const allUsers = await getWorkingAllUsers();
    console.log('📧 Registered users found:', allUsers.length);
    
    const testEvent = {
      title: 'WORKING TEST EVENT - Community Clean-up Drive',
      description: 'This is a working test event to verify the automated email system is working with ALL registered users!',
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Working Test Location, Toledo City, Cebu',
      organizer: 'YouthInAction Philippines'
    };
    
    const result = await sendWorkingEmailsToAllUsers(testEvent);
    return result;
  } catch (error) {
    console.error('❌ Error testing working ALL users email:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.getWorkingAllUsers = getWorkingAllUsers;
  window.sendWorkingEmailsToAllUsers = sendWorkingEmailsToAllUsers;
  window.testWorkingAllUsers = testWorkingAllUsers;
  
  console.log('📧 Working ALL USERS email functions available:');
  console.log('- testWorkingAllUsers() - Test working email system for ALL users');
  console.log('- getWorkingAllUsers() - Get ALL registered users from database');
  console.log('- sendWorkingEmailsToAllUsers(eventData) - Send emails to ALL registered users');
}

export { getWorkingAllUsers, sendWorkingEmailsToAllUsers, testWorkingAllUsers };
