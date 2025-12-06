import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addSecureAdmin, getSecureAdminEmails } from './utils/secureAdminSetup';
import './Auth.css';

const SecureAdminSetup = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const success = addSecureAdmin(email);
      
      if (success) {
        setMessage(`✅ Admin email added: ${email}`);
        setMessageType('success');
        setEmail('');
      } else {
        setMessage(`⚠️ Admin email already exists: ${email}`);
        setMessageType('warning');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const currentAdmins = getSecureAdminEmails();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-left">
          <h2>🔐 Secure Admin Setup</h2>
          <p>Manage admin accounts securely</p>
          <button 
            className="auth-button"
            onClick={() => navigate('/admin-signin')}
          >
            Back to Admin Sign In
          </button>
        </div>
        <div className="auth-right">
          <h2>Admin Management</h2>
          <p className="login-instruction">Add admin emails to secure list</p>
          
          <form onSubmit={handleAddAdmin} className="auth-form">
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Admin Email" 
              required 
            />
            
            {message && (
              <div className={`${messageType}-message`}>
                {message}
              </div>
            )}
            
            <button 
              type="submit" 
              className="auth-submit-button"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Admin Email'}
            </button>
          </form>

          <div className="admin-list">
            <h3>Current Admin Emails:</h3>
            {currentAdmins.length > 0 ? (
              <ul>
                {currentAdmins.map((adminEmail, index) => (
                  <li key={index}>{adminEmail}</li>
                ))}
              </ul>
            ) : (
              <p>No admin emails configured yet.</p>
            )}
          </div>

          <div className="security-notice">
            <h4>🔒 Security Instructions:</h4>
            <ol>
              <li><strong>Create Firebase Account:</strong> Go to Firebase Console → Authentication → Users → Add User</li>
              <li><strong>Add Email Here:</strong> Use the form above to add the email to admin list</li>
              <li><strong>Test Access:</strong> Try signing in at /admin-signin</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureAdminSetup;













