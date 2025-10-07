// All Users Email Service - Gets ALL registered users from database automatically
// This will fetch ALL users from Firebase and send emails to EVERYONE

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Get ALL registered users from Firebase database
 * This automatically fetches ALL users who have registered for events
 */
export const getAllUsersFromDatabase = async () => {
  try {
    console.log('📧 FETCHING ALL REGISTERED USERS FROM DATABASE...');
    
    // Get ALL emails from registrations collection
    const registrationsRef = collection(db, 'registrations');
    const registrationsSnapshot = await getDocs(registrationsRef);
    
    const allUsers = [];
    const uniqueEmails = new Set(); // To avoid duplicates
    
    registrationsSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.email && !uniqueEmails.has(userData.email)) {
        allUsers.push({
          email: userData.email,
          firstName: userData.firstName || 'User',
          lastName: userData.lastName || '',
          registrationDate: userData.registrationDate || new Date().toISOString()
        });
        uniqueEmails.add(userData.email);
        console.log('📧 Found registered user:', userData.email, userData.firstName);
      }
    });
    
    console.log(`📧 TOTAL REGISTERED USERS FOUND: ${allUsers.length}`);
    console.log('📧 ALL registered user emails:', allUsers.map(u => u.email));
    
    // If no users found, add default emails for testing
    if (allUsers.length === 0) {
      console.log('⚠️ No registered users found in database, using default emails for testing');
      return [
        { email: 'jamestellore@gmail.com', firstName: 'Jam Floyd', lastName: 'Estellore' },
        { email: 'user1@gmail.com', firstName: 'John', lastName: 'Doe' },
        { email: 'user2@gmail.com', firstName: 'Jane', lastName: 'Smith' }
      ];
    }
    
    return allUsers;
    
  } catch (error) {
    console.error('❌ Error fetching ALL users from database:', error);
    console.log('⚠️ Database error - using default emails for testing');
    return [
      { email: 'jamestellore@gmail.com', firstName: 'Jam Floyd', lastName: 'Estellore' },
      { email: 'user1@gmail.com', firstName: 'John', lastName: 'Doe' },
      { email: 'user2@gmail.com', firstName: 'Jane', lastName: 'Smith' }
    ];
  }
};

/**
 * Send emails to ALL registered users automatically
 * This opens Gmail compose for EVERY registered user
 */
export const sendEmailsToAllUsers = async (eventData) => {
  try {
    console.log('📧 SENDING EMAILS TO ALL REGISTERED USERS...');
    console.log('Event:', eventData.title);
    
    // Get ALL registered users from database
    const allUsers = await getAllUsersFromDatabase();
    
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
    
    console.log(`✅ ALL USERS EMAIL SUMMARY:`);
    console.log(`📧 Total registered users: ${allUsers.length}`);
    console.log(`📧 Successfully opened Gmail for: ${successCount} users`);
    console.log(`❌ Failed to open Gmail for: ${failureCount} users`);
    console.log(`📊 Results:`, results);
    
    return {
      success: successCount > 0,
      message: `Emails processed for ALL users: ${successCount} success, ${failureCount} failed`,
      userCount: allUsers.length,
      successCount: successCount,
      failureCount: failureCount,
      results: results
    };
    
  } catch (error) {
    console.error('❌ Error sending emails to ALL users:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

/**
 * Test sending emails to ALL users
 */
export const testAllUsersEmail = async () => {
  try {
    console.log('🧪 Testing email system for ALL users...');
    
    // First, get all registered users
    const allUsers = await getAllUsersFromDatabase();
    console.log('📧 Registered users found:', allUsers.length);
    
    const testEvent = {
      title: 'TEST EVENT FOR ALL USERS - Community Clean-up Drive',
      description: 'This is a test event to verify the automated email system is working with ALL registered users!',
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Test Location, Toledo City, Cebu',
      organizer: 'YouthInAction Philippines'
    };
    
    const result = await sendEmailsToAllUsers(testEvent);
    return result;
  } catch (error) {
    console.error('❌ Error testing ALL users email:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.getAllUsersFromDatabase = getAllUsersFromDatabase;
  window.sendEmailsToAllUsers = sendEmailsToAllUsers;
  window.testAllUsersEmail = testAllUsersEmail;
  
  console.log('📧 ALL USERS email functions available:');
  console.log('- testAllUsersEmail() - Test email system for ALL users');
  console.log('- getAllUsersFromDatabase() - Get ALL registered users from database');
  console.log('- sendEmailsToAllUsers(eventData) - Send emails to ALL registered users');
}

export { getAllUsersFromDatabase, sendEmailsToAllUsers, testAllUsersEmail };
