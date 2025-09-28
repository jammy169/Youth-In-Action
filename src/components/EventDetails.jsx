// EventDetails.jsx (Optimized)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import RegistrationStatus from './RegistrationStatus';
import EventStatus from './EventStatus';
import { formatEventDateTimeRange } from '../utils/eventRegistrationUtils';
import './EventDetails.css';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, "events", eventId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEvent({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!event) return <div className="error">Event not found</div>;

  return (
    <div className="event-details-container">
      <div className="event-title-row">
        <h1>{event.title}</h1>
        <EventStatus 
          event={event}
          variant="large"
          className="header-integration"
        />
      </div>
      <div className="event-meta">
        <p><strong>Date & Time:</strong> {formatEventDateTimeRange(event.startDateTime || event.startTime, event.endDateTime || event.endTime)}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Organizer:</strong> {event.organizer}</p>
      </div>
      
      <div className="event-image">
        <img src={event.image} alt={event.title} />
      </div>

      <div className="event-description">
        <h2>Event Details</h2>
        <p>{event.description}</p>
      </div>

      <RegistrationStatus 
        event={event}
        onRegister={() => navigate(`/register/${eventId}`)}
        variant="large"
        showMessage={true}
        className="details-integration"
      />
    </div>
  );
};
export default EventDetails;