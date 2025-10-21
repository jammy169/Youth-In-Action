// RegistrationSuccessModal.jsx
// Beautiful popup modal for registration success

import React, { useEffect } from 'react';
import './RegistrationSuccessModal.css';

const RegistrationSuccessModal = ({ 
  isOpen, 
  onClose, 
  eventTitle, 
  eventDate, 
  eventLocation,
  registrationStatus = 'pending'
}) => {
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: '⏳',
          title: 'Registration Submitted!',
          message: 'Your registration is pending approval',
          color: '#ff9800',
          bgColor: '#fff3e0'
        };
      case 'approved':
        return {
          icon: '✅',
          title: 'Registration Approved!',
          message: 'You are confirmed for this event',
          color: '#4caf50',
          bgColor: '#e8f5e8'
        };
      case 'rejected':
        return {
          icon: '❌',
          title: 'Registration Not Approved',
          message: 'Unfortunately, your registration was not approved',
          color: '#f44336',
          bgColor: '#ffebee'
        };
      default:
        return {
          icon: '📝',
          title: 'Registration Submitted!',
          message: 'Thank you for registering',
          color: '#2196f3',
          bgColor: '#e3f2fd'
        };
    }
  };

  const statusInfo = getStatusInfo(registrationStatus);

  return (
    <div className="registration-modal-overlay" onClick={onClose}>
      <div className="registration-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="status-icon" style={{ color: statusInfo.color }}>
            {statusInfo.icon}
          </div>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          <h2 className="modal-title" style={{ color: statusInfo.color }}>
            {statusInfo.title}
          </h2>
          
          <p className="modal-message">
            {statusInfo.message}
          </p>

          <div className="event-details">
            <h3>Event Details:</h3>
            <div className="detail-item">
              <span className="detail-label">📅 Event:</span>
              <span className="detail-value">{eventTitle}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">📅 Date:</span>
              <span className="detail-value">{eventDate}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">📍 Location:</span>
              <span className="detail-value">{eventLocation}</span>
            </div>
          </div>

          <div className="status-badge" style={{ 
            backgroundColor: statusInfo.bgColor,
            color: statusInfo.color,
            borderColor: statusInfo.color
          }}>
            <span className="badge-icon">{statusInfo.icon}</span>
            <span className="badge-text">
              Status: {registrationStatus.charAt(0).toUpperCase() + registrationStatus.slice(1)}
            </span>
          </div>

          <div className="next-steps">
            <h4>What's Next?</h4>
            <ul>
              {registrationStatus === 'pending' && (
                <>
                  <li>📧 Check your email for confirmation details</li>
                  <li>⏳ Wait for admin approval (usually within 24 hours)</li>
                  <li>📱 You'll be notified when your status changes</li>
                </>
              )}
              {registrationStatus === 'approved' && (
                <>
                  <li>🎉 You're confirmed to attend this event!</li>
                  <li>📧 Check your email for event details</li>
                  <li>📱 You'll receive reminders before the event</li>
                </>
              )}
              {registrationStatus === 'rejected' && (
                <>
                  <li>😔 Your registration was not approved this time</li>
                  <li>📧 Check your email for more details</li>
                  <li>🔄 You can try registering for other events</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            View My Events
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessModal;
