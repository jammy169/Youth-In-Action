// RegistrationCharts.jsx
import React from 'react';
import './RegistrationCharts.css';

const RegistrationCharts = ({ stats }) => {
  // Calculate percentages for pie chart
  const total = stats.total || 1; // Avoid division by zero
  const pendingPercent = ((stats.pending || 0) / total) * 100;
  const approvedPercent = ((stats.approved || 0) / total) * 100;
  const attendedPercent = ((stats.attended || 0) / total) * 100;
  const absentPercent = ((stats.absent || 0) / total) * 100;
  const rejectedPercent = ((stats.rejected || 0) / total) * 100;

  // Calculate angles for pie chart
  const pendingAngle = (pendingPercent / 100) * 360;
  const approvedAngle = (approvedPercent / 100) * 360;
  const attendedAngle = (attendedPercent / 100) * 360;
  const absentAngle = (absentPercent / 100) * 360;
  const rejectedAngle = (rejectedPercent / 100) * 360;

  return (
    <div className="registration-charts">
      <div className="charts-header">
        <h2>📊 Registration Analytics</h2>
        <p>Visual breakdown of registration statuses</p>
      </div>

      <div className="charts-container">
        {/* Pie Chart */}
        <div className="chart-section">
          <h3>📈 Status Distribution</h3>
          <div className="pie-chart-container">
            <div className="pie-chart">
              <div className="pie-slice pending" style={{ 
                transform: `rotate(0deg)`, 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(pendingAngle * Math.PI / 180)}% ${50 + 50 * Math.sin(pendingAngle * Math.PI / 180)}%)` 
              }}></div>
              <div className="pie-slice approved" style={{ 
                transform: `rotate(${pendingAngle}deg)`, 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(approvedAngle * Math.PI / 180)}% ${50 + 50 * Math.sin(approvedAngle * Math.PI / 180)}%)` 
              }}></div>
              <div className="pie-slice attended" style={{ 
                transform: `rotate(${pendingAngle + approvedAngle}deg)`, 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(attendedAngle * Math.PI / 180)}% ${50 + 50 * Math.sin(attendedAngle * Math.PI / 180)}%)` 
              }}></div>
              <div className="pie-slice absent" style={{ 
                transform: `rotate(${pendingAngle + approvedAngle + attendedAngle}deg)`, 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(absentAngle * Math.PI / 180)}% ${50 + 50 * Math.sin(absentAngle * Math.PI / 180)}%)` 
              }}></div>
              <div className="pie-slice rejected" style={{ 
                transform: `rotate(${pendingAngle + approvedAngle + attendedAngle + absentAngle}deg)`, 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(rejectedAngle * Math.PI / 180)}% ${50 + 50 * Math.sin(rejectedAngle * Math.PI / 180)}%)` 
              }}></div>
            </div>
            <div className="pie-chart-center">
              <div className="center-text">
                <div className="center-number">{stats.total}</div>
                <div className="center-label">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-section">
          <h3>📊 Status Breakdown</h3>
          <div className="bar-chart">
            <div className="bar-item">
              <div className="bar-label">Pending</div>
              <div className="bar-container">
                <div 
                  className="bar pending-bar" 
                  style={{ width: `${pendingPercent}%` }}
                ></div>
                <span className="bar-value">{stats.pending || 0}</span>
              </div>
            </div>
            <div className="bar-item">
              <div className="bar-label">Approved</div>
              <div className="bar-container">
                <div 
                  className="bar approved-bar" 
                  style={{ width: `${approvedPercent}%` }}
                ></div>
                <span className="bar-value">{stats.approved || 0}</span>
              </div>
            </div>
            <div className="bar-item">
              <div className="bar-label">Attended</div>
              <div className="bar-container">
                <div 
                  className="bar attended-bar" 
                  style={{ width: `${attendedPercent}%` }}
                ></div>
                <span className="bar-value">{stats.attended || 0}</span>
              </div>
            </div>
            <div className="bar-item">
              <div className="bar-label">Absent</div>
              <div className="bar-container">
                <div 
                  className="bar absent-bar" 
                  style={{ width: `${absentPercent}%` }}
                ></div>
                <span className="bar-value">{stats.absent || 0}</span>
              </div>
            </div>
            <div className="bar-item">
              <div className="bar-label">Rejected</div>
              <div className="bar-container">
                <div 
                  className="bar rejected-bar" 
                  style={{ width: `${rejectedPercent}%` }}
                ></div>
                <span className="bar-value">{stats.rejected || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="chart-legend">
        <h4>🎨 Status Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color pending"></div>
            <span>Pending ({stats.pending || 0})</span>
          </div>
          <div className="legend-item">
            <div className="legend-color approved"></div>
            <span>Approved ({stats.approved || 0})</span>
          </div>
          <div className="legend-item">
            <div className="legend-color attended"></div>
            <span>Attended ({stats.attended || 0})</span>
          </div>
          <div className="legend-item">
            <div className="legend-color absent"></div>
            <span>Absent ({stats.absent || 0})</span>
          </div>
          <div className="legend-item">
            <div className="legend-color rejected"></div>
            <span>Rejected ({stats.rejected || 0})</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="summary-item">
          <div className="summary-icon">⏳</div>
          <div className="summary-content">
            <div className="summary-label">Pending Review</div>
            <div className="summary-value">{pendingPercent.toFixed(1)}%</div>
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <div className="summary-label">Approval Rate</div>
            <div className="summary-value">
              {total > 0 ? (((stats.approved || 0) + (stats.attended || 0)) / total * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-icon">🎯</div>
          <div className="summary-content">
            <div className="summary-label">Attendance Rate</div>
            <div className="summary-value">
              {(stats.approved || 0) > 0 ? (((stats.attended || 0) / (stats.approved || 1)) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-icon">⏰</div>
          <div className="summary-content">
            <div className="summary-label">Total Service Hours</div>
            <div className="summary-value">{stats.totalServiceHours?.toFixed(1) || 0}h</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationCharts;
