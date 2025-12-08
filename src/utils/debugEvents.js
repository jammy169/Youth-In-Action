// Debug utility to check events in database
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Debug function to check all events in database
 */
export const debugAllEvents = async () => {
  try {
    console.log('🔍 Debugging all events in database...');
    
    const eventsRef = collection(db, 'events');
    const querySnapshot = await getDocs(eventsRef);
    
    console.log('📊 Total events in database:', querySnapshot.docs.length);
    
    if (querySnapshot.docs.length === 0) {
      console.log('❌ No events found in database!');
      return { success: false, count: 0, events: [] };
    }
    
    const events = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`📅 Event: ${data.title || 'Untitled'} (ID: ${doc.id})`);
      console.log(`   - Status: ${data.status || 'undefined'}`);
      console.log(`   - Start: ${data.startDateTime || data.startTime || data.date || 'undefined'}`);
      console.log(`   - Category: ${data.category || 'undefined'}`);
      console.log(`   - Location: ${data.location || 'undefined'}`);
      console.log('---');
      
      return {
        id: doc.id,
        ...data
      };
    });
    
    console.log('✅ Debug complete!');
    return { success: true, count: events.length, events };
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Test the events service functions
 */
export const testEventsService = async () => {
  try {
    console.log('🧪 Testing events service functions...');
    
    // Import the service functions
    const { fetchAllEvents, getPublicEvents, getUserEvents } = await import('./eventsService');
    
    console.log('📋 Testing fetchAllEvents...');
    const allEvents = await fetchAllEvents(true); // Include inactive
    console.log('All events:', allEvents.length);
    
    console.log('🌐 Testing getPublicEvents...');
    const publicEvents = await getPublicEvents('ALL');
    console.log('Public events:', publicEvents.length);
    
    console.log('👤 Testing getUserEvents...');
    const userEvents = await getUserEvents('ALL');
    console.log('User events:', userEvents.length);
    
    return {
      success: true,
      allEvents: allEvents.length,
      publicEvents: publicEvents.length,
      userEvents: userEvents.length
    };
    
  } catch (error) {
    console.error('❌ Events service test failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if events have required fields
 */
export const validateEventStructure = async () => {
  try {
    console.log('🔍 Validating event structure...');
    
    const { debugAllEvents } = await import('./debugEvents');
    const result = await debugAllEvents();
    
    if (!result.success) {
      return result;
    }
    
    const events = result.events;
    const issues = [];
    
    events.forEach((event, index) => {
      if (!event.title) issues.push(`Event ${index}: Missing title`);
      if (!event.startDateTime && !event.startTime && !event.date) {
        issues.push(`Event ${index}: Missing start date/time`);
      }
      if (!event.location) issues.push(`Event ${index}: Missing location`);
      if (!event.description) issues.push(`Event ${index}: Missing description`);
      if (!event.category) issues.push(`Event ${index}: Missing category`);
    });
    
    if (issues.length > 0) {
      console.log('⚠️ Event structure issues found:');
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('✅ All events have required fields');
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

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  window.debugAllEvents = debugAllEvents;
  window.testEventsService = testEventsService;
  window.validateEventStructure = validateEventStructure;
}

export default {
  debugAllEvents,
  testEventsService,
  validateEventStructure
};














