// EventCard.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import RegistrationStatus from './RegistrationStatus';
import EventStatus from './EventStatus';
import { formatEventDateTimeRange } from '../utils/eventRegistrationUtils';
import './EventCard.css';

const EventCard = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const eventData = { id: docSnap.id, ...docSnap.data() };
          console.log('Event data:', eventData);
          console.log('Event image URL:', eventData.image);
          setEvent(eventData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!event) return <div className="error">Event not found</div>;

  return (
    <div className="event-card-container">
      <div className="event-header">
        <div className="event-title-row">
          <h1 className="event-title">{event.title}</h1>
          <EventStatus 
            event={event}
            variant="large"
            className="header-integration"
          />
        </div>
        <div className="event-meta-info">
          <div className="meta-item">
            <span className="calendar-icon">📅</span>
            <span>{formatEventDateTimeRange(event.startDateTime || event.startTime, event.endDateTime || event.endTime)}</span>
          </div>
          <div className="meta-item">
            <span className="location-icon">📍</span>
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      <div className="event-image-container">
        {event.image && event.image.trim() !== '' ? (
          <img 
            src={event.image} 
            alt={event.title} 
            className="event-main-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="event-main-image no-image" style={{ display: event.image && event.image.trim() !== '' ? 'none' : 'flex' }}>
          <div className="no-image-content">
            <span className="no-image-icon">📅</span>
            <span className="no-image-text">Event Image</span>
          </div>
        </div>
        <div className="image-overlay">
          <div className="organizer-info">
            <span className="organizer-label">Organizer</span>
            <div className="organizer-details">
              <div className="organizer-avatar">
                <span>👥</span>
              </div>
              <span className="organizer-name">{event.organizer}</span>
            </div>
            <RegistrationStatus 
              event={event}
              onRegister={() => navigate(`/register/${eventId}`)}
              variant="large"
              showMessage={true}
              className="card-integration"
            />
          </div>
        </div>
      </div>

      <div className="event-plan-section">
        <h2>Here's the Plan</h2>
        <p>{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;
