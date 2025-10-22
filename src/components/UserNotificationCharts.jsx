// UserNotificationCharts.jsx
import React from 'react';
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

      <div className="user-charts-grid">
        {/* Status Overview */}
        <div className="user-chart-section">
          <h4>📈 Status Overview</h4>
          <div className="user-pie-chart-container">
            <div className="user-pie-chart">
              <div className="user-pie-slice pending" style={{ 
                transform: `rotate(0deg)`, 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(pendingPercent * 3.6 * Math.PI / 180)}% ${50 + 50 * Math.sin(pendingPercent * 3.6 * Math.PI / 180)}%)` 
              }}></div>
              <div className="user-pie-slice approved" style={{ 
                transform: `rotate(${pendingPercent * 3.6}deg)`, 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(approvedPercent * 3.6 * Math.PI / 180)}% ${50 + 50 * Math.sin(approvedPercent * 3.6 * Math.PI / 180)}%)` 
              }}></div>
              <div className="user-pie-slice attended" style={{ 
                transform: `rotate(${(pendingPercent + approvedPercent) * 3.6}deg)`, 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(attendedPercent * 3.6 * Math.PI / 180)}% ${50 + 50 * Math.sin(attendedPercent * 3.6 * Math.PI / 180)}%)` 
              }}></div>
              <div className="user-pie-slice absent" style={{ 
                transform: `rotate(${(pendingPercent + approvedPercent + attendedPercent) * 3.6}deg)`, 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(absentPercent * 3.6 * Math.PI / 180)}% ${50 + 50 * Math.sin(absentPercent * 3.6 * Math.PI / 180)}%)` 
              }}></div>
              <div className="user-pie-slice rejected" style={{ 
                transform: `rotate(${(pendingPercent + approvedPercent + attendedPercent + absentPercent) * 3.6}deg)`, 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(rejectedPercent * 3.6 * Math.PI / 180)}% ${50 + 50 * Math.sin(rejectedPercent * 3.6 * Math.PI / 180)}%)` 
              }}></div>
            </div>
            <div className="user-pie-center">
              <div className="user-center-text">
                <div className="user-center-number">{stats.total}</div>
                <div className="user-center-label">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="user-chart-section">
          <h4>📊 Status Breakdown</h4>
          <div className="user-progress-bars">
            <div className="user-progress-item">
              <div className="user-progress-label">
                <span>⏳ Pending</span>
                <span className="user-progress-value">{stats.pending}</span>
              </div>
              <div className="user-progress-bar">
                <div 
                  className="user-progress-fill pending" 
                  style={{ width: `${pendingPercent}%` }}
                ></div>
              </div>
            </div>
            <div className="user-progress-item">
              <div className="user-progress-label">
                <span>✅ Approved</span>
                <span className="user-progress-value">{stats.approved}</span>
              </div>
              <div className="user-progress-bar">
                <div 
                  className="user-progress-fill approved" 
                  style={{ width: `${approvedPercent}%` }}
                ></div>
              </div>
            </div>
            <div className="user-progress-item">
              <div className="user-progress-label">
                <span>🎉 Attended</span>
                <span className="user-progress-value">{stats.attended}</span>
              </div>
              <div className="user-progress-bar">
                <div 
                  className="user-progress-fill attended" 
                  style={{ width: `${attendedPercent}%` }}
                ></div>
              </div>
            </div>
            <div className="user-progress-item">
              <div className="user-progress-label">
                <span>⏰ Absent</span>
                <span className="user-progress-value">{stats.absent}</span>
              </div>
              <div className="user-progress-bar">
                <div 
                  className="user-progress-fill absent" 
                  style={{ width: `${absentPercent}%` }}
                ></div>
              </div>
            </div>
            <div className="user-progress-item">
              <div className="user-progress-label">
                <span>❌ Rejected</span>
                <span className="user-progress-value">{stats.rejected}</span>
              </div>
              <div className="user-progress-bar">
                <div 
                  className="user-progress-fill rejected" 
                  style={{ width: `${rejectedPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Stats */}
      <div className="user-personal-stats">
        <h4>🏆 Your Volunteer Stats</h4>
        <div className="user-stats-grid">
          <div className="user-stat-card">
            <div className="user-stat-icon">📝</div>
            <div className="user-stat-content">
              <div className="user-stat-label">Total Applications</div>
              <div className="user-stat-value">{stats.total}</div>
            </div>
          </div>
          <div className="user-stat-card">
            <div className="user-stat-icon">✅</div>
            <div className="user-stat-content">
              <div className="user-stat-label">Approval Rate</div>
              <div className="user-stat-value">
                {total > 0 ? ((stats.approved / total) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
          <div className="user-stat-card">
            <div className="user-stat-icon">🎯</div>
            <div className="user-stat-content">
              <div className="user-stat-label">Attendance Rate</div>
              <div className="user-stat-value">
                {(stats.approved || 0) > 0 ? ((stats.attended / stats.approved) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
          <div className="user-stat-card">
            <div className="user-stat-icon">⏰</div>
            <div className="user-stat-content">
              <div className="user-stat-label">Service Hours</div>
              <div className="user-stat-value">{stats.totalServiceHours.toFixed(1)}h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="user-chart-legend">
        <div className="user-legend-items">
          <div className="user-legend-item">
            <div className="user-legend-color pending"></div>
            <span>Pending ({stats.pending})</span>
          </div>
          <div className="user-legend-item">
            <div className="user-legend-color approved"></div>
            <span>Approved ({stats.approved})</span>
          </div>
          <div className="user-legend-item">
            <div className="user-legend-color attended"></div>
            <span>Attended ({stats.attended})</span>
          </div>
          <div className="user-legend-item">
            <div className="user-legend-color absent"></div>
            <span>Absent ({stats.absent})</span>
          </div>
          <div className="user-legend-item">
            <div className="user-legend-color rejected"></div>
            <span>Rejected ({stats.rejected})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotificationCharts;

