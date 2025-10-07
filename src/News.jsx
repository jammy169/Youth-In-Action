import React, { useState } from 'react';
import './News.css';

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const newsArticles = [
    {
      id: 1,
      title: "YouthInAction Launches New Community Garden Initiative",
      excerpt: "We're excited to announce our new community garden project in Toledo City, bringing together youth and families to grow fresh produce and build stronger communities.",
      date: "March 15, 2025",
      category: "community",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
      readTime: "3 min read"
    },
    {
      id: 2,
      title: "Successful Beach Cleanup Event Draws 200+ Volunteers",
      excerpt: "Our recent beach cleanup at Toledo City's coastline was a huge success, with over 200 volunteers participating and collecting 500+ kg of waste.",
      date: "March 10, 2025",
      category: "environment",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop",
      readTime: "4 min read"
    },
    {
      id: 3,
      title: "Youth Leadership Workshop Series Begins",
      excerpt: "We're launching a comprehensive leadership program designed to empower young people with essential skills for community leadership and civic engagement.",
      date: "March 8, 2025",
      category: "education",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
      readTime: "5 min read"
    },
    {
      id: 4,
      title: "Partnership with Local Schools Strengthens Impact",
      excerpt: "Our new partnership with Toledo City schools will bring environmental education and volunteer opportunities directly to students across the district.",
      date: "March 5, 2025",
      category: "partnership",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop",
      readTime: "3 min read"
    },
    {
      id: 5,
      title: "Digital Literacy Program for Senior Citizens",
      excerpt: "Youth volunteers are teaching digital skills to senior citizens, bridging the digital divide and strengthening intergenerational connections.",
      date: "March 1, 2025",
      category: "community",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop",
      readTime: "4 min read"
    },
    {
      id: 6,
      title: "Annual Youth Summit 2025 Registration Opens",
      excerpt: "Join us for our biggest event of the year! The Youth Summit will feature workshops, networking, and inspiring speakers from across the Philippines.",
      date: "February 28, 2025",
      category: "events",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
      readTime: "2 min read"
    }
  ];

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'community', name: 'Community' },
    { id: 'environment', name: 'Environment' },
    { id: 'education', name: 'Education' },
    { id: 'partnership', name: 'Partnership' },
    { id: 'events', name: 'Events' }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory);

  return (
    <div className="news-container">
      {/* Hero Section */}
      <div className="news-hero">
        <div className="hero-content">
          <h1 className="hero-title">Latest News & Updates</h1>
          <p className="hero-subtitle">Stay informed about our community impact and upcoming events</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="news-filter">
        <div className="filter-container">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* News Articles */}
      <div className="news-articles">
        <div className="articles-grid">
          {filteredArticles.map(article => (
            <article key={article.id} className="news-card">
              <div className="card-image">
                <img src={article.image} alt={article.title} />
                <div className="card-category">{article.category}</div>
              </div>
              
              <div className="card-content">
                <div className="card-meta">
                  <span className="card-date">{article.date}</span>
                  <span className="card-read-time">{article.readTime}</span>
                </div>
                
                <h3 className="card-title">{article.title}</h3>
                <p className="card-excerpt">{article.excerpt}</p>
                
                <button className="read-more-btn">Read More</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Get the latest news and updates delivered to your inbox</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button className="newsletter-btn">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
