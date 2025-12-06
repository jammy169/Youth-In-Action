// CancelledEventCard.jsx
// Special card component for cancelled events

import React from 'react';
import './CancelledEventCard.css';

const CancelledEventCard = ({ event, registration }) => {
  const getStatusInfo = () => {
    if (registration?.status === 'cancelled') {
      return {
        icon: '❌',
        title: 'Event Cancelled',
        message: 'This event has been cancelled by the organizer',
        color: '#dc3545',
        bgColor: '#f8d7da'
      };
    }
    
    if (event?.status === 'cancelled') {
      return {
        icon: '⚠️',
        title: 'Event Cancelled',
        message: 'This event has been cancelled',
        color: '#dc3545',
        bgColor: '#f8d7da'
      };
    }
    
    return null;
  };

  const statusInfo = getStatusInfo();
  if (!statusInfo) return null;

  return (
    <div className="cancelled-event-card">
      <div className="cancelled-header">
        <div className="cancelled-icon" style={{ color: statusInfo.color }}>
          {statusInfo.icon}
        </div>
        <div className="cancelled-info">
          <h3 className="cancelled-title" style={{ color: statusInfo.color }}>
            {statusInfo.title}
          </h3>
          <p className="cancelled-message">{statusInfo.message}</p>
        </div>
      </div>

      <div className="event-details">
        <h4>{event.title}</h4>
        <div className="event-meta">
          <span>📅 {new Date(event.date).toLocaleDateString()}</span>
          <span>📍 {event.location}</span>
        </div>
        {event.description && (
          <p className="event-description">{event.description}</p>
        )}
      </div>

      <div className="cancelled-status" style={{ 
        backgroundColor: statusInfo.bgColor,
        color: statusInfo.color,
        borderColor: statusInfo.color
      }}>
        <span className="status-icon">{statusInfo.icon}</span>
        <span className="status-text">
          Your Registration: {registration?.status || 'Unknown'}
        </span>
      </div>

      <div className="cancelled-actions">
        <div className="action-info">
          <h5>What happened?</h5>
          <ul>
            <li>📧 You should have received an email notification</li>
            <li>🔄 Your registration status has been updated</li>
            <li>📱 Check your notifications for updates</li>
          </ul>
        </div>
        
        <div className="contact-info">
          <h5>Need help?</h5>
          <p>Contact us at <strong>info@youthinaction.com</strong></p>
        </div>
      </div>
    </div>
  );
};

export default CancelledEventCard;






