// EventDetails.jsx (Optimized)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './EventDetails.css';

const EventDetails = () => {
  const { eventId } = useParams();
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
      <h1>{event.title}</h1>
      <div className="event-meta">
        <p><strong>Date:</strong> {event.date}</p>
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

      <button className="register-btn">
        COMPLETE REGISTRATION
      </button>
    </div>
  );
};
export default EventDetails;