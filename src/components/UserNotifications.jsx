// UserNotifications.jsx
// Component to show user notifications and status updates

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import './UserNotifications.css';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    if (auth.currentUser) {
      loadUserNotifications();
    }
  }, [auth.currentUser]);

  const loadUserNotifications = async () => {
    try {
      setLoading(true);
      
      // Get user's registrations
      const registrationsRef = collection(db, 'registrations');
      const q = query(
        registrationsRef, 
        where('email', '==', auth.currentUser.email),
        orderBy('statusUpdatedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const userRegistrations = [];
      
      snapshot.forEach((doc) => {
        userRegistrations.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Create notification objects from registrations
      const notificationList = userRegistrations.map(reg => ({
        id: reg.id,
        type: 'registration_update',
        title: getNotificationTitle(reg),
        message: getNotificationMessage(reg),
        status: reg.status,
        eventTitle: reg.eventTitle,
        eventDate: reg.eventDate,
        eventLocation: reg.eventLocation,
        timestamp: reg.statusUpdatedAt || reg.registrationDate,
        icon: getStatusIcon(reg.status),
        color: getStatusColor(reg.status)
      }));
      
      setNotifications(notificationList);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationTitle = (registration) => {
    switch (registration.status) {
      case 'approved':
        return 'Registration Approved! 🎉';
      case 'rejected':
        return 'Registration Update';
      case 'cancelled':
        return 'Event Cancelled';
      case 'attended':
        return 'Event Completed! ✅';
      case 'absent':
        return 'Attendance Marked';
      default:
        return 'Registration Update';
    }
  };

  const getNotificationMessage = (registration) => {
    switch (registration.status) {
      case 'approved':
        return `Your registration for "${registration.eventTitle}" has been approved! You can now attend this event.`;
      case 'rejected':
        return `Your registration for "${registration.eventTitle}" could not be approved at this time.`;
      case 'cancelled':
        return `The event "${registration.eventTitle}" has been cancelled.`;
      case 'attended':
        return `You have been marked as attended for "${registration.eventTitle}". Great job!`;
      case 'absent':
        return `You were marked as absent for "${registration.eventTitle}".`;
      default:
        return `Your registration status for "${registration.eventTitle}" has been updated.`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'cancelled': return '🚫';
      case 'attended': return '🎉';
      case 'absent': return '⏰';
      case 'pending': return '⏳';
      default: return '📝';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'cancelled': return '#6c757d';
      case 'attended': return '#17a2b8';
      case 'absent': return '#ffc107';
      case 'pending': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="notifications-loading">
        <div className="loading-spinner">🔄</div>
        <p>Loading your notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-error">
        <h3>❌ Error Loading Notifications</h3>
        <p>{error}</p>
        <button onClick={loadUserNotifications}>🔄 Try Again</button>
      </div>
    );
  }

  return (
    <div className="user-notifications">
      <div className="notifications-header">
        <h1>🔔 Your Notifications</h1>
        <p>Stay updated on your event registrations and status changes</p>
        <button 
          className="btn-refresh" 
          onClick={loadUserNotifications}
        >
          🔄 Refresh
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <div className="no-notifications-icon">📭</div>
          <h3>No Notifications Yet</h3>
          <p>You'll receive notifications when your registration status changes.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-card ${notification.status}`}
            >
              <div className="notification-header">
                <div className="notification-icon" style={{ color: notification.color }}>
                  {notification.icon}
                </div>
                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                </div>
                <div className="notification-time">
                  {formatDate(notification.timestamp)}
                </div>
              </div>
              
              <div className="notification-details">
                <div className="event-info">
                  <h4>📅 {notification.eventTitle}</h4>
                  {notification.eventDate && (
                    <p><strong>Date:</strong> {new Date(notification.eventDate).toLocaleDateString()}</p>
                  )}
                  {notification.eventLocation && (
                    <p><strong>Location:</strong> {notification.eventLocation}</p>
                  )}
                </div>
                
                <div className="status-info">
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: notification.color }}
                  >
                    <span className="status-icon">{notification.icon}</span>
                    <span className="status-text">{notification.status.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="notifications-info">
        <h3>ℹ️ About Notifications</h3>
        <ul>
          <li>📧 You'll receive email notifications when your status changes</li>
          <li>📱 Check this page regularly for updates</li>
          <li>🔄 Status changes happen when admins review your registration</li>
          <li>📞 Contact us if you have questions about your status</li>
        </ul>
      </div>
    </div>
  );
};

export default UserNotifications;
