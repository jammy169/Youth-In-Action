import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import JoinNowButton from './JoinNowButton';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchEvents();
  }, []);

  return (
    <div>
      {events.map(event => (
        <div key={event.id} style={{ border: "1px solid #eee", margin: "1rem", padding: "1rem", borderRadius: 8 }}>
          <h2>{event.title}</h2>
          <img src={event.image} alt={event.title} style={{ width: "100%", maxWidth: 400, borderRadius: 8 }} />
          <p>{event.description}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Organizer:</strong> {event.organizer}</p>
          <JoinNowButton onClick={() => alert(`Joined ${event.title}`)} />
        </div>
      ))}
    </div>
  );
};

export default EventList;