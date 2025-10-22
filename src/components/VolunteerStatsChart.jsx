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
        {/* Status Overview with Clear Labels */}
        <div className="status-overview">
          <div className="status-chart-container">
            <div className="status-chart">
              <div className="chart-center">
                <div className="total-number">{total}</div>
                <div className="total-label">Total Applications</div>
              </div>
              
              {/* Status Segments with Clear Labels */}
              {pending > 0 && (
                <div 
                  className="status-segment pending" 
                  style={{ 
                    '--percentage': `${pendingPercent}%`,
                    '--color': '#FFA726'
                  }}
                  title={`Pending: ${pending} applications (${pendingPercent.toFixed(1)}%)`}
                >
                  <div className="segment-label">Pending</div>
                  <div className="segment-count">{pending}</div>
                </div>
              )}
              
              {approved > 0 && (
                <div 
                  className="status-segment approved" 
                  style={{ 
                    '--percentage': `${approvedPercent}%`,
                    '--color': '#4CAF50'
                  }}
                  title={`Approved: ${approved} applications (${approvedPercent.toFixed(1)}%)`}
                >
                  <div className="segment-label">Approved</div>
                  <div className="segment-count">{approved}</div>
                </div>
              )}
              
              {attended > 0 && (
                <div 
                  className="status-segment attended" 
                  style={{ 
                    '--percentage': `${attendedPercent}%`,
                    '--color': '#2196F3'
                  }}
                  title={`Attended: ${attended} applications (${attendedPercent.toFixed(1)}%)`}
                >
                  <div className="segment-label">Attended</div>
                  <div className="segment-count">{attended}</div>
                </div>
              )}
              
              {absent > 0 && (
                <div 
                  className="status-segment absent" 
                  style={{ 
                    '--percentage': `${absentPercent}%`,
                    '--color': '#9E9E9E'
                  }}
                  title={`Absent: ${absent} applications (${absentPercent.toFixed(1)}%)`}
                >
                  <div className="segment-label">Absent</div>
                  <div className="segment-count">{absent}</div>
                </div>
              )}
              
              {rejected > 0 && (
                <div 
                  className="status-segment rejected" 
                  style={{ 
                    '--percentage': `${rejectedPercent}%`,
                    '--color': '#F44336'
                  }}
                  title={`Rejected: ${rejected} applications (${rejectedPercent.toFixed(1)}%)`}
                >
                  <div className="segment-label">Rejected</div>
                  <div className="segment-count">{rejected}</div>
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
