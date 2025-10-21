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
import { calculateImpactStats, formatStatsForDisplay } from './utils/impactStats';
import { debugImpactStats, quickDataCheck } from './utils/debugImpactStats';
import ImpactCharts from './components/ImpactCharts';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [filter, setFilter] = useState('all');
  const [impactStats, setImpactStats] = useState({
    activeVolunteers: '0',
    eventsHosted: '0',
    communitiesServed: '0'
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);

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

  // Load impact statistics
  useEffect(() => {
    const loadImpactStats = async () => {
      try {
        setStatsLoading(true);
        console.log('🔄 Loading impact statistics...');
        const rawStats = await calculateImpactStats();
        const formattedStats = formatStatsForDisplay(rawStats);
        setImpactStats(formattedStats);
        console.log('✅ Impact statistics loaded:', formattedStats);
      } catch (error) {
        console.error('❌ Error loading impact statistics:', error);
        // Keep default values if loading fails
      } finally {
        setStatsLoading(false);
      }
    };

    loadImpactStats();
  }, []);

  // Debug function to check database contents
  const handleDebugStats = async () => {
    console.log('🔍 Running debug check...');
    const debugResults = await quickDataCheck();
    setDebugInfo(debugResults);
    await debugImpactStats();
  };

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
                      endDate={event.endDateTime || event.endTime}
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

      {/* Impact Charts Section */}
      <ImpactCharts stats={impactStats} loading={statsLoading} />
      
      {/* Debug Button - Remove this in production */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={handleDebugStats}
          style={{
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔍 Debug Database (Check Console)
        </button>
        {debugInfo && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '5px',
            fontSize: '12px'
          }}>
            <strong>Database Contents:</strong><br/>
            Events: {debugInfo.events} | 
            Registrations: {debugInfo.registrations} | 
            EventRegistrations: {debugInfo.eventRegistrations} | 
            Users: {debugInfo.users}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;