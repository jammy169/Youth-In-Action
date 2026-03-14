// src/UserEvents.jsx
import React, { useState, useEffect } from 'react';
import './UserEvents.css';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const categories = [
  'ALL',
  'COMMUNITY CLEANUPS',
  'SOCIAL SERVICE',
  'COMMUNITY DEVELOPMENT',
];

const UserEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollectionRef = collection(db, 'events');
        const querySnapshot = await getDocs(eventsCollectionRef);
        const eventsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event =>
    (selectedCategory === 'ALL' || event.category === selectedCategory) &&
    (event.title?.toLowerCase().includes(search.toLowerCase()) || event.description?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="user-events-root">
      {/* Hero Banner Section */}
      <section className="user-events-hero">
        <div className="user-events-hero-overlay"></div>
        <div className="user-events-hero-content">
          <h1>Why Wait? Get involved today by volunteering at our next event</h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="user-events-main">
        <h1 className="events-title">
          <span className="green">UPCOMING</span> <span className="orange">EVENTS</span>
        </h1>
        <div className="calendar-icon"><FaCalendarAlt /></div>
        <div className="events-subtitle">
          Inspire and empower! Join thrilling events, learn skills, connect. Join us!
        </div>
        <div className="event-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div className="event-cards">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div className="event-card" key={event.id}>
                  <img src={event.image} alt={event.title} className="event-img" />
                  <div className="event-info">
                    <h2 className="event-card-title">{event.title}</h2>
                    <div className="event-details">
                      <button
                        className="join-btn"
                        onClick={() => navigate('/EventCard', { state: { event } })} // Navigate to EventCard with event data
                      >
                        JOIN NOW
                      </button>
                      <span className="event-date">{event.date}</span>
                      <span className="event-location">{event.location}</span>
                    </div>
                    <p className="event-desc">{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No events found in this category.</p>
            )}
          </div>
        )}
      </main>

      <footer className="user-events-footer">
        <div className="footer-col">
          <h3>YouthInAction Japan</h3>
          <p>Get involved in volunteering today for the better future of Tokyo. All donations proceed directly to local charities</p>
          <p style={{marginTop: '1rem'}}>Email: youthinaction@gmail.com</p>
        </div>
        <div className="footer-col">
          <h3>Get Monthly Updates</h3>
          <p>Enter your email here *</p>
          <input type="email" placeholder="Your email" className="footer-input" />
          <button className="footer-signup">Sign Up!</button>
        </div>
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/about">About</a></li>
            <li><a href="/support">Support Us</a></li>
            <li><a href="/news">News</a></li>
            <li><a href="/userevents">Events</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </footer>
      <div className="user-events-copyright">
        © 2025 by YouthInAction. | <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Use</a> | <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
      </div>
    </div>
  );
};

export default UserEvents;