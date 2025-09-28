import React, { useState } from 'react';
import { EVENT_STATUS } from '../utils/eventRegistrationUtils';
import './EventStatusOverride.css';

const EventStatusOverride = ({ 
  event, 
  onStatusChange, 
  className = '' 
}) => {
  const [selectedStatus, setSelectedStatus] = useState(event.status || 'auto');
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'auto', label: 'Automatic', description: 'Status updates based on time' },
    { value: EVENT_STATUS.UPCOMING, label: 'Upcoming', description: 'Event is scheduled' },
    { value: EVENT_STATUS.ONGOING, label: 'Ongoing', description: 'Event is currently happening' },
    { value: EVENT_STATUS.FINISHED, label: 'Finished', description: 'Event has ended' },
    { value: EVENT_STATUS.CANCELED, label: 'Canceled', description: 'Event has been canceled' }
  ];

  const getCurrentStatusLabel = () => {
    if (selectedStatus === 'auto') {
      return 'Automatic';
    }
    const option = statusOptions.find(opt => opt.value === selectedStatus);
    return option ? option.label : 'Unknown';
  };

  const getCurrentStatusColor = () => {
    switch (selectedStatus) {
      case EVENT_STATUS.UPCOMING: return '#4CAF50';
      case EVENT_STATUS.ONGOING: return '#FF9800';
      case EVENT_STATUS.FINISHED: return '#9E9E9E';
      case EVENT_STATUS.CANCELED: return '#F44336';
      default: return '#757575';
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onStatusChange(event.id, newStatus === 'auto' ? null : newStatus);
      setSelectedStatus(newStatus);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating event status:', error);
      alert('Failed to update event status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`event-status-override ${className}`}>
      <div className="status-override-header">
        <span className="status-label">Event Status:</span>
        <button
          className={`status-toggle ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          disabled={isUpdating}
        >
          <span 
            className="status-indicator"
            style={{ backgroundColor: getCurrentStatusColor() }}
          ></span>
          <span className="status-text">{getCurrentStatusLabel()}</span>
          <span className="dropdown-icon">{isOpen ? '▲' : '▼'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="status-dropdown">
          <div className="dropdown-header">
            <h4>Change Event Status</h4>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className="status-options">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                className={`status-option ${selectedStatus === option.value ? 'selected' : ''}`}
                onClick={() => handleStatusChange(option.value)}
                disabled={isUpdating}
              >
                <div className="option-content">
                  <div className="option-label">{option.label}</div>
                  <div className="option-description">{option.description}</div>
                </div>
                {selectedStatus === option.value && (
                  <span className="selected-icon">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="dropdown-footer">
            <small>
              <strong>Note:</strong> Manual overrides take precedence over automatic status calculation.
            </small>
          </div>
        </div>
      )}

      {isUpdating && (
        <div className="updating-overlay">
          <div className="spinner"></div>
          <span>Updating status...</span>
        </div>
      )}
    </div>
  );
};

export default EventStatusOverride;

