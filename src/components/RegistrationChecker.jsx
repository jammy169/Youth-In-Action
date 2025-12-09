// RegistrationChecker.jsx
// Component to check existing registrations and their status

import React, { useState, useEffect } from 'react';
import { checkAllRegistrations, getRegistrationStats } from '../utils/checkExistingRegistrations';
import './RegistrationChecker.css';

const RegistrationChecker = () => {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRegistrations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await checkAllRegistrations();
      if (result.success) {
        setRegistrations(result.registrations);
        setStats(result.statusCounts);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'cancelled': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'cancelled': return '🚫';
      default: return '❓';
    }
  };

  return (
    <div className="registration-checker">
      <div className="checker-header">
        <h1>🔍 Registration Database Checker</h1>
        <p>Check all existing registrations and their current status</p>
        <button 
          className="btn-refresh" 
          onClick={loadRegistrations}
          disabled={loading}
        >
          {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ Error: {error}
        </div>
      )}

      {stats && (
        <div className="stats-overview">
          <h2>📊 Registration Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-number">{stats.total || 0}</div>
              <div className="stat-label">Total Registrations</div>
            </div>
            <div className="stat-card pending">
              <div className="stat-number">{stats.pending || 0}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card approved">
              <div className="stat-number">{stats.approved || 0}</div>
              <div className="stat-label">Approved</div>
            </div>
            <div className="stat-card rejected">
              <div className="stat-number">{stats.rejected || 0}</div>
              <div className="stat-label">Rejected</div>
            </div>
            <div className="stat-card cancelled">
              <div className="stat-number">{stats.cancelled || 0}</div>
              <div className="stat-label">Cancelled</div>
            </div>
          </div>
        </div>
      )}

      <div className="registrations-list">
        <h2>📋 All Registrations</h2>
        {loading ? (
          <div className="loading">🔄 Loading registrations...</div>
        ) : registrations.length === 0 ? (
          <div className="no-data">📭 No registrations found</div>
        ) : (
          <div className="registrations-grid">
            {registrations.map((reg, index) => (
              <div key={reg.id} className="registration-card">
                <div className="card-header">
                  <div className="user-info">
                    <h3>{reg.firstName} {reg.lastName}</h3>
                    <p className="email">{reg.email}</p>
                  </div>
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(reg.status) }}
                  >
                    <span className="status-icon">{getStatusIcon(reg.status)}</span>
                    <span className="status-text">{reg.status}</span>
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="event-info">
                    <h4>📅 {reg.eventTitle}</h4>
                    <p><strong>Event ID:</strong> {reg.eventId}</p>
                    <p><strong>Registered:</strong> {new Date(reg.registrationDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="contact-info">
                    <p><strong>Phone:</strong> {reg.phone}</p>
                    <p><strong>Age:</strong> {reg.age}</p>
                    {reg.emergencyContact && (
                      <p><strong>Emergency:</strong> {reg.emergencyContact}</p>
                    )}
                  </div>
                  
                  {reg.motivation && (
                    <div className="motivation">
                      <p><strong>Motivation:</strong></p>
                      <p className="motivation-text">{reg.motivation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationChecker;








