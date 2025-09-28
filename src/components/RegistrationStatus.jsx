import React, { useState, useEffect } from 'react';
import { getEventRegistrationStatus } from '../utils/eventRegistrationUtils';
import { checkRegistrationEligibility } from '../utils/registrationUtils';
import './RegistrationStatus.css';

const RegistrationStatus = ({ 
  event, 
  onRegister, 
  className = '', 
  variant = 'default',
  showMessage = true 
}) => {
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        console.log('RegistrationStatus: Checking status for event:', event.id);
        
        // First check if user has registered for this event
        const userRegistrationStatus = await checkRegistrationEligibility(event.id);
        console.log('RegistrationStatus: User registration status:', userRegistrationStatus);
        
        if (userRegistrationStatus.isRegistered) {
          // User has registered, show their registration status
          console.log('RegistrationStatus: User is registered, showing status:', userRegistrationStatus.status);
          setRegistrationStatus(userRegistrationStatus);
        } else {
          // User hasn't registered, check if event allows registration
          console.log('RegistrationStatus: User not registered, checking event status');
          const eventStatus = getEventRegistrationStatus(event);
          console.log('RegistrationStatus: Event status:', eventStatus);
          setRegistrationStatus(eventStatus);
        }
      } catch (error) {
        console.error('RegistrationStatus: Error checking registration status:', error);
        // Fallback to event status only
        const eventStatus = getEventRegistrationStatus(event);
        setRegistrationStatus(eventStatus);
      } finally {
        setLoading(false);
      }
    };

    if (event && event.id) {
      checkStatus();
    }
  }, [event]);

  const handleClick = () => {
    if (registrationStatus && registrationStatus.canRegister && onRegister) {
      onRegister();
    }
  };

  if (loading) {
    return (
      <div className={`registration-status ${className} ${variant}`}>
        <button className="registration-button register-loading" disabled>
          <span className="button-text">Loading...</span>
        </button>
      </div>
    );
  }

  if (!registrationStatus) {
    return (
      <div className={`registration-status ${className} ${variant}`}>
        <button className="registration-button register-error" disabled>
          <span className="button-text">Error</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`registration-status ${className} ${variant}`}>
      {showMessage && (
        <div className={`status-message ${registrationStatus.status}`}>
          {registrationStatus.message}
        </div>
      )}
      
      <button
        className={`registration-button ${registrationStatus.buttonClass}`}
        onClick={handleClick}
        disabled={!registrationStatus.canRegister}
        title={registrationStatus.canRegister ? 'Click to register' : registrationStatus.message}
      >
        <span className="button-text">{registrationStatus.buttonText}</span>
        {registrationStatus.canRegister && (
          <span className="button-icon">→</span>
        )}
      </button>
    </div>
  );
};

export default RegistrationStatus;

