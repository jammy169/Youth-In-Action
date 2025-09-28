// Unified Events Service
// This service handles all event operations for both public and user pages
import { db } from '../firebaseConfig';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot 
} from 'firebase/firestore';

/**
 * Events Service - Single source of truth for all event operations
 * Handles both public (read-only) and user (with actions) event displays
 */

// Event categories for filtering
export const EVENT_CATEGORIES = [
  'ALL',
  'COMMUNITY CLEANUPS',
  'SOCIAL SERVICE', 
  'COMMUNITY DEVELOPMENT',
  'Environment',
  'Health',
  'Education'
];

// Default event structure
export const DEFAULT_EVENT = {
  title: '',
  description: '',
  startDateTime: '',
  endDateTime: '',
  location: '',
  organizer: '',
  image: '',
  category: 'COMMUNITY CLEANUPS',
  featured: false,
  status: 'active',
  color: '#4CAF50'
};

/**
 * Fetch all events from Firebase
 * @param {boolean} includeInactive - Whether to include inactive events
 * @returns {Promise<Array>} Array of events
 */
export const fetchAllEvents = async (includeInactive = false) => {
  try {
    const eventsRef = collection(db, 'events');
    let q;
    
    if (!includeInactive) {
      // Try to filter by status first
      try {
        q = query(eventsRef, where('status', '==', 'active'), orderBy('startDateTime', 'asc'));
        const querySnapshot = await getDocs(q);
        const events = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched active events from database:', events.length);
        return events;
      } catch (statusError) {
        console.log('Status filter failed, fetching all events:', statusError);
        // Fallback: fetch all events and filter in JavaScript
        q = query(eventsRef, orderBy('startDateTime', 'asc'));
        const querySnapshot = await getDocs(q);
        const allEvents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Filter active events in JavaScript
        const activeEvents = allEvents.filter(event => 
          event.status === 'active' || event.status === undefined || event.status === null
        );
        console.log('Fetched all events and filtered to active:', activeEvents.length);
        return activeEvents;
      }
    } else {
      q = query(eventsRef, orderBy('startDateTime', 'asc'));
      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched all events from database:', events.length);
      return events;
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Fetch events with real-time updates
 * @param {Function} callback - Callback function to handle updates
 * @param {boolean} includeInactive - Whether to include inactive events
 * @returns {Function} Unsubscribe function
 */
export const subscribeToEvents = (callback, includeInactive = false) => {
  const eventsRef = collection(db, 'events');
  let q;
  
  if (!includeInactive) {
    try {
      q = query(eventsRef, where('status', '==', 'active'), orderBy('startDateTime', 'asc'));
    } catch (error) {
      console.log('Status filter failed in subscription, using fallback:', error);
      q = query(eventsRef, orderBy('startDateTime', 'asc'));
    }
  } else {
    q = query(eventsRef, orderBy('startDateTime', 'asc'));
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // If we couldn't filter by status in the query, filter in JavaScript
    if (!includeInactive) {
      const activeEvents = events.filter(event => 
        event.status === 'active' || event.status === undefined || event.status === null
      );
      callback(activeEvents);
    } else {
      callback(events);
    }
  }, (error) => {
    console.error('Error in events subscription:', error);
    callback([]);
  });
};

/**
 * Fetch a single event by ID
 * @param {string} eventId - Event ID
 * @returns {Promise<Object|null>} Event object or null
 */
export const fetchEventById = async (eventId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (eventSnap.exists()) {
      return {
        id: eventSnap.id,
        ...eventSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

/**
 * Filter events by category
 * @param {Array} events - Array of events
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered events
 */
export const filterEventsByCategory = (events, category) => {
  if (category === 'ALL' || !category) {
    return events;
  }
  return events.filter(event => event.category === category);
};

/**
 * Get events for public display (read-only)
 * @param {string} category - Category filter
 * @returns {Promise<Array>} Public events
 */
export const getPublicEvents = async (category = 'ALL') => {
  try {
    const events = await fetchAllEvents();
    const filteredEvents = filterEventsByCategory(events, category);
    
    // Add public-specific properties
    return filteredEvents.map(event => ({
      ...event,
      isPublic: true,
      canJoin: false, // Public users cannot join
      showActions: false
    }));
  } catch (error) {
    console.error('Error fetching public events:', error);
    return [];
  }
};

/**
 * Get events for user display (with actions)
 * @param {string} category - Category filter
 * @returns {Promise<Array>} User events with actions
 */
export const getUserEvents = async (category = 'ALL') => {
  try {
    const events = await fetchAllEvents();
    const filteredEvents = filterEventsByCategory(events, category);
    
    // Add user-specific properties
    return filteredEvents.map(event => ({
      ...event,
      isPublic: false,
      canJoin: true, // Users can join events
      showActions: true
    }));
  } catch (error) {
    console.error('Error fetching user events:', error);
    return [];
  }
};

/**
 * Get real-time public events subscription
 * @param {Function} callback - Callback for updates
 * @param {string} category - Category filter
 * @returns {Function} Unsubscribe function
 */
export const subscribeToPublicEvents = (callback, category = 'ALL') => {
  return subscribeToEvents((events) => {
    const filteredEvents = filterEventsByCategory(events, category);
    const publicEvents = filteredEvents.map(event => ({
      ...event,
      isPublic: true,
      canJoin: false,
      showActions: false
    }));
    callback(publicEvents);
  });
};

/**
 * Get real-time user events subscription
 * @param {Function} callback - Callback for updates
 * @param {string} category - Category filter
 * @returns {Function} Unsubscribe function
 */
export const subscribeToUserEvents = (callback, category = 'ALL') => {
  return subscribeToEvents((events) => {
    const filteredEvents = filterEventsByCategory(events, category);
    const userEvents = filteredEvents.map(event => ({
      ...event,
      isPublic: false,
      canJoin: true,
      showActions: true
    }));
    callback(userEvents);
  });
};

/**
 * Add a new event (Admin only)
 * @param {Object} eventData - Event data
 * @returns {Promise<string>} Event ID
 */
export const addEvent = async (eventData) => {
  try {
    const eventsRef = collection(db, 'events');
    const docRef = await addDoc(eventsRef, {
      ...DEFAULT_EVENT,
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Event added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

/**
 * Update an event (Admin only)
 * @param {string} eventId - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<void>}
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: new Date()
    });
    console.log('Event updated:', eventId);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

/**
 * Delete an event (Admin only)
 * @param {string} eventId - Event ID
 * @returns {Promise<void>}
 */
export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
    console.log('Event deleted:', eventId);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

/**
 * Get category icon for display
 * @param {string} category - Event category
 * @returns {string} Icon emoji
 */
export const getCategoryIcon = (category) => {
  const iconMap = {
    'Environment': '🌱',
    'Health': '❤️',
    'Education': '📚',
    'COMMUNITY CLEANUPS': '🧹',
    'SOCIAL SERVICE': '🤝',
    'COMMUNITY DEVELOPMENT': '🏘️'
  };
  return iconMap[category] || '🎯';
};

/**
 * Format event date for display
 * @param {string} startDateTime - Start date/time
 * @param {string} endDateTime - End date/time
 * @returns {string} Formatted date string
 */
export const formatEventDate = (startDateTime, endDateTime) => {
  if (!startDateTime) return 'Date TBD';
  
  const start = new Date(startDateTime);
  const end = endDateTime ? new Date(endDateTime) : null;
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  if (end && start.toDateString() !== end.toDateString()) {
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }
  
  return start.toLocaleDateString('en-US', options);
};

export default {
  fetchAllEvents,
  subscribeToEvents,
  fetchEventById,
  filterEventsByCategory,
  getPublicEvents,
  getUserEvents,
  subscribeToPublicEvents,
  subscribeToUserEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getCategoryIcon,
  formatEventDate,
  EVENT_CATEGORIES,
  DEFAULT_EVENT
};
