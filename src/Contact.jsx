import React, { useState } from 'react';
import './Contact.css';
import { db } from './firebaseConfig'; // Import the Firestore database
import { collection, addDoc } from 'firebase/firestore';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add a new document with a generated ID
      await addDoc(collection(db, 'messages'), {
        name,
        email,
        message,
        timestamp: new Date() // Optional: add a timestamp
      });
      setSuccessMessage('Your message has been sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setErrorMessage('There was an error sending your message. Please try again.');
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! Reach out to us with any questions or feedback.</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <textarea placeholder="Your Message" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
        <button type="submit">Send Message</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Contact;
