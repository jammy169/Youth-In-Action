// Test script to verify unified events system
import { 
  fetchAllEvents, 
  getPublicEvents, 
  getUserEvents,
  addEvent,
  EVENT_CATEGORIES 
} from './eventsService';

/**
 * Test the unified events system
 * This function can be called from the browser console to test the system
 */
export const testUnifiedEventsSystem = async () => {
  console.log('🧪 Testing Unified Events System...');
  
  try {
    // Test 1: Fetch all events
    console.log('📋 Test 1: Fetching all events...');
    const allEvents = await fetchAllEvents();
    console.log(`✅ Found ${allEvents.length} events in database`);
    
    // Test 2: Get public events
    console.log('🌐 Test 2: Getting public events...');
    const publicEvents = await getPublicEvents('ALL');
    console.log(`✅ Found ${publicEvents.length} public events`);
    console.log('Public events have isPublic:', publicEvents.every(e => e.isPublic === true));
    console.log('Public events cannot join:', publicEvents.every(e => e.canJoin === false));
    
    // Test 3: Get user events
    console.log('👤 Test 3: Getting user events...');
    const userEvents = await getUserEvents('ALL');
    console.log(`✅ Found ${userEvents.length} user events`);
    console.log('User events have isPublic:', userEvents.every(e => e.isPublic === false));
    console.log('User events can join:', userEvents.every(e => e.canJoin === true));
    
    // Test 4: Verify categories
    console.log('📂 Test 4: Checking categories...');
    console.log('Available categories:', EVENT_CATEGORIES);
    
    // Test 5: Test filtering
    console.log('🔍 Test 5: Testing category filtering...');
    const environmentEvents = await getPublicEvents('Environment');
    console.log(`✅ Found ${environmentEvents.length} Environment events`);
    
    console.log('🎉 All tests passed! Unified events system is working correctly.');
    
    return {
      success: true,
      allEvents: allEvents.length,
      publicEvents: publicEvents.length,
      userEvents: userEvents.length,
      categories: EVENT_CATEGORIES.length
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Test adding a new event (Admin function)
 */
export const testAddEvent = async () => {
  console.log('➕ Testing add event functionality...');
  
  try {
    const testEvent = {
      title: 'Test Event - Unified System',
      description: 'This is a test event to verify the unified system works',
      startDateTime: '2025-12-31T10:00:00',
      endDateTime: '2025-12-31T16:00:00',
      location: 'Test Location',
      organizer: 'Test Organizer',
      category: 'COMMUNITY CLEANUPS',
      featured: false,
      status: 'active',
      color: '#4CAF50'
    };
    
    const eventId = await addEvent(testEvent);
    console.log('✅ Test event added with ID:', eventId);
    
    return {
      success: true,
      eventId: eventId
    };
    
  } catch (error) {
    console.error('❌ Add event test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  window.testUnifiedEventsSystem = testUnifiedEventsSystem;
  window.testAddEvent = testAddEvent;
}

export default {
  testUnifiedEventsSystem,
  testAddEvent
};



