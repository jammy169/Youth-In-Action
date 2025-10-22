// impactStats.js
// Utility functions for calculating real impact statistics from the database

import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

/**
 * Calculate real impact statistics from the database
 * @returns {Promise<Object>} Object containing calculated statistics
 */
export const calculateImpactStats = async () => {
  try {
    console.log('🔄 Calculating impact statistics...');
    
    // Initialize stats object
    const stats = {
      activeVolunteers: 0,
      eventsHosted: 0,
      communitiesServed: 0,
      totalServiceHours: 0,
      pendingRegistrations: 0,
      approvedRegistrations: 0,
      attendedEvents: 0
    };

    // Get all events
    const eventsSnapshot = await getDocs(collection(db, 'events'));
    const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    stats.eventsHosted = events.length;

    // Get unique communities from events (based on location)
    const uniqueCommunities = new Set(events.map(event => event.location?.split(',')[0]?.trim() || 'Unknown'));
    stats.communitiesServed = uniqueCommunities.size;

    // Get all registrations from both possible collections
    const registrationCollections = ['registrations', 'eventRegistrations'];
    let allRegistrations = [];

    for (const collectionName of registrationCollections) {
      try {
        const registrationsSnapshot = await getDocs(collection(db, collectionName));
        const registrations = registrationsSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          collection: collectionName,
          ...doc.data() 
        }));
        allRegistrations = [...allRegistrations, ...registrations];
      } catch (error) {
        console.log(`⚠️ Could not fetch from ${collectionName}:`, error.message);
      }
    }

    console.log(`📊 Found ${allRegistrations.length} total registrations`);

    // Calculate volunteer statistics
    const uniqueVolunteers = new Set();
    let totalServiceHours = 0;
    let pendingCount = 0;
    let approvedCount = 0;
    let attendedCount = 0;

    allRegistrations.forEach(registration => {
      // Count unique volunteers (by email)
      if (registration.email) {
        uniqueVolunteers.add(registration.email);
      }

      // Count by status
      switch (registration.status) {
        case 'pending':
          pendingCount++;
          break;
        case 'approved':
          approvedCount++;
          break;
        case 'attended':
          attendedCount++;
          // Add service hours for attended events
          if (registration.serviceHours && typeof registration.serviceHours === 'number') {
            totalServiceHours += registration.serviceHours;
          }
          break;
      }
    });

    stats.activeVolunteers = uniqueVolunteers.size;
    stats.pendingRegistrations = pendingCount;
    stats.approvedRegistrations = approvedCount;
    stats.attendedEvents = attendedCount;
    stats.totalServiceHours = totalServiceHours;

    console.log('✅ Calculated statistics:', stats);
    return stats;

  } catch (error) {
    console.error('❌ Error calculating impact statistics:', error);
    
    // Return default stats if calculation fails
    return {
      activeVolunteers: 0,
      eventsHosted: 0,
      communitiesServed: 0,
      totalServiceHours: 0,
      pendingRegistrations: 0,
      approvedRegistrations: 0,
      attendedEvents: 0
    };
  }
};

/**
 * Get formatted statistics for display
 * @param {Object} stats - Raw statistics object
 * @returns {Object} Formatted statistics for UI display
 */
export const formatStatsForDisplay = (stats) => {
  return {
    activeVolunteers: stats.activeVolunteers > 0 ? `${stats.activeVolunteers}+` : '0',
    eventsHosted: stats.eventsHosted > 0 ? `${stats.eventsHosted}+` : '0',
    communitiesServed: stats.communitiesServed > 0 ? `${stats.communitiesServed}+` : '0',
    totalServiceHours: stats.totalServiceHours,
    pendingRegistrations: stats.pendingRegistrations,
    approvedRegistrations: stats.approvedRegistrations,
    attendedEvents: stats.attendedEvents
  };
};

/**
 * Get additional detailed statistics for admin dashboard
 * @param {Object} stats - Raw statistics object
 * @returns {Object} Additional statistics for admin use
 */
export const getDetailedStats = (stats) => {
  return {
    ...stats,
    attendanceRate: stats.approvedRegistrations > 0 
      ? Math.round((stats.attendedEvents / stats.approvedRegistrations) * 100) 
      : 0,
    averageServiceHours: stats.attendedEvents > 0 
      ? Math.round(stats.totalServiceHours / stats.attendedEvents * 10) / 10 
      : 0
  };
};


