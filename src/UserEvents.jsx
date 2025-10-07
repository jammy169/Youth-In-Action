// src/UserEvents.jsx
import React, { useState, useEffect } from 'react';
import './UserEvents.css';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from './components/CountdownTimer';
import RegistrationStatus from './components/RegistrationStatus';
import EventStatus from './components/EventStatus';
import { formatEventDateTimeCompact } from './utils/eventRegistrationUtils';
import { 
  getUserEvents, 
  subscribeToUserEvents, 
  getCategoryIcon,
  EVENT_CATEGORIES 
} from './utils/eventsService';

const UserEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const navigate = useNavigate();

  // Load events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading user events...');
        const userEvents = await getUserEvents(selectedCategory);
        setEvents(userEvents);
        console.log('✅ Loaded user events:', userEvents.length);
        console.log('📋 Events data:', userEvents);
      } catch (error) {
        console.error('❌ Error loading events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [selectedCategory]);

  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToUserEvents((updatedEvents) => {
      setEvents(updatedEvents);
      setLoading(false);
    }, selectedCategory);

    return () => unsubscribe();
  }, [selectedCategory]);

  const filteredEvents = events.filter(event =>
    selectedCategory === 'ALL' || event.category === selectedCategory
  );

  return (
    <div className="user-events-root">
      {/* Hero Banner Section */}
      <section className="user-events-hero">
        <div className="user-events-hero-overlay"></div>
        <div className="user-events-hero-content">
          <h1>Why Wait? Get involved today by volunteering at our next event and be a positive force for change in your community!</h1>
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
          {EVENT_CATEGORIES.map(cat => (
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
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : (
          <div className="event-cards">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div className="event-card" key={event.id}>
                  <img src={event.image} alt={event.title} className="event-img" />
                  <div className="event-info">
                    <div className="event-title-row">
                      <h2 className="event-card-title">{event.title}</h2>
                      <EventStatus 
                        event={event}
                        variant="compact"
                        className="header-integration"
                      />
                    </div>
                    <div className="event-countdown">
                      <CountdownTimer 
                        targetDate={event.startDateTime || event.startTime || event.date} 
                        className="compact success"
                        onComplete={() => console.log(`Event ${event.title} has started!`)}
                      />
                    </div>
                    <div className="event-details">
                      <span className="event-date">
                        {formatEventDateTimeCompact(event.startDateTime || event.startTime, event.endDateTime || event.endTime)}
                      </span>
                      <span className="event-location">{event.location}</span>
                    </div>
                    <div className="event-actions">
                      <RegistrationStatus 
                        event={event}
                        onRegister={() => navigate(`/event/${event.id}`)}
                        variant="compact"
                        showMessage={false}
                        className="card-integration"
                      />
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
          <h3>YouthInAction Philippines</h3>
          <p>Get involved in volunteering today for the better future of Cebu. All donations proceed directly to local charities</p>
          <div className="contact-info">
            <p><i className="fas fa-envelope"></i> youthinaction@gmail.com</p>
            <p><i className="fas fa-phone"></i> +63-32-123-4567</p>
            <p><i className="fas fa-map-marker-alt"></i> Barangay Poblacion, Toledo City, Cebu, Philippines</p>
          </div>
        </div>
        <div className="footer-col">
          <h3>Get Monthly Updates</h3>
          <p>Stay informed about upcoming events and volunteer opportunities</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" className="footer-input" />
            <button className="footer-signup">Subscribe</button>
          </div>
          <p className="newsletter-note">We respect your privacy. Unsubscribe at any time.</p>
        </div>
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/about">About</a></li>
            <li><a href="/support">Support Us</a></li>
            <li><a href="/news">News</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://facebook.com/youthinaction" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-facebook"></i> Facebook
            </a>
            <a href="https://instagram.com/youthinaction" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-instagram"></i> Instagram
            </a>
            <a href="https://twitter.com/youthinaction" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-twitter"></i> Twitter
            </a>
            <a href="https://linkedin.com/company/youthinaction" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-linkedin"></i> LinkedIn
            </a>
          </div>
        </div>
      </footer>
      <div className="user-events-copyright">
        © 2025 by YouthInAction. | <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Use</a> | <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
      </div>
    </div>
  );
};

export default UserEvents;