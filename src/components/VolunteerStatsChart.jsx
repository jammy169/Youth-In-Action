import React from 'react';
import './VolunteerStatsChart.css';

const VolunteerStatsChart = ({ stats }) => {
  const { pending, approved, attended, absent, rejected, total } = stats;
  
  // Calculate percentages
  const pendingPercent = total > 0 ? (pending / total) * 100 : 0;
  const approvedPercent = total > 0 ? (approved / total) * 100 : 0;
  const attendedPercent = total > 0 ? (attended / total) * 100 : 0;
  const absentPercent = total > 0 ? (absent / total) * 100 : 0;
  const rejectedPercent = total > 0 ? (rejected / total) * 100 : 0;

  // Calculate approval rate
  const approvalRate = total > 0 ? ((approved + attended) / total) * 100 : 0;
  
  // Calculate attendance rate
  const attendanceRate = approved + attended > 0 ? (attended / (approved + attended)) * 100 : 0;

  // Calculate total service hours
  const totalServiceHours = stats.totalServiceHours || 0;

  return (
    <div className="volunteer-stats-dashboard">
      <div className="dashboard-header">
        <h2>Personal insights into your volunteer journey</h2>
      </div>

      <div className="dashboard-content">
        {/* Modern Donut Chart */}
        <div className="status-overview">
          <div className="modern-donut-container">
            <div className="donut-chart">
              {/* Donut segments */}
              <div className="donut-segment pending" style={{ 
                '--percentage': `${pendingPercent}%`,
                '--start-angle': '0deg',
                '--end-angle': `${pendingPercent * 3.6}deg`
              }}></div>
              <div className="donut-segment approved" style={{ 
                '--percentage': `${approvedPercent}%`,
                '--start-angle': `${pendingPercent * 3.6}deg`,
                '--end-angle': `${(pendingPercent + approvedPercent) * 3.6}deg`
              }}></div>
              <div className="donut-segment attended" style={{ 
                '--percentage': `${attendedPercent}%`,
                '--start-angle': `${(pendingPercent + approvedPercent) * 3.6}deg`,
                '--end-angle': `${(pendingPercent + approvedPercent + attendedPercent) * 3.6}deg`
              }}></div>
              <div className="donut-segment absent" style={{ 
                '--percentage': `${absentPercent}%`,
                '--start-angle': `${(pendingPercent + approvedPercent + attendedPercent) * 3.6}deg`,
                '--end-angle': `${(pendingPercent + approvedPercent + attendedPercent + absentPercent) * 3.6}deg`
              }}></div>
              <div className="donut-segment rejected" style={{ 
                '--percentage': `${rejectedPercent}%`,
                '--start-angle': `${(pendingPercent + approvedPercent + attendedPercent + absentPercent) * 3.6}deg`,
                '--end-angle': `${(pendingPercent + approvedPercent + attendedPercent + absentPercent + rejectedPercent) * 3.6}deg`
              }}></div>
              
              {/* Center content */}
              <div className="donut-center">
                <div className="center-content">
                  <div className="center-number">{total}</div>
                  <div className="center-label">Total</div>
                </div>
              </div>
            </div>
            
            {/* Status indicators around the donut */}
            <div className="status-indicators">
              {pending > 0 && (
                <div className="status-indicator pending">
                  <div className="indicator-dot"></div>
                  <div className="indicator-text">
                    <span className="indicator-label">Pending</span>
                    <span className="indicator-count">{pending}</span>
                  </div>
                </div>
              )}
              {approved > 0 && (
                <div className="status-indicator approved">
                  <div className="indicator-dot"></div>
                  <div className="indicator-text">
                    <span className="indicator-label">Approved</span>
                    <span className="indicator-count">{approved}</span>
                  </div>
                </div>
              )}
              {attended > 0 && (
                <div className="status-indicator attended">
                  <div className="indicator-dot"></div>
                  <div className="indicator-text">
                    <span className="indicator-label">Attended</span>
                    <span className="indicator-count">{attended}</span>
                  </div>
                </div>
              )}
              {absent > 0 && (
                <div className="status-indicator absent">
                  <div className="indicator-dot"></div>
                  <div className="indicator-text">
                    <span className="indicator-label">Absent</span>
                    <span className="indicator-count">{absent}</span>
                  </div>
                </div>
              )}
              {rejected > 0 && (
                <div className="status-indicator rejected">
                  <div className="indicator-dot"></div>
                  <div className="indicator-text">
                    <span className="indicator-label">Rejected</span>
                    <span className="indicator-count">{rejected}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Breakdown with Progress Bars */}
        <div className="status-breakdown">
          <h3>Status Breakdown</h3>
          <div className="status-list">
            <div className="status-item">
              <div className="status-info">
                <span className="status-label">Pending</span>
                <span className="status-count">{pending}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill pending" 
                  style={{ width: `${pendingPercent}%` }}
                ></div>
              </div>
            </div>
            
            <div className="status-item">
              <div className="status-info">
                <span className="status-label">Approved</span>
                <span className="status-count">{approved}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill approved" 
                  style={{ width: `${approvedPercent}%` }}
                ></div>
              </div>
            </div>
            
            <div className="status-item">
              <div className="status-info">
                <span className="status-label">Attended</span>
                <span className="status-count">{attended}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill attended" 
                  style={{ width: `${attendedPercent}%` }}
                ></div>
              </div>
            </div>
            
            <div className="status-item">
              <div className="status-info">
                <span className="status-label">Absent</span>
                <span className="status-count">{absent}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill absent" 
                  style={{ width: `${absentPercent}%` }}
                ></div>
              </div>
            </div>
            
            <div className="status-item">
              <div className="status-info">
                <span className="status-label">Rejected</span>
                <span className="status-count">{rejected}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill rejected" 
                  style={{ width: `${rejectedPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer Stats Cards */}
        <div className="volunteer-stats">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{total}</div>
              <div className="stat-label">Total Applications</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{approvalRate.toFixed(1)}%</div>
              <div className="stat-label">Approval Rate</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-number">{attendanceRate.toFixed(1)}%</div>
              <div className="stat-label">Attendance Rate</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <div className="stat-number">{totalServiceHours.toFixed(1)}h</div>
              <div className="stat-label">Service Hours</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="status-legend">
          <div className="legend-item">
            <div className="legend-dot pending"></div>
            <span>Pending ({pending})</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot approved"></div>
            <span>Approved ({approved})</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot attended"></div>
            <span>Attended ({attended})</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot absent"></div>
            <span>Absent ({absent})</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot rejected"></div>
            <span>Rejected ({rejected})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerStatsChart;
