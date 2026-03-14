import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';

const events = [
  {
    id: 1,
    title: 'Clean-Up Drive',
    date: '2025-10-15',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3',
    description: 'Mobilize youth to help clean streets, rivers, or public spaces.',
    featured: true,
  },
  {
    id: 2,
    title: 'Tree Planting Activity',
    date: '2025-09-10',
    image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-4.0.3',
    description: 'Promote environmental awareness and community involvement.',
    featured: true,
  },
  {
    id: 3,
    title: 'Health Awareness Campaign',
    date: '2025-08-05',
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3',
    description: 'Educate youth on relevant and pressing health issues.',
    featured: true,
  },
  {
    id: 4,
    title: 'Disaster Preparedness Training',
    date: '2025-08-05',
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3',
    description: 'Educate and train youth on emergency response and safety.',
    featured: false,
  },
  {
    id: 5,
    title: 'Blood Donation Drive',
    date: '2025-08-05',
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3',
    description: 'Partner with health orgs to encourage volunteerism.',
    featured: false,
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
