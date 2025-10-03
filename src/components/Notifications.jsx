import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import './Notifications.css';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const auth = getAuth();

  useEffect(() => {
    if (auth.currentUser) {
      fetchNotifications();
    }
  }, [auth.currentUser]);

  const fetchNotifications = async () => {
    try {
      const userEmail = auth.currentUser.email;
      console.log('Fetching notifications for user email:', userEmail);
      
      const registrationsRef = collection(db, 'registrations');
      
      // First, get all registrations and filter client-side to avoid index requirement
      const q = query(registrationsRef);
      const querySnapshot = await getDocs(q);
      
      // Filter by email on the client side
      const notificationsList = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(registration => registration.email === userEmail)
        .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
      
      console.log('Found registrations:', notificationsList.length);
      console.log('Notifications list:', notificationsList);
      
      // If no registrations found, show all registrations for debugging
      if (notificationsList.length === 0) {
        console.log('No registrations found for user email. All registrations in database:');
        const allRegistrations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('All registrations:', allRegistrations);
      }
      
      setNotifications(notificationsList);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'approved':
        return 'Your registration has been approved! You can now attend the event.';
      case 'rejected':
        return 'Your registration has been rejected. Please contact us for more information.';
      case 'pending':
        return 'Your registration is under review. We will notify you once a decision is made.';
      default:
        return 'Registration status unknown.';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    return filter === 'all' || notification.status === filter;
  });

  const getNotificationStats = () => {
    const total = notifications.length;
    const pending = notifications.filter(n => n.status === 'pending').length;
    const approved = notifications.filter(n => n.status === 'approved').length;
    const rejected = notifications.filter(n => n.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  };

  const stats = getNotificationStats();

  // Chart data preparation
  const getChartData = () => {
    const { total, pending, approved, rejected } = stats;
    
    // Pie chart data for status distribution
    const pieData = [
      { name: 'Approved', value: approved, color: '#27ae60' },
      { name: 'Pending', value: pending, color: '#f39c12' },
      { name: 'Rejected', value: rejected, color: '#e74c3c' }
    ].filter(item => item.value > 0);

    // Bar chart data for monthly trends
    const monthlyData = notifications.reduce((acc, notification) => {
      const date = new Date(notification.registrationDate);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!acc[month]) {
        acc[month] = { approved: 0, pending: 0, rejected: 0, total: 0 };
      }
      
      acc[month][notification.status]++;
      acc[month].total++;
      
      return acc;
    }, {});

    const barData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    })).sort((a, b) => new Date(a.month) - new Date(b.month));

    // Line chart data for approval rate over time
    const lineData = barData.map(item => ({
      month: item.month,
      approvalRate: item.total > 0 ? Math.round((item.approved / item.total) * 100) : 0,
      totalRegistrations: item.total
    }));

    return { pieData, barData, lineData };
  };

  const chartData = getChartData();

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="loading">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <p>Stay updated with your event registration status</p>
      </div>

      <div className="notifications-content">
        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Registrations</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-value">{stats.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <div className="stat-value">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </div>

        {/* Advanced Charts Section */}
        <div className="charts-section">
          <h2 className="charts-title">📈 Registration Analytics</h2>
          
          {stats.total > 0 ? (
            <div className="charts-grid">
              {/* Pie Chart - Status Distribution */}
              <div className="chart-container">
                <h3>Status Distribution</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart - Monthly Trends */}
              {chartData.barData.length > 0 && (
                <div className="chart-container">
                  <h3>Monthly Registration Trends</h3>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="approved" stackId="a" fill="#27ae60" name="Approved" />
                        <Bar dataKey="pending" stackId="a" fill="#f39c12" name="Pending" />
                        <Bar dataKey="rejected" stackId="a" fill="#e74c3c" name="Rejected" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Line Chart - Approval Rate */}
              {chartData.lineData.length > 1 && (
                <div className="chart-container">
                  <h3>Approval Rate Over Time</h3>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData.lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value, name) => [name === 'approvalRate' ? `${value}%` : value, name === 'approvalRate' ? 'Approval Rate' : 'Total Registrations']} />
                        <Legend />
                        <Line type="monotone" dataKey="approvalRate" stroke="#27ae60" strokeWidth={3} name="Approval Rate" />
                        <Line type="monotone" dataKey="totalRegistrations" stroke="#3498db" strokeWidth={2} name="Total Registrations" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-charts-state">
              <div className="empty-charts-icon">📊</div>
              <h3>No Data Yet</h3>
              <p>Once you register for events, you'll see beautiful analytics charts here!</p>
              <div className="chart-preview">
                <div className="preview-chart">
                  <div className="preview-pie">
                    <div className="pie-slice approved"></div>
                    <div className="pie-slice pending"></div>
                    <div className="pie-slice rejected"></div>
                  </div>
                  <div className="preview-labels">
                    <span className="label approved">Approved</span>
                    <span className="label pending">Pending</span>
                    <span className="label rejected">Rejected</span>
                  </div>
                </div>
                <div className="preview-chart">
                  <div className="preview-bars">
                    <div className="bar approved" style={{height: '60%'}}></div>
                    <div className="bar pending" style={{height: '30%'}}></div>
                    <div className="bar rejected" style={{height: '10%'}}></div>
                  </div>
                  <div className="preview-labels">
                    <span>Monthly Trends</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending})
          </button>
          <button 
            className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved ({stats.approved})
          </button>
          <button 
            className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="no-notifications">
              <div className="no-notifications-icon">📭</div>
              <h3>No notifications found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't registered for any events yet." 
                  : `No ${filter} registrations found.`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div key={notification.id} className={`notification-card ${getStatusColor(notification.status)}`}>
                <div className="notification-header">
                  <div className="notification-icon">
                    {getStatusIcon(notification.status)}
                  </div>
                  <div className="notification-title">
                    <h3>{notification.eventTitle}</h3>
                    <span className={`status-badge ${getStatusColor(notification.status)}`}>
                      {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                    </span>
                  </div>
                  <div className="notification-date">
                    {formatDate(notification.registrationDate)}
                  </div>
                </div>
                
                <div className="notification-content">
                  <p className="notification-message">
                    {getStatusMessage(notification.status)}
                  </p>
                  
                  {notification.statusUpdatedAt && (
                    <div className="status-updated">
                      <small>
                        Status updated: {formatDate(notification.statusUpdatedAt)}
                      </small>
                    </div>
                  )}
                </div>

                <div className="notification-details">
                  <div className="detail-item">
                    <strong>Name:</strong> {notification.firstName} {notification.lastName}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {notification.email}
                  </div>
                  {notification.phone && (
                    <div className="detail-item">
                      <strong>Phone:</strong> {notification.phone}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 