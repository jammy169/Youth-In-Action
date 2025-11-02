// ModalTest.jsx
// Simple test component to verify the modal works

import React, { useState } from 'react';
import RegistrationSuccessModal from './RegistrationSuccessModal';

const ModalTest = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Modal Test</h1>
      <button 
        onClick={() => setShowModal(true)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4ECDC4',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Modal
      </button>

      <RegistrationSuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        eventTitle="Test Event"
        eventDate="Friday, October 31, 2025 at 08:00 AM"
        eventLocation="Test Location"
        registrationStatus="pending"
      />
    </div>
  );
};

export default ModalTest;




