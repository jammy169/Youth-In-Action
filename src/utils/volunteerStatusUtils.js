// volunteerStatusUtils.js
// Utility functions for managing volunteer registration statuses

/**
 * Volunteer Registration Status Constants
 * Defines the complete status flow for volunteer registrations
 */
export const VOLUNTEER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved', // Approved (Registered) - can attend
  ATTENDED: 'attended', // Actually attended the event
  ABSENT: 'absent',     // Did not attend despite being approved
  REJECTED: 'rejected'   // Registration was rejected
};

/**
 * Status display configuration
 * Maps status values to user-friendly display text and styling
 */
export const STATUS_CONFIG = {
  [VOLUNTEER_STATUS.PENDING]: {
    text: 'Pending',
    class: 'status-pending',
    description: 'Awaiting admin approval'
  },
  [VOLUNTEER_STATUS.APPROVED]: {
    text: 'Approved (Registered)',
    class: 'status-approved',
    description: 'Approved to attend the event'
  },
  [VOLUNTEER_STATUS.ATTENDED]: {
    text: 'Attended',
    class: 'status-attended',
    description: 'Successfully attended the event'
  },
  [VOLUNTEER_STATUS.ABSENT]: {
    text: 'Absent',
    class: 'status-absent',
    description: 'Did not attend the event'
  },
  [VOLUNTEER_STATUS.REJECTED]: {
    text: 'Rejected',
    class: 'status-rejected',
    description: 'Registration was rejected'
  }
};

/**
 * Valid status transitions
 * Defines which status changes are allowed
 */
export const VALID_TRANSITIONS = {
  [VOLUNTEER_STATUS.PENDING]: [VOLUNTEER_STATUS.APPROVED, VOLUNTEER_STATUS.REJECTED],
  [VOLUNTEER_STATUS.APPROVED]: [VOLUNTEER_STATUS.ATTENDED, VOLUNTEER_STATUS.ABSENT, VOLUNTEER_STATUS.REJECTED],
  [VOLUNTEER_STATUS.ATTENDED]: [], // Final state - no transitions allowed
  [VOLUNTEER_STATUS.ABSENT]: [],   // Final state - no transitions allowed
  [VOLUNTEER_STATUS.REJECTED]: [VOLUNTEER_STATUS.APPROVED] // Can be re-approved
};

/**
 * Check if a status transition is valid
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - Desired new status
 * @returns {boolean} - Whether the transition is valid
 */
export const isValidTransition = (currentStatus, newStatus) => {
  return VALID_TRANSITIONS[currentStatus]?.includes(newStatus) || false;
};

/**
 * Get available actions for a given status
 * @param {string} status - Current registration status
 * @param {Object} event - Event object with date/time information
 * @returns {Array} - Array of available actions
 */
export const getAvailableActions = (status, event) => {
  const now = new Date();
  const eventEndTime = new Date(event.endDateTime || event.endTime || event.date);
  
  // If event has ended, show attendance actions
  const isEventFinished = now > eventEndTime;
  
  switch (status) {
    case VOLUNTEER_STATUS.PENDING:
      return [
        { action: VOLUNTEER_STATUS.APPROVED, label: '✓ Approve', class: 'approve-btn' },
        { action: VOLUNTEER_STATUS.REJECTED, label: '✗ Reject', class: 'reject-btn' }
      ];
    
    case VOLUNTEER_STATUS.APPROVED:
      if (isEventFinished) {
        return [
          { action: VOLUNTEER_STATUS.ATTENDED, label: '✓ Mark Attended', class: 'attended-btn' },
          { action: VOLUNTEER_STATUS.ABSENT, label: '✗ Mark Absent', class: 'absent-btn' }
        ];
      } else {
        return [
          { action: VOLUNTEER_STATUS.REJECTED, label: '✗ Reject', class: 'reject-btn' }
        ];
      }
    
    case VOLUNTEER_STATUS.REJECTED:
      return [
        { action: VOLUNTEER_STATUS.APPROVED, label: '✓ Approve', class: 'approve-btn' }
      ];
    
    case VOLUNTEER_STATUS.ATTENDED:
    case VOLUNTEER_STATUS.ABSENT:
      // Final states - no actions available
      return [];
    
    default:
      return [];
  }
};

/**
 * Check if hours should be awarded for a status
 * @param {string} status - Current registration status
 * @returns {boolean} - Whether hours should be awarded
 */
export const shouldAwardHours = (status) => {
  return status === VOLUNTEER_STATUS.ATTENDED;
};

/**
 * Get status badge component props
 * @param {string} status - Registration status
 * @returns {Object} - Props for status badge component
 */
export const getStatusBadgeProps = (status) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[VOLUNTEER_STATUS.PENDING];
  return {
    className: `status-badge ${config.class}`,
    title: config.description,
    children: config.text
  };
};

/**
 * Calculate total service hours for a volunteer
 * @param {Array} registrations - Array of registration objects
 * @returns {number} - Total service hours
 */
export const calculateTotalServiceHours = (registrations) => {
  return registrations
    .filter(reg => reg.status === VOLUNTEER_STATUS.ATTENDED)
    .reduce((total, reg) => total + (reg.serviceHours || 0), 0);
};

/**
 * Get registration statistics
 * @param {Array} registrations - Array of registration objects
 * @returns {Object} - Statistics object
 */
export const getRegistrationStats = (registrations) => {
  const stats = {
    total: registrations.length,
    pending: 0,
    approved: 0,
    attended: 0,
    absent: 0,
    rejected: 0,
    totalServiceHours: 0
  };

  registrations.forEach(reg => {
    stats[reg.status] = (stats[reg.status] || 0) + 1;
    if (reg.status === VOLUNTEER_STATUS.ATTENDED) {
      stats.totalServiceHours += reg.serviceHours || 0;
    }
  });

  return stats;
};
