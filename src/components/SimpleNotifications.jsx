// SimpleNotifications.jsx
// Simplified notifications component that doesn't require Firestore indexes

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import UserNotificationCharts from './UserNotificationCharts';
import './SimpleNotifications.css';

const SimpleNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Use onAuthStateChanged to properly handle auth state changes
    // This ensures it works on page refresh when Firebase is restoring the session
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserNotifications(currentUser);
      } else {
        setLoading(false);
        setError('Please sign in to view notifications');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array - only run once on mount

  const loadUserNotifications = async (currentUser = null) => {
    // Get the current user - prefer passed user, then state, then auth.currentUser
    const activeUser = currentUser || user || auth.currentUser;
    
    if (!activeUser) {
      setLoading(false);
      setError('Please sign in to view notifications');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading notifications for:', activeUser.email);
      
      // Get all registrations and filter client-side to avoid index requirements
      const registrationsRef = collection(db, 'registrations');
      const snapshot = await getDocs(registrationsRef);
      
      const userRegistrations = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email === activeUser.email) {
          userRegistrations.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      console.log('📊 Found registrations:', userRegistrations.length);
      
      // Sort by date (most recent first)
      userRegistrations.sort((a, b) => {
        const dateA = new Date(a.statusUpdatedAt || a.registrationDate || 0);
        const dateB = new Date(b.statusUpdatedAt || b.registrationDate || 0);
        return dateB - dateA;
      });
      
      setNotifications(userRegistrations);
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return {
          icon: '✅',
          title: 'Registration Approved!',
          message: 'Your registration has been approved!',
          color: '#28a745'
        };
      case 'rejected':
        return {
          icon: '❌',
          title: 'Registration Update',
          message: 'Your registration could not be approved at this time.',
          color: '#dc3545'
        };
      case 'pending':
        return {
          icon: '⏳',
          title: 'Registration Pending',
          message: 'Your registration is under review.',
          color: '#ffc107'
        };
      case 'attended':
        return {
          icon: '🎉',
          title: 'Event Completed!',
          message: 'You have been marked as attended for this event.',
          color: '#17a2b8'
        };
      case 'absent':
        return {
          icon: '⏰',
          title: 'Marked Absent',
          message: 'You were marked as absent for this event.',
          color: '#6c757d'
        };
      default:
        return {
          icon: '📝',
          title: 'Registration Update',
          message: 'Your registration status has been updated.',
          color: '#6c757d'
        };
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
      <div className="simple-notifications">
        <div className="notifications-header">
          <h1>🔔 Your Notifications</h1>
          <p>Loading your notifications...</p>
        </div>
        <div className="loading-spinner">🔄</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="simple-notifications">
        <div className="notifications-header">
          <h1>🔔 Your Notifications</h1>
        </div>
        <div className="error-message">
          <h3>❌ Error Loading Notifications</h3>
          <p>{error}</p>
          <button onClick={loadUserNotifications} className="retry-btn">
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-notifications">
      <div className="notifications-header">
        <h1>🔔 Your Notifications</h1>
        <p>Stay updated on your event registrations and status changes</p>
        <button 
          onClick={() => {
            // Ensure we have a user before refreshing
            const currentUser = user || auth.currentUser;
            if (currentUser) {
              loadUserNotifications(currentUser);
            } else {
              // If no user, wait a bit for auth to initialize
              setTimeout(() => {
                const retryUser = auth.currentUser;
                if (retryUser) {
                  loadUserNotifications(retryUser);
                } else {
                  setError('Please sign in to view notifications');
                }
              }, 500);
            }
          }} 
          className="refresh-btn"
        >
          🔄 Refresh
        </button>
      </div>

      {/* User Analytics Charts */}
      <UserNotificationCharts registrations={notifications} />

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <div className="no-notifications-icon">📭</div>
          <h3>No Notifications Yet</h3>
          <p>You'll receive notifications when your registration status changes.</p>
          <p>Register for an event to get started!</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => {
            const statusInfo = getStatusInfo(notification.status);
            
            return (
              <div key={notification.id} className="notification-card">
                <div className="notification-header">
                  <div className="notification-icon" style={{ color: statusInfo.color }}>
                    {statusInfo.icon}
                  </div>
                  <div className="notification-content">
                    <h3 className="notification-title">{statusInfo.title}</h3>
                    <p className="notification-message">{statusInfo.message}</p>
                  </div>
                  <div className="notification-time">
                    {formatDate(notification.statusUpdatedAt || notification.registrationDate)}
                  </div>
                </div>
                
                <div className="notification-details">
                  <div className="event-info">
                    <h4>📅 {notification.eventTitle || 'Unknown Event'}</h4>
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
                      style={{ backgroundColor: statusInfo.color }}
                    >
                      <span className="status-icon">{statusInfo.icon}</span>
                      <span className="status-text">{notification.status.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

export default SimpleNotifications;
