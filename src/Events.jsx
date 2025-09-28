import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';
import CountdownTimer from './components/CountdownTimer';
import EventStatus from './components/EventStatus';
import { formatEventDateTimeRange } from './utils/eventRegistrationUtils';
import { 
  getPublicEvents, 
  subscribeToPublicEvents, 
  getCategoryIcon,
  EVENT_CATEGORIES 
} from './utils/eventsService';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [filter, setFilter] = useState('all');

  // Load events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading public events...');
        const publicEvents = await getPublicEvents(filter === 'all' ? 'ALL' : filter);
        setEvents(publicEvents);
        console.log('✅ Loaded public events:', publicEvents.length);
        console.log('📋 Events data:', publicEvents);
      } catch (error) {
        console.error('❌ Error loading events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [filter]);

  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToPublicEvents((updatedEvents) => {
      setEvents(updatedEvents);
      setLoading(false);
    }, filter === 'all' ? 'ALL' : filter);

    return () => unsubscribe();
  }, [filter]);

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.category.toLowerCase() === filter.toLowerCase()
  );

  const categories = ['all', ...new Set(events.map(event => event.category))];

  if (loading) {
    return (
      <div className="events-container">
        <div className="events-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">🌟 Discover & Engage</span>
              <br />
              Upcoming Youth Events
            </h1>
            <p className="hero-subtitle">
              Join meaningful activities that create positive impact in your community
            </p>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-container">
      {/* Hero Section */}
      <div className="events-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">🌟 Discover & Engage</span>
            <br />
            Upcoming Youth Events
          </h1>
          <p className="hero-subtitle">
            Join meaningful activities that create positive impact in your community
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-tab ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category === 'all' ? 'All Events' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className={`event-card ${event.featured ? 'featured' : ''} ${hoveredEvent === event.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
              style={{ '--event-color': event.color }}
            >
              <div className="event-image-container">
                <img src={event.image} alt={event.title} className="event-image" />
                {event.featured && (
                  <div className="featured-badge">
                    <span className="badge-icon">⭐</span>
                    Featured
                  </div>
                )}
                <div className="image-overlay">
                  <div className="overlay-content">
                    <span className="category-icon">{getCategoryIcon(event.category)}</span>
                    <span className="category-text">{event.category}</span>
                  </div>
                </div>
              </div>

              <div className="event-content">
                <div className="event-header">
                  <div className="event-title-row">
                    <h2 className="event-title">{event.title}</h2>
                    <EventStatus 
                      event={event}
                      variant="compact"
                      className="header-integration"
                    />
                  </div>
                  <div className="event-countdown">
                    <CountdownTimer 
                      targetDate={event.startDateTime || event.startTime || event.date} 
                      className="compact primary"
                      onComplete={() => console.log(`Event ${event.title} has started!`)}
                    />
                  </div>
                  <div className="event-meta">
                    <div className="event-datetime-container">
                      <span className="event-date">
                        {formatEventDateTimeRange(event.startDateTime || event.startTime, event.endDateTime || event.endTime)}
                      </span>
                    </div>
                    <span className="event-location">{event.location}</span>
                  </div>
                </div>
                
                <div className="event-description">
                  {event.description}
                </div>

                {/* Public-only message */}
                <div className="public-message">
                  <div className="public-info">
                    <span className="info-icon">ℹ️</span>
                    <span className="info-text">
                      Sign up to join events and track your volunteer hours
                    </span>
                  </div>
                  <button 
                    className="signup-cta"
                    onClick={() => navigate('/join')}
                  >
                    Join YouthInAction
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-events">
            <div className="no-events-content">
              <h3>No events found</h3>
              <p>No events match your current filter. Try selecting a different category.</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="events-stats">
        <div className="stats-title">Our Impact</div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Active Volunteers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Events Hosted</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">15+</div>
            <div className="stat-label">Communities Served</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;