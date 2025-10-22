// ImpactStatsDemo.jsx
// Demo component to show how the new dynamic impact statistics work
import React, { useState, useEffect } from 'react';
import { calculateImpactStats, formatStatsForDisplay, getDetailedStats } from '../utils/impactStats';

const ImpactStatsDemo = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Loading impact statistics for demo...');
        const rawStats = await calculateImpactStats();
        const formattedStats = formatStatsForDisplay(rawStats);
        const detailedStats = getDetailedStats(rawStats);
        
        setStats({ formatted: formattedStats, detailed: detailedStats });
        console.log('✅ Demo statistics loaded:', { formatted: formattedStats, detailed: detailedStats });
      } catch (err) {
        console.error('❌ Error loading demo statistics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div className="loading-spinner"></div>
        <p>Loading impact statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
        <h3>Error loading statistics</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', margin: '20px 0' }}>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>📊 Dynamic Impact Statistics Demo</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ECDC4' }}>
            {stats.formatted.activeVolunteers}
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Active Volunteers</div>
        </div>
        
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ECDC4' }}>
            {stats.formatted.eventsHosted}
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Events Hosted</div>
        </div>
        
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ECDC4' }}>
            {stats.formatted.communitiesServed}
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Communities Served</div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ color: '#333', marginBottom: '10px' }}>📈 Additional Statistics</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', fontSize: '0.9rem' }}>
          <div><strong>Total Service Hours:</strong> {stats.detailed.totalServiceHours}</div>
          <div><strong>Pending Registrations:</strong> {stats.detailed.pendingRegistrations}</div>
          <div><strong>Approved Registrations:</strong> {stats.detailed.approvedRegistrations}</div>
          <div><strong>Attended Events:</strong> {stats.detailed.attendedEvents}</div>
          <div><strong>Attendance Rate:</strong> {stats.detailed.attendanceRate}%</div>
          <div><strong>Avg Service Hours:</strong> {stats.detailed.averageServiceHours}</div>
        </div>
      </div>
    </div>
  );
};

export default ImpactStatsDemo;


