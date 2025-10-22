// ImpactCharts.jsx
import React from 'react';
import './ImpactCharts.css';

const ImpactCharts = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="impact-charts">
        <div className="impact-charts-header">
          <h2>📊 Our Impact Analytics</h2>
          <p>Loading impact statistics...</p>
        </div>
        <div className="loading-spinner">🔄</div>
      </div>
    );
  }

  const { activeVolunteers, eventsHosted, communitiesServed } = stats;

  return (
    <div className="impact-charts">
      <div className="impact-charts-header">
        <h2>📊 Our Impact Analytics</h2>
        <p>Visual representation of our community impact</p>
      </div>

      <div className="impact-charts-grid">
        {/* Active Volunteers Chart */}
        <div className="impact-chart-card">
          <div className="chart-header">
            <h3>👥 Active Volunteers</h3>
            <div className="chart-number">{activeVolunteers}</div>
          </div>
          <div className="chart-visual">
            <div className="circular-progress">
              <div className="progress-ring">
                <svg className="progress-ring-svg" width="120" height="120">
                  <circle
                    className="progress-ring-circle-bg"
                    stroke="#e9ecef"
                    strokeWidth="8"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                  />
                  <circle
                    className="progress-ring-circle"
                    stroke="#28a745"
                    strokeWidth="8"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 52}`,
                      strokeDashoffset: `${2 * Math.PI * 52 * (1 - Math.min(parseInt(activeVolunteers) / 100, 1))}`
                    }}
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-number">{activeVolunteers}</span>
                  <span className="progress-label">Volunteers</span>
                </div>
              </div>
            </div>
          </div>
          <div className="chart-description">
            <p>Dedicated volunteers making a difference</p>
          </div>
        </div>

        {/* Events Hosted Chart */}
        <div className="impact-chart-card">
          <div className="chart-header">
            <h3>🎉 Events Hosted</h3>
            <div className="chart-number">{eventsHosted}</div>
          </div>
          <div className="chart-visual">
            <div className="bar-chart-container">
              <div className="bar-chart">
                <div className="bar-item">
                  <div className="bar-label">Events</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill events-bar" 
                      style={{ width: `${Math.min(parseInt(eventsHosted) * 10, 100)}%` }}
                    ></div>
                    <span className="bar-value">{eventsHosted}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="chart-description">
            <p>Successful community events organized</p>
          </div>
        </div>

        {/* Communities Served Chart */}
        <div className="impact-chart-card">
          <div className="chart-header">
            <h3>🏘️ Communities Served</h3>
            <div className="chart-number">{communitiesServed}</div>
          </div>
          <div className="chart-visual">
            <div className="pie-chart-container">
              <div className="pie-chart">
                <div className="pie-slice communities-slice"></div>
                <div className="pie-center">
                  <span className="pie-number">{communitiesServed}</span>
                  <span className="pie-label">Communities</span>
                </div>
              </div>
            </div>
          </div>
          <div className="chart-description">
            <p>Communities positively impacted</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="impact-summary">
        <div className="summary-item">
          <div className="summary-icon">👥</div>
          <div className="summary-content">
            <div className="summary-label">Total Volunteers</div>
            <div className="summary-value">{activeVolunteers}</div>
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-icon">🎉</div>
          <div className="summary-content">
            <div className="summary-label">Events Organized</div>
            <div className="summary-value">{eventsHosted}</div>
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-icon">🏘️</div>
          <div className="summary-content">
            <div className="summary-label">Communities Reached</div>
            <div className="summary-value">{communitiesServed}</div>
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <div className="summary-label">Impact Score</div>
            <div className="summary-value">
              {parseInt(activeVolunteers) + parseInt(eventsHosted) + parseInt(communitiesServed)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactCharts;

