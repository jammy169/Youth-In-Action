import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';

const events = [
  {
    id: 1,
    title: 'Youth Leadership Summit',
    date: '2023-03-15',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3',
    description: 'Inspiring talks and networking with Youths.',
    featured: true,
  },
  {
    id: 2,
    title: 'Community Service Day',
    date: '2023-04-10',
    image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-4.0.3',
    description: 'Take action and give back to the local community.',
    featured: false,
  },
  {
    id: 3,
    title: 'Global Youth Conference',
    date: '2023-05-05',
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3',
    description: 'Unite with change-makers from around the world.',
    featured: true,
  },
];

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Events = () => {
  const navigate = useNavigate();

  return (
    <section className="events-container">
      <h1>🌟 Discover & Engage: Upcoming Youth Events</h1>
      <div className="events-list">
        {events.map((event) => (
          <div key={event.id} className={`event-card ${event.featured ? 'featured' : ''}`}>
            <img src={event.image} alt={event.title} className="event-image" />
            {event.featured && <div className="featured-badge">Featured</div>}
            <h2>{event.title}</h2>
            <p className="event-date">{formatDate(event.date)}</p>
            <p className="event-description">{event.description}</p>
            <button className="cta-button" onClick={() => navigate('/signin')}>
              Join Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Events;
