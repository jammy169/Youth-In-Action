import React, { useState } from 'react';
import './Support.css';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    supportType: 'general'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Support form submitted:', formData);
    alert('Thank you for your support! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '', supportType: 'general' });
  };

  return (
    <div className="support-container">
      {/* Hero Section */}
      <div className="support-hero">
        <div className="hero-content">
          <h1 className="hero-title">Support YouthInAction</h1>
          <p className="hero-subtitle">Help us make a difference in our community</p>
        </div>
      </div>

      {/* Support Options */}
      <div className="support-options">
        <div className="support-card">
          <div className="card-icon">💰</div>
          <h3>Financial Support</h3>
          <p>Donate to help us organize more events and reach more youth in our community.</p>
          <button className="support-btn">Donate Now</button>
        </div>

        <div className="support-card">
          <div className="card-icon">🤝</div>
          <h3>Volunteer</h3>
          <p>Join our team as a volunteer and help us organize events and activities.</p>
          <button className="support-btn">Volunteer</button>
        </div>

        <div className="support-card">
          <div className="card-icon">📢</div>
          <h3>Spread the Word</h3>
          <p>Share our mission with friends and family to help us grow our community.</p>
          <button className="support-btn">Share</button>
        </div>
      </div>

      {/* Contact Form */}
      <div className="support-form-section">
        <h2>Get in Touch</h2>
        <p>Have questions or suggestions? We'd love to hear from you!</p>
        
        <form className="support-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="supportType">How can we help? *</label>
            <select
              id="supportType"
              name="supportType"
              value={formData.supportType}
              onChange={handleChange}
              required
            >
              <option value="general">General Inquiry</option>
              <option value="volunteer">Volunteer Opportunity</option>
              <option value="donation">Donation Information</option>
              <option value="partnership">Partnership</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Support;
