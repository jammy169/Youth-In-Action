// volunteerValidationUtils.js
// Validation utilities to ensure proper volunteer management flow

import { VOLUNTEER_STATUS } from './volunteerStatusUtils';

/**
 * Validate that no hours are awarded on approval
 * This is a critical safeguard to prevent immediate hours on approval
 * @param {string} currentStatus - Current registration status
 * @param {string} newStatus - Desired new status
 * @param {number} serviceHours - Service hours being set
 * @returns {Object} - Validation result
 */
export const validateHoursAward = (currentStatus, newStatus, serviceHours = 0) => {
  const validation = {
    isValid: true,
    error: null,
    warning: null
  };

  // CRITICAL: Never award hours on approval
  if (newStatus === VOLUNTEER_STATUS.APPROVED && serviceHours > 0) {
    validation.isValid = false;
    validation.error = 'CRITICAL ERROR: Hours cannot be awarded on approval. Hours are only awarded for actual attendance.';
    return validation;
  }

  // CRITICAL: Never award hours on rejection
  if (newStatus === VOLUNTEER_STATUS.REJECTED && serviceHours > 0) {
    validation.isValid = false;
    validation.error = 'CRITICAL ERROR: Hours cannot be awarded on rejection.';
    return validation;
  }

  // CRITICAL: Never award hours on pending
  if (newStatus === VOLUNTEER_STATUS.PENDING && serviceHours > 0) {
    validation.isValid = false;
    validation.error = 'CRITICAL ERROR: Hours cannot be awarded on pending status.';
    return validation;
  }

  // Only allow hours on attendance
  if (newStatus === VOLUNTEER_STATUS.ATTENDED) {
    if (serviceHours <= 0) {
      validation.warning = 'No service hours set for attended volunteer. Consider setting default hours.';
    }
  }

  // Never allow hours on absence
  if (newStatus === VOLUNTEER_STATUS.ABSENT && serviceHours > 0) {
    validation.isValid = false;
    validation.error = 'CRITICAL ERROR: Hours cannot be awarded for absent volunteers.';
    return validation;
  }

  return validation;
};

/**
 * Validate status transition for volunteer management
 * Ensures proper flow: Pending → Approved → Attended/Absent
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - Desired new status
 * @returns {Object} - Validation result
 */
export const validateStatusTransition = (currentStatus, newStatus) => {
  const validation = {
    isValid: true,
    error: null,
    warning: null
  };

  // Prevent skipping approval step
  if (currentStatus === VOLUNTEER_STATUS.PENDING && newStatus === VOLUNTEER_STATUS.ATTENDED) {
    validation.isValid = false;
    validation.error = 'Invalid transition: Cannot skip from Pending directly to Attended. Must be approved first.';
    return validation;
  }

  // Prevent skipping approval step
  if (currentStatus === VOLUNTEER_STATUS.PENDING && newStatus === VOLUNTEER_STATUS.ABSENT) {
    validation.isValid = false;
    validation.error = 'Invalid transition: Cannot skip from Pending directly to Absent. Must be approved first.';
    return validation;
  }

  // Prevent going backwards from final states
  if (currentStatus === VOLUNTEER_STATUS.ATTENDED && newStatus !== VOLUNTEER_STATUS.ATTENDED) {
    validation.isValid = false;
    validation.error = 'Invalid transition: Cannot change from Attended status. This is a final state.';
    return validation;
  }

  // Prevent going backwards from final states
  if (currentStatus === VOLUNTEER_STATUS.ABSENT && newStatus !== VOLUNTEER_STATUS.ABSENT) {
    validation.isValid = false;
    validation.error = 'Invalid transition: Cannot change from Absent status. This is a final state.';
    return validation;
  }

  return validation;
};

/**
 * Comprehensive validation for volunteer status changes
 * Combines all validation checks
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - Desired new status
 * @param {number} serviceHours - Service hours being set
 * @returns {Object} - Complete validation result
 */
export const validateVolunteerStatusChange = (currentStatus, newStatus, serviceHours = 0) => {
  const statusValidation = validateStatusTransition(currentStatus, newStatus);
  const hoursValidation = validateHoursAward(currentStatus, newStatus, serviceHours);

  return {
    isValid: statusValidation.isValid && hoursValidation.isValid,
    errors: [
      ...(statusValidation.error ? [statusValidation.error] : []),
      ...(hoursValidation.error ? [hoursValidation.error] : [])
    ],
    warnings: [
      ...(statusValidation.warning ? [statusValidation.warning] : []),
      ...(hoursValidation.warning ? [hoursValidation.warning] : [])
    ]
  };
};

/**
 * Get safe default hours for attended volunteers
 * @param {string} status - Current status
 * @returns {number} - Safe default hours (0 for non-attended, 4 for attended)
 */
export const getSafeDefaultHours = (status) => {
  if (status === VOLUNTEER_STATUS.ATTENDED) {
    return 4; // Default hours for attended volunteers
  }
  return 0; // No hours for any other status
};

/**
 * Audit log for volunteer status changes
 * @param {string} volunteerId - Volunteer ID
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 * @param {number} hoursAwarded - Hours awarded (if any)
 * @returns {Object} - Audit log entry
 */
export const createAuditLog = (volunteerId, oldStatus, newStatus, hoursAwarded = 0) => {
  return {
    volunteerId,
    oldStatus,
    newStatus,
    hoursAwarded,
    timestamp: new Date().toISOString(),
    action: newStatus === VOLUNTEER_STATUS.ATTENDED ? 'HOURS_AWARDED' : 'STATUS_CHANGED',
    description: newStatus === VOLUNTEER_STATUS.ATTENDED 
      ? `Volunteer marked as attended and awarded ${hoursAwarded} hours`
      : `Status changed from ${oldStatus} to ${newStatus}`
  };
};









