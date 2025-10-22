// UserNotificationCharts.jsx
import React from 'react';
import VolunteerStatsChart from './VolunteerStatsChart';
import './UserNotificationCharts.css';

const UserNotificationCharts = ({ registrations }) => {
  // Calculate user-specific statistics
  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    attended: registrations.filter(r => r.status === 'attended').length,
    absent: registrations.filter(r => r.status === 'absent').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
    totalServiceHours: registrations.reduce((sum, r) => sum + (r.serviceHours || 0), 0)
  };

  // Calculate percentages
  const total = stats.total || 1;
  const pendingPercent = ((stats.pending || 0) / total) * 100;
  const approvedPercent = ((stats.approved || 0) / total) * 100;
  const attendedPercent = ((stats.attended || 0) / total) * 100;
  const absentPercent = ((stats.absent || 0) / total) * 100;
  const rejectedPercent = ((stats.rejected || 0) / total) * 100;

  if (stats.total === 0) {
    return (
      <div className="user-charts-empty">
        <div className="empty-charts-icon">📊</div>
        <h3>No Data Yet</h3>
        <p>Register for events to see your personal analytics!</p>
      </div>
    );
  }

  return (
    <div className="user-notification-charts">
      <div className="user-charts-header">
        <h3>📊 Your Registration Analytics</h3>
        <p>Personal insights into your volunteer journey</p>
      </div>

      {/* Use the new, clear VolunteerStatsChart component */}
      <VolunteerStatsChart stats={stats} />
    </div>
  );
};

export default UserNotificationCharts;

