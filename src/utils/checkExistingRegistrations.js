// checkExistingRegistrations.js
// Utility to check existing registrations and their status

import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Check all existing registrations in the database
 */
export const checkAllRegistrations = async () => {
  try {
    console.log('🔍 Checking all existing registrations...');
    
    const registrationsRef = collection(db, 'registrations');
    const q = query(registrationsRef, orderBy('registrationDate', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    
    const registrations = [];
    snapshot.forEach((doc) => {
      registrations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`📊 Found ${registrations.length} registrations:`);
    registrations.forEach((reg, index) => {
      console.log(`${index + 1}. ${reg.firstName} ${reg.lastName} - ${reg.eventTitle} (${reg.status})`);
    });
    
    // Group by status
    const statusCounts = registrations.reduce((acc, reg) => {
      acc[reg.status] = (acc[reg.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📈 Status breakdown:', statusCounts);
    
    return {
      success: true,
      total: registrations.length,
      registrations: registrations,
      statusCounts: statusCounts
    };
  } catch (error) {
    console.error('❌ Error checking registrations:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Check registrations for a specific event
 */
export const checkEventRegistrations = async (eventId) => {
  try {
    console.log(`🔍 Checking registrations for event: ${eventId}`);
    
    const registrationsRef = collection(db, 'registrations');
    const q = query(registrationsRef, where('eventId', '==', eventId));
    const snapshot = await getDocs(q);
    
    const registrations = [];
    snapshot.forEach((doc) => {
      registrations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`📊 Found ${registrations.length} registrations for event ${eventId}:`);
    registrations.forEach((reg, index) => {
      console.log(`${index + 1}. ${reg.firstName} ${reg.lastName} (${reg.status})`);
    });
    
    return {
      success: true,
      eventId: eventId,
      total: registrations.length,
      registrations: registrations
    };
  } catch (error) {
    console.error('❌ Error checking event registrations:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Get registration statistics
 */
export const getRegistrationStats = async () => {
  try {
    const result = await checkAllRegistrations();
    if (!result.success) return result;
    
    const stats = {
      total: result.total,
      byStatus: result.statusCounts,
      pending: result.statusCounts.pending || 0,
      approved: result.statusCounts.approved || 0,
      rejected: result.statusCounts.rejected || 0,
      cancelled: result.statusCounts.cancelled || 0
    };
    
    console.log('📊 Registration Statistics:', stats);
    return { success: true, stats: stats };
  } catch (error) {
    console.error('❌ Error getting registration stats:', error);
    return { success: false, message: error.message };
  }
};


