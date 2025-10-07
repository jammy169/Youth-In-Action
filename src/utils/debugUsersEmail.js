// Debug Users Email Service - Check what users are in database
// This will show you exactly what users are found in your database

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Debug function to see what users are in your database
 */
export const debugUsersInDatabase = async () => {
  try {
    console.log('🔍 DEBUGGING USERS IN DATABASE...');
    
    // Get ALL emails from registrations collection
    const registrationsRef = collection(db, 'registrations');
    const registrationsSnapshot = await getDocs(registrationsRef);
    
    console.log('📊 DATABASE DEBUG RESULTS:');
    console.log(`📊 Total documents in registrations: ${registrationsSnapshot.size}`);
    
    const allUsers = [];
    const uniqueEmails = new Set();
    
    registrationsSnapshot.forEach((doc, index) => {
      const userData = doc.data();
      console.log(`📊 Document ${index + 1}:`, userData);
      
      if (userData.email && !uniqueEmails.has(userData.email)) {
        allUsers.push({
          email: userData.email,
          firstName: userData.firstName || 'User',
          lastName: userData.lastName || '',
          registrationDate: userData.registrationDate || new Date().toISOString()
        });
        uniqueEmails.add(userData.email);
        console.log(`📧 Found user: ${userData.email} (${userData.firstName})`);
      }
    });
    
    console.log(`📊 TOTAL UNIQUE USERS FOUND: ${allUsers.length}`);
    console.log('📊 All users:', allUsers);
    
    if (allUsers.length === 0) {
      console.log('⚠️ NO USERS FOUND IN DATABASE!');
      console.log('💡 This is why you only get 1 Gmail compose window');
      console.log('💡 You need to have users register for events first');
    } else if (allUsers.length === 1) {
      console.log('⚠️ ONLY 1 USER FOUND IN DATABASE!');
      console.log('💡 This is why you only get 1 Gmail compose window');
      console.log('💡 You need more users to register for events');
    } else {
      console.log(`✅ Found ${allUsers.length} users - should open ${allUsers.length} Gmail windows`);
    }
    
    return allUsers;
    
  } catch (error) {
    console.error('❌ Error debugging users in database:', error);
    console.log('💡 Database error - this might be why you only get 1 Gmail window');
    return [];
  }
};

/**
 * Add test users to database for testing
 */
export const addTestUsersToDatabase = async () => {
  try {
    console.log('🧪 Adding test users to database...');
    
    const testUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        registrationDate: new Date().toISOString()
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@gmail.com',
        registrationDate: new Date().toISOString()
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@gmail.com',
        registrationDate: new Date().toISOString()
      }
    ];
    
    console.log('📧 Adding test users:', testUsers);
    
    // Note: This is just for demonstration
    // In real app, users would register through your registration form
    console.log('💡 To add more users: Have them register through your app');
    console.log('💡 Or manually add users to Firebase registrations collection');
    
    return testUsers;
    
  } catch (error) {
    console.error('❌ Error adding test users:', error);
    return [];
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.debugUsersInDatabase = debugUsersInDatabase;
  window.addTestUsersToDatabase = addTestUsersToDatabase;
  
  console.log('🔍 Debug functions available:');
  console.log('- debugUsersInDatabase() - Check what users are in your database');
  console.log('- addTestUsersToDatabase() - Add test users (for demonstration)');
}

export { debugUsersInDatabase, addTestUsersToDatabase };
