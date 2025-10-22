// AdminEventManager.jsx
// Enhanced admin event management with soft delete

import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { softDeleteEvent, restoreEvent } from '../utils/eventSoftDelete';
import { getEventRegistrationsCount } from '../utils/eventCascadeDelete';
import EventDeleteConfirmation from './EventDeleteConfirmation';
import './AdminEventManager.css';

const AdminEventManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [registrationsCount, setRegistrationsCount] = useState(0);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const eventsRef = collection(db, 'events');
      const snapshot = await getDocs(eventsRef);
      
      const eventsList = [];
      snapshot.forEach((doc) => {
        eventsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by date
      eventsList.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(eventsList);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (event) => {
    setSelectedEvent(event);
    
    // Get registration count
    try {
      const result = await getEventRegistrationsCount(event.id);
      if (result.success) {
        setRegistrationsCount(result.count);
      }
    } catch (error) {
      console.error('Error getting registrations count:', error);
    }
    
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (deleteOption) => {
    if (!selectedEvent) return;
    
    try {
      let result;
      
      switch (deleteOption) {
        case 'soft':
          result = await softDeleteEvent(selectedEvent.id);
          break;
        case 'restore':
          result = await restoreEvent(selectedEvent.id);
          break;
        default:
          throw new Error('Invalid delete option');
      }
      
      if (result.success) {
        alert(`✅ ${result.message}`);
        loadEvents(); // Refresh the list
      } else {
        alert(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setShowDeleteModal(false);
      setSelectedEvent(null);
    }
  };

  const getEventStatus = (event) => {
    if (event.status === 'cancelled') {
      return {
        status: 'cancelled',
        color: '#dc3545',
        icon: '❌',
        text: 'Cancelled'
      };
    }
    
    if (event.status === 'completed') {
      return {
        status: 'completed',
        color: '#6c757d',
        icon: '✅',
        text: 'Completed'
      };
    }
    
    const now = new Date();
    const eventDate = new Date(event.date);
    
    if (eventDate < now) {
      return {
        status: 'past',
        color: '#6c757d',
        icon: '📅',
        text: 'Past Event'
      };
    }
    
    return {
      status: 'upcoming',
      color: '#28a745',
      icon: '⏰',
      text: 'Upcoming'
    };
  };

  if (loading) {
    return <div className="loading">🔄 Loading events...</div>;
  }

  return (
    <div className="admin-event-manager">
      <div className="manager-header">
        <h1>📅 Event Management</h1>
        <p>Manage your events with soft delete and restoration</p>
      </div>

      <div className="events-grid">
        {events.map((event) => {
          const statusInfo = getEventStatus(event);
          
          return (
            <div key={event.id} className={`event-card ${statusInfo.status}`}>
              <div className="event-header">
                <div className="event-title">
                  <h3>{event.title}</h3>
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: statusInfo.color }}
                  >
                    <span className="status-icon">{statusInfo.icon}</span>
                    <span className="status-text">{statusInfo.text}</span>
                  </div>
                </div>
                
                {event.deletedAt && (
                  <div className="deleted-info">
                    <p><strong>Deleted:</strong> {new Date(event.deletedAt).toLocaleDateString()}</p>
                    <p><strong>Reason:</strong> {event.reason || 'No reason provided'}</p>
                  </div>
                )}
              </div>

              <div className="event-details">
                <p><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>📍 Location:</strong> {event.location}</p>
                <p><strong>👤 Organizer:</strong> {event.organizer}</p>
                {event.description && (
                  <p><strong>📝 Description:</strong> {event.description}</p>
                )}
              </div>

              <div className="event-actions">
                {event.status === 'cancelled' ? (
                  <button 
                    className="btn-restore"
                    onClick={() => handleSoftDelete(event)}
                  >
                    🔄 Restore Event
                  </button>
                ) : (
                  <button 
                    className="btn-cancel"
                    onClick={() => handleSoftDelete(event)}
                  >
                    ❌ Cancel Event
                  </button>
                )}
                
                <button 
                  className="btn-view-registrations"
                  onClick={() => {
                    // Navigate to registrations page
                    window.location.href = `/admin/registrations?eventId=${event.id}`;
                  }}
                >
                  👥 View Registrations
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="no-events">
          <h3>📭 No Events Found</h3>
          <p>Create your first event to get started!</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
        <EventDeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          event={selectedEvent}
          onEventDeleted={() => {
            loadEvents();
            setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminEventManager;



