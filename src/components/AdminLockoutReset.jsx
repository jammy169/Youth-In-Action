import React, { useState } from 'react';
import { clearFailedAttempts } from '../utils/adminSecurity';
import './AdminLockoutReset.css';

const AdminLockoutReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      setMessage('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      // Clear failed attempts for the email
      clearFailedAttempts(email);
      setMessage(`✅ Lockout cleared for ${email}. You can now try logging in again.`);
    } catch (error) {
      setMessage(`❌ Error clearing lockout: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lockout-reset-container">
      <div className="lockout-reset-box">
        <h2>🔓 Admin Lockout Reset</h2>
        <p>Clear account lockout for testing purposes</p>
        
        <div className="reset-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email to unlock"
            className="reset-input"
          />
          
          <button
            onClick={handleReset}
            disabled={loading}
            className="reset-button"
          >
            {loading ? 'Clearing...' : 'Clear Lockout'}
          </button>
        </div>
        
        {message && (
          <div className={`reset-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <div className="reset-info">
          <p><strong>Note:</strong> This is for development/testing only.</p>
          <p>In production, wait for the 15-minute lockout period to expire.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLockoutReset;


