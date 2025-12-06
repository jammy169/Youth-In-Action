// EventDeleteConfirmation.jsx
// Confirmation dialog for event deletion with user impact

import React, { useState, useEffect } from 'react';
import { getEventRegistrationsCount } from '../utils/eventCascadeDelete';
import { deleteEventWithNotification } from '../utils/eventDeleteWithNotification';
import { softDeleteEvent } from '../utils/eventSoftDelete';
import './EventDeleteConfirmation.css';

const EventDeleteConfirmation = ({ 
  isOpen, 
  onClose, 
  event, 
  onEventDeleted 
}) => {
  const [registrationsCount, setRegistrationsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteOption, setDeleteOption] = useState('soft'); // 'soft', 'cascade', 'notify'
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    if (isOpen && event) {
      loadRegistrationsCount();
    }
  }, [isOpen, event]);

  const loadRegistrationsCount = async () => {
    try {
      const result = await getEventRegistrationsCount(event.id);
      if (result.success) {
        setRegistrationsCount(result.count);
        setRegistrations(result.registrations);
      }
    } catch (error) {
      console.error('Error loading registrations:', error);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      let result;
      
      switch (deleteOption) {
        case 'soft':
          result = await softDeleteEvent(event.id);
          break;
        case 'cascade':
          result = await cascadeDeleteEvent(event.id);
          break;
        case 'notify':
          result = await deleteEventWithNotification(event.id, event.title);
          break;
        default:
          throw new Error('Invalid delete option');
      }
      
      if (result.success) {
        alert(`✅ ${result.message}`);
        onEventDeleted();
        onClose();
      } else {
        alert(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="delete-confirmation-overlay" onClick={onClose}>
      <div className="delete-confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🗑️ Delete Event</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <div className="event-info">
            <h3>{event.title}</h3>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
          </div>

          <div className="impact-warning">
            <h4>⚠️ Impact on Users</h4>
            <p><strong>{registrationsCount} users</strong> have registered for this event:</p>
            
            {registrations.length > 0 && (
              <div className="registrations-list">
                {registrations.slice(0, 5).map((reg, index) => (
                  <div key={index} className="registration-item">
                    <span>👤 {reg.firstName} {reg.lastName}</span>
                    <span className={`status ${reg.status}`}>{reg.status}</span>
                  </div>
                ))}
                {registrations.length > 5 && (
                  <p>... and {registrations.length - 5} more</p>
                )}
              </div>
            )}
          </div>

          <div className="delete-options">
            <h4>Choose Delete Method:</h4>
            
            <div className="option">
              <label>
                <input 
                  type="radio" 
                  name="deleteOption" 
                  value="soft" 
                  checked={deleteOption === 'soft'}
                  onChange={(e) => setDeleteOption(e.target.value)}
                />
                <span className="option-title">🔄 Soft Delete (Recommended)</span>
                <span className="option-desc">Mark as cancelled, keep registrations</span>
              </label>
            </div>

            <div className="option">
              <label>
                <input 
                  type="radio" 
                  name="deleteOption" 
                  value="notify" 
                  checked={deleteOption === 'notify'}
                  onChange={(e) => setDeleteOption(e.target.value)}
                />
                <span className="option-title">📧 Delete & Notify Users</span>
                <span className="option-desc">Delete event, update registrations to "cancelled", email users</span>
              </label>
            </div>

            <div className="option">
              <label>
                <input 
                  type="radio" 
                  name="deleteOption" 
                  value="cascade" 
                  checked={deleteOption === 'cascade'}
                  onChange={(e) => setDeleteOption(e.target.value)}
                />
                <span className="option-title">🗑️ Hard Delete (Dangerous)</span>
                <span className="option-desc">Permanently delete event and all registrations</span>
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn-cancel" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn-delete" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDeleteConfirmation;






