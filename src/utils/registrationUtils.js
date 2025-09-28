// registrationUtils.js
// Utility functions for checking user registration status

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { VOLUNTEER_STATUS } from './volunteerStatusUtils';

/**
 * Check if user has already registered for an event
 * @param {string} eventId - The event ID to check
 * @param {string} userId - The user ID to check (optional, uses current user if not provided)
 * @returns {Promise<Object|null>} - Registration object if found, null if not registered
 */
export const checkUserRegistration = async (eventId, userId = null) => {
  try {
    const auth = getAuth();
    const currentUserId = userId || auth.currentUser?.uid;
    const userEmail = auth.currentUser?.email;
    
    if (!currentUserId || !userEmail) {
      console.log('No authenticated user or email');
      return null;
    }

    console.log('Checking registration for event:', eventId, 'user:', currentUserId, 'email:', userEmail);

    // Query registrations collection for this user and event
    // Using the same approach as Profile.jsx - get all registrations and filter client-side
    const registrationsRef = collection(db, 'registrations');
    const q = query(registrationsRef);
    const querySnapshot = await getDocs(q);
    
    console.log('Total registrations found:', querySnapshot.docs.length);
    
    // Filter by eventId and user email (since userId might not be set in older registrations)
    const userRegistrations = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(registration => {
        const matchesEvent = registration.eventId === eventId;
        const matchesUser = registration.userId === currentUserId || registration.email === userEmail;
        return matchesEvent && matchesUser;
      });
    
    console.log('Filtered user registrations for this event:', userRegistrations);
    
    if (userRegistrations.length === 0) {
      console.log('User has not registered for this event');
      return null;
    }
    
    // Get the first (and should be only) registration
    const registration = userRegistrations[0];
    console.log('User registration found:', registration);
    return registration;
  } catch (error) {
    console.error('Error checking user registration:', error);
    return null;
  }
};

/**
 * Get user registration status for display
 * @param {Object} registration - Registration object from checkUserRegistration
 * @returns {Object} - Status display information
 */
export const getUserRegistrationStatus = (registration) => {
  if (!registration) {
    return {
      isRegistered: false,
      status: 'not_registered',
      message: 'Not Registered',
      buttonText: 'Join Now',
      buttonClass: 'register-enabled',
      canRegister: true,
      icon: '📅',
      color: '#4CAF50'
    };
  }

  const status = registration.status || 'pending';
  
  switch (status) {
    case VOLUNTEER_STATUS.PENDING:
      return {
        isRegistered: true,
        status: 'pending',
        message: 'Registration Pending Review',
        buttonText: 'Pending Review',
        buttonClass: 'register-pending',
        canRegister: false,
        icon: '⏳',
        color: '#FF9800'
      };
    
    case VOLUNTEER_STATUS.APPROVED:
      return {
        isRegistered: true,
        status: 'approved',
        message: 'Registration Approved - You can attend!',
        buttonText: 'Approved ✓',
        buttonClass: 'register-approved',
        canRegister: false,
        icon: '✅',
        color: '#4CAF50'
      };
    
    case VOLUNTEER_STATUS.ATTENDED:
      return {
        isRegistered: true,
        status: 'attended',
        message: 'You attended this event!',
        buttonText: 'Attended ✓',
        buttonClass: 'register-attended',
        canRegister: false,
        icon: '🎉',
        color: '#28a745'
      };
    
    case VOLUNTEER_STATUS.ABSENT:
      return {
        isRegistered: true,
        status: 'absent',
        message: 'You were marked absent',
        buttonText: 'Absent',
        buttonClass: 'register-absent',
        canRegister: false,
        icon: '❌',
        color: '#dc3545'
      };
    
    case VOLUNTEER_STATUS.REJECTED:
      return {
        isRegistered: true,
        status: 'rejected',
        message: 'Registration was rejected',
        buttonText: 'Rejected',
        buttonClass: 'register-rejected',
        canRegister: false,
        icon: '❌',
        color: '#dc3545'
      };
    
    default:
      return {
        isRegistered: true,
        status: 'unknown',
        message: 'Registration status unknown',
        buttonText: 'Unknown Status',
        buttonClass: 'register-unknown',
        canRegister: false,
        icon: '❓',
        color: '#6c757d'
      };
  }
};

/**
 * Check if user can register for an event
 * @param {string} eventId - The event ID
 * @param {string} userId - The user ID (optional)
 * @returns {Promise<Object>} - Registration status and eligibility
 */
export const checkRegistrationEligibility = async (eventId, userId = null) => {
  try {
    const registration = await checkUserRegistration(eventId, userId);
    const statusInfo = getUserRegistrationStatus(registration);
    
    return {
      ...statusInfo,
      registration: registration,
      canRegister: statusInfo.canRegister && !statusInfo.isRegistered
    };
  } catch (error) {
    console.error('Error checking registration eligibility:', error);
    return {
      isRegistered: false,
      status: 'error',
      message: 'Error checking registration',
      buttonText: 'Join Now',
      buttonClass: 'register-enabled',
      canRegister: true,
      icon: '❓',
      color: '#6c757d'
    };
  }
};
