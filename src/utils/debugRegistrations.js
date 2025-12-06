// Debug utility to check registrations in database
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Debug function to check all registrations in database
 */
export const debugAllRegistrations = async () => {
  try {
    console.log('🔍 Debugging all registrations in database...');
    
    const collections = ['registrations', 'eventRegistrations'];
    let totalRegistrations = 0;
    let allRegistrations = [];
    
    for (const collectionName of collections) {
      try {
        console.log(`📋 Checking collection: ${collectionName}`);
        const registrationsRef = collection(db, collectionName);
        const querySnapshot = await getDocs(registrationsRef);
        
        const registrations = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log(`📅 Registration: ${data.firstName || 'Unknown'} ${data.lastName || 'Unknown'} (ID: ${doc.id})`);
          console.log(`   - Event: ${data.eventTitle || 'Unknown'}`);
          console.log(`   - Status: ${data.status || 'undefined'}`);
          console.log(`   - Email: ${data.email || 'undefined'}`);
          console.log(`   - Date: ${data.registrationDate || 'undefined'}`);
          console.log('---');
          
          return {
            id: doc.id,
            collection: collectionName,
            ...data
          };
        });
        
        console.log(`✅ Found ${registrations.length} registrations in ${collectionName}`);
        allRegistrations = [...allRegistrations, ...registrations];
        totalRegistrations += registrations.length;
        
      } catch (error) {
        console.log(`⚠️ Error fetching from ${collectionName}:`, error);
      }
    }
    
    console.log(`📊 Total registrations found: ${totalRegistrations}`);
    
    if (totalRegistrations === 0) {
      console.log('❌ No registrations found in any collection!');
      console.log('💡 This could mean:');
      console.log('   - No users have registered for events yet');
      console.log('   - Registrations are stored in a different collection');
      console.log('   - There are permission issues');
    }
    
    return { 
      success: true, 
      total: totalRegistrations, 
      registrations: allRegistrations,
      collections: collections
    };
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check registration structure and required fields
 */
export const validateRegistrationStructure = async () => {
  try {
    console.log('🔍 Validating registration structure...');
    
    const result = await debugAllRegistrations();
    
    if (!result.success || result.total === 0) {
      return result;
    }
    
    const registrations = result.registrations;
    const issues = [];
    
    registrations.forEach((registration, index) => {
      if (!registration.firstName) issues.push(`Registration ${index}: Missing firstName`);
      if (!registration.lastName) issues.push(`Registration ${index}: Missing lastName`);
      if (!registration.email) issues.push(`Registration ${index}: Missing email`);
      if (!registration.eventId) issues.push(`Registration ${index}: Missing eventId`);
      if (!registration.status) issues.push(`Registration ${index}: Missing status`);
      if (!registration.registrationDate) issues.push(`Registration ${index}: Missing registrationDate`);
    });
    
    if (issues.length > 0) {
      console.log('⚠️ Registration structure issues found:');
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('✅ All registrations have required fields');
    }
    
    return {
      success: true,
      issues: issues.length,
      problems: issues
    };
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Test admin registration access
 */
export const testAdminRegistrationAccess = async () => {
  try {
    console.log('🧪 Testing admin registration access...');
    
    const result = await debugAllRegistrations();
    
    if (result.success && result.total > 0) {
      console.log('✅ Admin can access registrations');
      console.log(`📊 Found ${result.total} registrations across ${result.collections.length} collections`);
      
      // Group by status
      const statusCounts = {};
      result.registrations.forEach(reg => {
        const status = reg.status || 'unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      
      console.log('📈 Registration status breakdown:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   - ${status}: ${count}`);
      });
      
    } else {
      console.log('❌ No registrations found or access denied');
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Admin access test failed:', error);
    return { success: false, error: error.message };
  }
};

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  window.debugAllRegistrations = debugAllRegistrations;
  window.validateRegistrationStructure = validateRegistrationStructure;
  window.testAdminRegistrationAccess = testAdminRegistrationAccess;
}

export default {
  debugAllRegistrations,
  validateRegistrationStructure,
  testAdminRegistrationAccess
};













