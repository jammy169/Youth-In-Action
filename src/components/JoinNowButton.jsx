import React, { useState } from 'react';
import './JoinNowButton.css';

const JoinNowButton = ({ image, date, location, title }) => {
  const [showModal, setShowModal] = useState(false);

  const handleJoinNow = () => { 
    setShowModal(true);
  };

  // Determine a default image based on the event title, if no image prop is provided.
  const defaultImage = title && title.toLowerCase().includes("beach")
    ? "https://www.undp.org/sites/g/files/zskgke326/files/migration/gh/UNDP_Ghana_Beach_Clean_Up--1.jpg"  // Replace with your beach cleanup image URL
    : "https://www.undp.org/sites/g/files/zskgke326/files/migration/gh/UNDP_Ghana_Beach_Clean_Up--1.jpg"; // Replace with your generic event image URL

  const imgSrc = image || defaultImage;

  return (
    <div className="event-card">
      <div className="event-image">
        <img src={imgSrc} alt={title} />
      </div>
      <div className="event-details">
        <h2 className="event-title">{title}</h2>
        <p className="event-date"><strong>Date:</strong> {date}</p>
        <p className="event-location"><strong>Location:</strong> {location}</p>
      </div>
      <button className="join-now-btn" onClick={handleJoinNow}>
        REGISTER NOW
      </button>
      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Registration Successful!</h3>
            <p>Thank you for joining the cleanup event.</p>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinNowButton;