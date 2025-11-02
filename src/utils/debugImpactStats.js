// debugImpactStats.js
// Debug version to help understand why statistics are showing 0

import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

/**
 * Debug version of impact statistics calculation
 * This will help you understand what data exists in your database
 */
export const debugImpactStats = async () => {
  console.log('🔍 DEBUG: Starting impact statistics calculation...');
  
  try {
    // Check what collections exist
    console.log('📋 Checking available collections...');
    
    // 1. Check events collection
    console.log('📅 Checking events collection...');
    try {
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`✅ Found ${events.length} events:`, events);
      
      if (events.length > 0) {
        console.log('📍 Event locations:', events.map(e => e.location));
        console.log('🏷️ Event categories:', events.map(e => e.category));
      }
    } catch (error) {
      console.error('❌ Error fetching events:', error);
    }

    // 2. Check registrations collection
    console.log('📝 Checking registrations collection...');
    try {
      const registrationsSnapshot = await getDocs(collection(db, 'registrations'));
      const registrations = registrationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`✅ Found ${registrations.length} registrations:`, registrations);
      
      if (registrations.length > 0) {
        console.log('📧 Registration emails:', registrations.map(r => r.email));
        console.log('📊 Registration statuses:', registrations.map(r => r.status));
      }
    } catch (error) {
      console.error('❌ Error fetching registrations:', error);
    }

    // 3. Check eventRegistrations collection
    console.log('📝 Checking eventRegistrations collection...');
    try {
      const eventRegistrationsSnapshot = await getDocs(collection(db, 'eventRegistrations'));
      const eventRegistrations = eventRegistrationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`✅ Found ${eventRegistrations.length} event registrations:`, eventRegistrations);
      
      if (eventRegistrations.length > 0) {
        console.log('📧 Event registration emails:', eventRegistrations.map(r => r.email));
        console.log('📊 Event registration statuses:', eventRegistrations.map(r => r.status));
      }
    } catch (error) {
      console.error('❌ Error fetching eventRegistrations:', error);
    }

    // 4. Check users collection
    console.log('👥 Checking users collection...');
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`✅ Found ${users.length} users:`, users);
      
      if (users.length > 0) {
        console.log('📧 User emails:', users.map(u => u.email));
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
    }

    // 5. Check userProfiles collection
    console.log('👤 Checking userProfiles collection...');
    try {
      const userProfilesSnapshot = await getDocs(collection(db, 'userProfiles'));
      const userProfiles = userProfilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`✅ Found ${userProfiles.length} user profiles:`, userProfiles);
    } catch (error) {
      console.error('❌ Error fetching userProfiles:', error);
    }

    console.log('🔍 DEBUG: Impact statistics calculation complete!');
    console.log('💡 If you see 0 for Active Volunteers, it means:');
    console.log('   - No registrations exist in "registrations" collection');
    console.log('   - No registrations exist in "eventRegistrations" collection');
    console.log('   - Users need to register for events to be counted as volunteers');

  } catch (error) {
    console.error('❌ DEBUG: Error in impact statistics calculation:', error);
  }
};

/**
 * Quick test to see if any data exists
 */
export const quickDataCheck = async () => {
  console.log('🚀 Quick data check...');
  
  const collections = ['events', 'registrations', 'eventRegistrations', 'users', 'userProfiles'];
  const results = {};
  
  for (const collectionName of collections) {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      results[collectionName] = snapshot.docs.length;
      console.log(`📊 ${collectionName}: ${snapshot.docs.length} documents`);
    } catch (error) {
      results[collectionName] = 'ERROR';
      console.log(`❌ ${collectionName}: ERROR - ${error.message}`);
    }
  }
  
  return results;
};




