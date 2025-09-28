import React from 'react';
import { getEventStatus, EVENT_STATUS } from '../utils/eventRegistrationUtils';
import './EventStatus.css';

const EventStatus = ({ 
  event, 
  className = '', 
  variant = 'default',
  showIcon = true,
  showLabel = true 
}) => {
  const status = getEventStatus(event);
  
  const getStatusConfig = (status) => {
    switch (status) {
      case EVENT_STATUS.UPCOMING:
        return {
          label: 'Upcoming',
          icon: '📅',
          color: '#4CAF50',
          bgColor: 'rgba(76, 175, 80, 0.1)',
          borderColor: 'rgba(76, 175, 80, 0.3)'
        };
      case EVENT_STATUS.ONGOING:
        return {
          label: 'Ongoing',
          icon: '⏰',
          color: '#FF9800',
          bgColor: 'rgba(255, 152, 0, 0.1)',
          borderColor: 'rgba(255, 152, 0, 0.3)'
        };
      case EVENT_STATUS.FINISHED:
        return {
          label: 'Finished',
          icon: '✅',
          color: '#9E9E9E',
          bgColor: 'rgba(158, 158, 158, 0.1)',
          borderColor: 'rgba(158, 158, 158, 0.3)'
        };
      case EVENT_STATUS.CANCELED:
        return {
          label: 'Canceled',
          icon: '❌',
          color: '#F44336',
          bgColor: 'rgba(244, 67, 54, 0.1)',
          borderColor: 'rgba(244, 67, 54, 0.3)'
        };
      default:
        return {
          label: 'Unknown',
          icon: '❓',
          color: '#757575',
          bgColor: 'rgba(117, 117, 117, 0.1)',
          borderColor: 'rgba(117, 117, 117, 0.3)'
        };
    }
  };

  const config = getStatusConfig(status);
  const isManualOverride = event.status && event.status !== calculateEventStatus(event);

  return (
    <div className={`event-status ${className} ${variant} ${status}`}>
      <div 
        className="status-badge"
        style={{
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          color: config.color
        }}
      >
        {showIcon && (
          <span className="status-icon">{config.icon}</span>
        )}
        {showLabel && (
          <span className="status-label">{config.label}</span>
        )}
        {isManualOverride && (
          <span className="override-indicator" title="Manual Override">🔧</span>
        )}
      </div>
    </div>
  );
};

// Helper function to calculate automatic status (duplicated for component use)
const calculateEventStatus = (event) => {
  if (event.status === EVENT_STATUS.CANCELED) {
    return EVENT_STATUS.CANCELED;
  }

  const now = new Date();
  const startTime = new Date(event.startDateTime || event.startTime || event.date);
  const endTime = new Date(event.endDateTime || event.endTime || event.date);
  
  if (!event.endDateTime && !event.endTime && event.duration) {
    const durationHours = parseInt(event.duration) || 4;
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

export default EventStatus;
