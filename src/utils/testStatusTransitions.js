// testStatusTransitions.js
// Test file to verify status transitions are working correctly

import { VOLUNTEER_STATUS, isValidTransition, getAvailableActions } from './volunteerStatusUtils';

// Test the status transitions
console.log('Testing status transitions...');

// Test PENDING -> APPROVED
console.log('PENDING -> APPROVED:', isValidTransition(VOLUNTEER_STATUS.PENDING, VOLUNTEER_STATUS.APPROVED)); // Should be true

// Test PENDING -> REJECTED  
console.log('PENDING -> REJECTED:', isValidTransition(VOLUNTEER_STATUS.PENDING, VOLUNTEER_STATUS.REJECTED)); // Should be true

// Test PENDING -> ATTENDED (should be false)
console.log('PENDING -> ATTENDED:', isValidTransition(VOLUNTEER_STATUS.PENDING, VOLUNTEER_STATUS.ATTENDED)); // Should be false

// Test APPROVED -> ATTENDED
console.log('APPROVED -> ATTENDED:', isValidTransition(VOLUNTEER_STATUS.APPROVED, VOLUNTEER_STATUS.ATTENDED)); // Should be true

// Test APPROVED -> ABSENT
console.log('APPROVED -> ABSENT:', isValidTransition(VOLUNTEER_STATUS.APPROVED, VOLUNTEER_STATUS.ABSENT)); // Should be true

// Test available actions for PENDING
const pendingActions = getAvailableActions(VOLUNTEER_STATUS.PENDING, {});
console.log('Actions for PENDING:', pendingActions);

// Test available actions for APPROVED
const approvedActions = getAvailableActions(VOLUNTEER_STATUS.APPROVED, {});
console.log('Actions for APPROVED:', approvedActions);

export { testStatusTransitions };










