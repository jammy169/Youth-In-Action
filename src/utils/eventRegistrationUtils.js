// Event Status and Registration Utility Functions

// Event status constants
export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  FINISHED: 'finished',
  CANCELED: 'canceled'
};

// Calculate automatic event status based on current time
export const calculateEventStatus = (event) => {
  // If event is manually canceled, always return canceled
  if (event.status === EVENT_STATUS.CANCELED) {
    return EVENT_STATUS.CANCELED;
  }

  const now = new Date();
  const startTime = new Date(event.startDateTime || event.startTime || event.date);
  const endTime = new Date(event.endDateTime || event.endTime || event.date);
  
  // If no endDateTime is provided, assume event lasts for the duration specified
  if (!event.endDateTime && !event.endTime && event.duration) {
    const durationHours = parseInt(event.duration) || 4; // Default to 4 hours
    endTime.setHours(endTime.getHours() + durationHours);
  }

  if (now < startTime) {
    return EVENT_STATUS.UPCOMING;
  } else if (now >= startTime && now < endTime) {
    return EVENT_STATUS.ONGOING;
  } else {
    return EVENT_STATUS.FINISHED;
  }
};

// Get event status (automatic or manual override)
export const getEventStatus = (event) => {
  // If event has a manual status override, use it
  if (event.status && Object.values(EVENT_STATUS).includes(event.status)) {
    return event.status;
  }
  
  // Otherwise, calculate automatic status
  return calculateEventStatus(event);
};

// Get registration status based on event status
export const getEventRegistrationStatus = (event) => {
  const status = getEventStatus(event);
  
  switch (status) {
    case EVENT_STATUS.UPCOMING:
      return {
        status: 'upcoming',
        message: 'Registration Open',
        canRegister: true,
        buttonText: 'Join Now',
        buttonClass: 'register-enabled',
        icon: '📅',
        color: '#4CAF50'
      };
    case EVENT_STATUS.ONGOING:
      return {
        status: 'ongoing',
        message: 'Registration Closed – Event Ongoing',
        canRegister: false,
        buttonText: 'Event Ongoing',
        buttonClass: 'register-disabled',
        icon: '⏰',
        color: '#FF9800'
      };
    case EVENT_STATUS.FINISHED:
      return {
        status: 'finished',
        message: 'Event Finished',
        canRegister: false,
        buttonText: 'Event Finished',
        buttonClass: 'register-finished',
        icon: '✅',
        color: '#9E9E9E'
      };
    case EVENT_STATUS.CANCELED:
      return {
        status: 'canceled',
        message: 'Event Canceled',
        canRegister: false,
        buttonText: 'Event Canceled',
        buttonClass: 'register-canceled',
        icon: '❌',
        color: '#F44336'
      };
    default:
      return {
        status: 'unknown',
        message: 'Status Unknown',
        canRegister: false,
        buttonText: 'Status Unknown',
        buttonClass: 'register-unknown',
        icon: '❓',
        color: '#757575'
      };
  }
};

export const formatEventTime = (dateString, timeString = null) => {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  if (timeString) {
    const [hours, minutes] = timeString.split(':');
    date.setHours(parseInt(hours), parseInt(minutes));
  }
  
  return date.toLocaleDateString(undefined, options);
};

// Format datetime range for event display
export const formatEventDateTimeRange = (startDateTime, endDateTime) => {
  if (!startDateTime || !endDateTime) {
    return 'Date & time TBD';
  }

  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);
  
  // Check if it's the same day
  const isSameDay = startDate.toDateString() === endDate.toDateString();
  
  if (isSameDay) {
    // Format: "Oct 20, 2025 • 2:00 PM - 6:00 PM"
    const dateOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    const timeOptions = { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    };
    
    const dateStr = startDate.toLocaleDateString(undefined, dateOptions);
    const startTimeStr = startDate.toLocaleTimeString(undefined, timeOptions);
    const endTimeStr = endDate.toLocaleTimeString(undefined, timeOptions);
    
    return `${dateStr} • ${startTimeStr} - ${endTimeStr}`;
  } else {
    // Format: "Oct 20, 2:00 PM - Oct 21, 6:00 PM"
    const dateOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    const timeOptions = { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    };
    
    const startDateStr = startDate.toLocaleDateString(undefined, dateOptions);
    const startTimeStr = startDate.toLocaleTimeString(undefined, timeOptions);
    const endDateStr = endDate.toLocaleDateString(undefined, dateOptions);
    const endTimeStr = endDate.toLocaleTimeString(undefined, timeOptions);
    
    return `${startDateStr}, ${startTimeStr} - ${endDateStr}, ${endTimeStr}`;
  }
};

// Compact datetime format for cards
export const formatEventDateTimeCompact = (startDateTime, endDateTime) => {
  if (!startDateTime || !endDateTime) {
    return 'TBD';
  }

  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);
  
  const isSameDay = startDate.toDateString() === endDate.toDateString();
  
  if (isSameDay) {
    // Format: "Oct 20 • 2:00-6:00 PM"
    const dateOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    const timeOptions = { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    };
    
    const dateStr = startDate.toLocaleDateString(undefined, dateOptions);
    const startTimeStr = startDate.toLocaleTimeString(undefined, timeOptions);
    const endTimeStr = endDate.toLocaleTimeString(undefined, timeOptions);
    
    return `${dateStr} • ${startTimeStr} - ${endTimeStr}`;
  } else {
    // Format: "Oct 20-21"
    const dateOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    
    const startDateStr = startDate.toLocaleDateString(undefined, dateOptions);
    const endDateStr = endDate.toLocaleDateString(undefined, dateOptions);
    
    return `${startDateStr} - ${endDateStr}`;
  }
};

// Format datetime for countdown timer
export const formatDateTimeForCountdown = (dateTime) => {
  if (!dateTime) return null;
  return new Date(dateTime).toISOString();
};

// Convert datetime-local input to ISO format
export const convertToISO = (datetimeLocal) => {
  if (!datetimeLocal) return null;
  return new Date(datetimeLocal).toISOString();
};

// Convert ISO to datetime-local format for input fields
export const convertToDateTimeLocal = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  // Format: YYYY-MM-DDTHH:MM
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const getTimeUntilEvent = (event) => {
  const now = new Date();
  const startTime = new Date(event.startDateTime || event.startTime || event.date);
  const endTime = new Date(event.endDateTime || event.endTime || event.date);
  
  if (!event.endDateTime && !event.endTime && event.duration) {
    const durationHours = parseInt(event.duration) || 4;
    endTime.setHours(endTime.getHours() + durationHours);
  }

  if (now < startTime) {
    const diff = startTime - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  } else if (now >= startTime && now < endTime) {
    const diff = endTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `Ends in ${hours}h ${minutes}m`;
    return `Ends in ${minutes}m`;
  }
  
  return 'Event Finished';
};
