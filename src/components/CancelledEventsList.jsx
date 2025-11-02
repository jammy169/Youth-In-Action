// CancelledEventsList.jsx
// Component to show cancelled events to users

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import CancelledEventCard from './CancelledEventCard';
import './CancelledEventsList.css';

const CancelledEventsList = () => {
  const [cancelledEvents, setCancelledEvents] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCancelledEvents();
  }, []);

  const loadCancelledEvents = async () => {
    try {
      setLoading(true);
      
      // Get all cancelled events
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, where('status', '==', 'cancelled'));
      const eventsSnapshot = await getDocs(q);
      
      const events = [];
      eventsSnapshot.forEach((doc) => {
        events.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Get user registrations for these events
      const registrationsRef = collection(db, 'registrations');
      const eventIds = events.map(event => event.id);
      
      if (eventIds.length > 0) {
        const registrations = [];
        
        // Get registrations for each cancelled event
        for (const eventId of eventIds) {
          const regQuery = query(registrationsRef, where('eventId', '==', eventId));
          const regSnapshot = await getDocs(regQuery);
          
          regSnapshot.forEach((doc) => {
            registrations.push({
              id: doc.id,
              ...doc.data()
            });
          });
        }
        
        setUserRegistrations(registrations);
      }
      
      setCancelledEvents(events);
    } catch (error) {
      console.error('Error loading cancelled events:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserRegistration = (eventId) => {
    return userRegistrations.find(reg => reg.eventId === eventId);
  };

  if (loading) {
    return (
      <div className="cancelled-events-loading">
        <div className="loading-spinner">🔄</div>
        <p>Loading cancelled events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cancelled-events-error">
        <h3>❌ Error Loading Events</h3>
        <p>{error}</p>
        <button onClick={loadCancelledEvents}>🔄 Try Again</button>
      </div>
    );
  }

  if (cancelledEvents.length === 0) {
    return (
      <div className="no-cancelled-events">
        <div className="no-events-icon">✅</div>
        <h3>No Cancelled Events</h3>
        <p>All your events are still active! 🎉</p>
      </div>
    );
  }

  return (
    <div className="cancelled-events-list">
      <div className="cancelled-header">
        <h1>❌ Cancelled Events</h1>
        <p>Events that have been cancelled by the organizers</p>
      </div>

      <div className="cancelled-events-grid">
        {cancelledEvents.map((event) => {
          const userRegistration = getUserRegistration(event.id);
          
          return (
            <CancelledEventCard
              key={event.id}
              event={event}
              registration={userRegistration}
            />
          );
        })}
      </div>

      <div className="cancelled-events-info">
        <h3>ℹ️ About Cancelled Events</h3>
        <ul>
          <li>📧 You should have received an email notification when these events were cancelled</li>
          <li>🔄 Your registration status has been updated to "cancelled"</li>
          <li>📱 Check your notifications for any updates</li>
          <li>🤝 You can still register for other active events</li>
        </ul>
        
        <div className="contact-support">
          <h4>Need Help?</h4>
          <p>If you have questions about cancelled events, contact us:</p>
          <p><strong>📧 info@youthinaction.com</strong></p>
        </div>
      </div>
    </div>
  );
};

export default CancelledEventsList;




