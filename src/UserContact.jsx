import React, { useState } from 'react';

const UserContact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Send the form data to your backend or email service
  };

  return (
    <div style={{ backgroundColor: '#1C1C1E', minHeight: '100vh', color: '#fff' }}>
      <div
        className="contact-container"
        style={{
          marginTop: 30,
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Contact Us</h1>
        <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
          Have questions or want to get in touch? Fill out the form below and we'll get back to you soon!
        </p>
        {submitted ? (
          <div style={{ color: '#4CAF50', fontSize: '1.2rem', marginTop: '2rem' }}>
            Thank you for contacting us! We'll respond as soon as possible.
          </div>
        ) : (
          <form
            className="contact-form"
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              width: '100%',
              maxWidth: 400,
              background: 'rgba(255,255,255,0.9)',
              padding: '2rem',
              borderRadius: 8,
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#000',
            }}
          >
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              style={{
                padding: '0.8rem',
                border: '1px solid #ccc',
                borderRadius: 5,
                fontSize: '1rem',
                width: '100%',
              }}
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              style={{
                padding: '0.8rem',
                border: '1px solid #ccc',
                borderRadius: 5,
                fontSize: '1rem',
                width: '100%',
              }}
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows={5}
              style={{
                padding: '0.8rem',
                border: '1px solid #ccc',
                borderRadius: 5,
                fontSize: '1rem',
                width: '100%',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.8rem',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '1rem',
                width: '100%',
              }}
            >
              Send Message
            </button>
          </form>
        )}
      </div>

      {/* Footer Section */}
      <footer className="user-events-footer" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', padding: '2rem', backgroundColor: '#3f423c', color: '#fff' }}>
        <div className="footer-col" style={{ flex: '1 1 300px', margin: '1rem' }}>
          <h3>YouthInAction Japan</h3>
          <p>
            Get involved in volunteering today for the better future of Tokyo.
            All donations proceed directly to local charities.
          </p>
          <p style={{ marginTop: '1rem' }}>Email: youthinaction@gmail.com</p>
        </div>

        <div className="footer-col" style={{ flex: '1 1 300px', margin: '1rem' }}>
          <h3>Get Monthly Updates</h3>
          <p>Enter your email here *</p>
          <input type="email" placeholder="Your email" className="footer-input" style={{ padding: '0.5rem', width: '100%', marginTop: '0.5rem' }} />
          <button className="footer-signup" style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: 4 }}>Sign Up!</button>
        </div>

        <div className="footer-col" style={{ flex: '1 1 300px', margin: '1rem' }}>
          <h3>Quick Links</h3>
          <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/about" style={{ color: '#fff', textDecoration: 'none' }}>About</a></li>
            <li><a href="/support" style={{ color: '#fff', textDecoration: 'none' }}>Support Us</a></li>
            <li><a href="/news" style={{ color: '#fff', textDecoration: 'none' }}>News</a></li>
            <li><a href="/userevents" style={{ color: '#fff', textDecoration: 'none' }}>Events</a></li>
            <li><a href="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact</a></li>
          </ul>
        </div>
      </footer>
      <div className="user-events-copyright">
        © 2025 by YouthInAction. | <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Use</a> | <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
      </div>
    </div>
  );
};

export default UserContact;
