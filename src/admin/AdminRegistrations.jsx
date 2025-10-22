// AdminRegistrations.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { 
  VOLUNTEER_STATUS, 
  STATUS_CONFIG, 
  getAvailableActions, 
  isValidTransition,
  getStatusBadgeProps,
  getRegistrationStats,
  shouldAwardHours
} from '../utils/volunteerStatusUtils';
import { updateServiceHours } from '../utils/userDataUtils';
import { validateVolunteerStatusChange, getSafeDefaultHours, createAuditLog } from '../utils/volunteerValidationUtils';
import RegistrationCharts from '../components/RegistrationCharts';
import './AdminRegistrations.css';

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, attended, absent, rejected
  const [searchTerm, setSearchTerm] = useState('');
  const [editingServiceHours, setEditingServiceHours] = useState({});
  const [serviceHoursInputs, setServiceHoursInputs] = useState({});

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      console.log('🔄 Fetching registrations from database...');
      
      // Try both collections to find registrations
      const collections = ['registrations', 'eventRegistrations'];
      let allRegistrations = [];
      
      for (const collectionName of collections) {
        try {
          console.log(`📋 Checking collection: ${collectionName}`);
          const registrationsRef = collection(db, collectionName);
          const q = query(registrationsRef, orderBy('registrationDate', 'desc'));
          const querySnapshot = await getDocs(q);
          
          const registrationsList = querySnapshot.docs.map(doc => {
            const data = doc.data();
            console.log(`📄 Document ${doc.id} from ${collectionName}:`, data);
            return {
              id: doc.id,
              collection: collectionName,
              ...data
            };
          });
          
          console.log(`✅ Found ${registrationsList.length} registrations in ${collectionName}`);
          console.log(`📋 Sample registration from ${collectionName}:`, registrationsList[0]);
          allRegistrations = [...allRegistrations, ...registrationsList];
        } catch (collectionError) {
          console.log(`⚠️ Error fetching from ${collectionName}:`, collectionError);
          // Try without orderBy if it fails
          try {
            console.log(`🔄 Retrying ${collectionName} without orderBy...`);
            const registrationsRef = collection(db, collectionName);
            const querySnapshot = await getDocs(registrationsRef);
            
            const registrationsList = querySnapshot.docs.map(doc => {
              const data = doc.data();
              console.log(`📄 Document ${doc.id} from ${collectionName} (no orderBy):`, data);
              return {
                id: doc.id,
                collection: collectionName,
                ...data
              };
            });
            
            console.log(`✅ Found ${registrationsList.length} registrations in ${collectionName} (no orderBy)`);
            allRegistrations = [...allRegistrations, ...registrationsList];
          } catch (retryError) {
            console.error(`❌ Failed to fetch from ${collectionName} even without orderBy:`, retryError);
          }
        }
      }
      
      console.log(`📊 Total registrations found: ${allRegistrations.length}`);
      
      setRegistrations(allRegistrations);
    } catch (error) {
      console.error("❌ Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRegistrationStatus = async (registrationId, newStatus) => {
    try {
      // Find the current registration to validate transition
      const currentRegistration = registrations.find(reg => reg.id === registrationId);
      if (!currentRegistration) {
        alert("Registration not found");
        return;
      }

      // Comprehensive validation of status change
      const validation = validateVolunteerStatusChange(currentRegistration.status, newStatus, 0);
      console.log('Validation result:', validation);
      
      if (!validation.isValid) {
        console.error('Validation failed:', validation.errors);
        alert(`❌ ${validation.errors.join('\n')}`);
        return;
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        console.warn('Validation warnings:', validation.warnings);
      }

      const registrationRef = doc(db, 'registrations', registrationId);
      const updateData = {
        status: newStatus,
        statusUpdatedAt: new Date().toISOString()
      };

      // CRITICAL: Only award hours if status is 'attended' - NEVER on approval
      // This ensures hours are only given for actual attendance, not just approval
      const defaultHours = getSafeDefaultHours(newStatus);
      if (newStatus === VOLUNTEER_STATUS.ATTENDED && !currentRegistration.serviceHours) {
        // Set default service hours (can be edited later)
        updateData.serviceHours = defaultHours;
        updateData.serviceHoursUpdatedAt = new Date().toISOString();
        console.log('✅ Awarding hours for ATTENDANCE (not approval):', defaultHours, 'hours');
      } else if (newStatus === VOLUNTEER_STATUS.APPROVED) {
        // Explicitly ensure no hours are awarded on approval
        console.log('✅ APPROVAL: No hours awarded - volunteer must attend first');
        updateData.serviceHours = 0; // Explicitly set to 0 for approval
      } else {
        // Ensure no hours for any other status
        updateData.serviceHours = 0;
      }

      await updateDoc(registrationRef, updateData);

      // Send notification to user about status change
      try {
        const { sendStatusChangeNotification } = await import('../utils/registrationNotificationService');
        await sendStatusChangeNotification(currentRegistration, newStatus);
        console.log('✅ Notification sent to user about status change');
      } catch (notificationError) {
        console.error('❌ Failed to send notification:', notificationError);
        // Continue even if notification fails
      }

      // Create audit log for status change
      if (currentRegistration.userId) {
        const auditLog = createAuditLog(
          currentRegistration.userId,
          currentRegistration.status,
          newStatus,
          updateData.serviceHours || 0
        );
        console.log('Audit log:', auditLog);
      }

      // Update local state
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { 
                ...reg, 
                status: newStatus, 
                statusUpdatedAt: new Date().toISOString(),
                ...(newStatus === VOLUNTEER_STATUS.ATTENDED && !reg.serviceHours && { 
                  serviceHours: 4,
                  serviceHoursUpdatedAt: new Date().toISOString()
                })
              }
            : reg
        )
      );

      const statusText = STATUS_CONFIG[newStatus]?.text || newStatus;
      alert(`Registration ${statusText} successfully!`);
    } catch (error) {
      console.error("Error updating registration:", error);
      alert("Failed to update registration status");
    }
  };

  const updateServiceHours = async (registrationId, newHours) => {
    try {
      // Find the current registration to check status
      const currentRegistration = registrations.find(reg => reg.id === registrationId);
      if (!currentRegistration) {
        alert("Registration not found");
        return;
      }

      // Only allow editing service hours for attended registrations
      if (currentRegistration.status !== VOLUNTEER_STATUS.ATTENDED) {
        alert("Service hours can only be edited for attended registrations");
        return;
      }

      const registrationRef = doc(db, 'registrations', registrationId);
      await updateDoc(registrationRef, {
        serviceHours: parseFloat(newHours) || 0,
        serviceHoursUpdatedAt: new Date().toISOString()
      });

      // Update local state
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, serviceHours: parseFloat(newHours) || 0, serviceHoursUpdatedAt: new Date().toISOString() }
            : reg
        )
      );

      // Clear editing state
      setEditingServiceHours(prev => ({ ...prev, [registrationId]: false }));
      setServiceHoursInputs(prev => ({ ...prev, [registrationId]: '' }));

      alert(`Service hours updated to ${newHours} hours successfully!`);
    } catch (error) {
      console.error("Error updating service hours:", error);
      alert("Failed to update service hours");
    }
  };

  const handleServiceHoursEdit = (registrationId, currentHours) => {
    setEditingServiceHours(prev => ({ ...prev, [registrationId]: true }));
    setServiceHoursInputs(prev => ({ ...prev, [registrationId]: currentHours.toString() }));
  };

  const handleServiceHoursCancel = (registrationId) => {
    setEditingServiceHours(prev => ({ ...prev, [registrationId]: false }));
    setServiceHoursInputs(prev => ({ ...prev, [registrationId]: '' }));
  };

  const handleServiceHoursInputChange = (registrationId, value) => {
    setServiceHoursInputs(prev => ({ ...prev, [registrationId]: value }));
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesFilter = filter === 'all' || registration.status === filter;
    
    // Handle different field name variations
    const firstName = registration.firstName || registration.first_name || '';
    const lastName = registration.lastName || registration.last_name || '';
    const email = registration.email || '';
    const eventTitle = registration.eventTitle || registration.event_title || '';
    
    const matchesSearch = 
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eventTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });


  const getStatusBadge = (status) => {
    const props = getStatusBadgeProps(status);
    return <span className={props.className} title={props.title}>{props.children}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateStats = () => {
    return getRegistrationStats(registrations);
  };

  // Data validation function
  const validateRegistrationData = (registration) => {
    const issues = [];
    if (!registration.id) issues.push('Missing ID');
    if (!registration.status) issues.push('Missing status');
    if (!registration.firstName && !registration.first_name) issues.push('Missing first name');
    if (!registration.lastName && !registration.last_name) issues.push('Missing last name');
    if (!registration.email) issues.push('Missing email');
    return issues;
  };

  if (loading) return <div className="loading">Loading registrations...</div>;

  const stats = calculateStats();

  return (
    <div className="admin-registrations">
      <div className="registrations-header">
        <h1>Event Registrations</h1>
        <p>Manage and review volunteer registrations</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Registrations</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card approved">
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card attended">
          <div className="stat-number">{stats.attended}</div>
          <div className="stat-label">Attended</div>
        </div>
        <div className="stat-card absent">
          <div className="stat-number">{stats.absent}</div>
          <div className="stat-label">Absent</div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-number">{stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
        <div className="stat-card service-hours">
          <div className="stat-number">{stats.totalServiceHours.toFixed(1)}</div>
          <div className="stat-label">Total Service Hours</div>
        </div>
      </div>

      {/* Charts Section */}
      <RegistrationCharts stats={stats} />

      {/* Filters and Search */}
      <div className="controls-section">
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </button>
          <button 
            className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending})
          </button>
          <button 
            className={filter === 'approved' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('approved')}
          >
            Approved ({stats.approved})
          </button>
          <button 
            className={filter === 'attended' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('attended')}
          >
            Attended ({stats.attended})
          </button>
          <button 
            className={filter === 'absent' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('absent')}
          >
            Absent ({stats.absent})
          </button>
          <button 
            className={filter === 'rejected' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name, email, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>





          {/* Quick Data Check */}
          <div style={{background: '#e3f2fd', padding: '15px', margin: '20px 0', borderRadius: '8px', border: '1px solid #2196f3'}}>
            <h4 style={{color: '#1976d2', margin: '0 0 10px 0'}}>🔍 Data Check</h4>
            <p style={{margin: '0', color: '#1976d2'}}>
              <strong>Total Registrations:</strong> {registrations.length} | 
              <strong> Filtered:</strong> {filteredRegistrations.length} | 
              <strong> Filter:</strong> {filter} | 
              <strong> Search:</strong> "{searchTerm}"
            </p>
          </div>

          {/* Registrations List */}
          <div className="registrations-list" style={{overflow: 'visible', minHeight: 'auto'}}>
            {filteredRegistrations.length === 0 ? (
              <div className="no-registrations" style={{textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '8px', border: '2px dashed #dee2e6'}}>
                <h3 style={{color: '#6c757d', margin: '0 0 15px 0'}}>No registrations found</h3>
                <p style={{color: '#6c757d', margin: '0'}}>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              filteredRegistrations.map(registration => (
            <div key={registration.id} className="registration-card" style={{background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', margin: '20px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minHeight: '400px', overflow: 'visible', position: 'relative'}}>
              
              <div className="registration-header" style={{padding: '20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div className="participant-info" style={{flex: '1'}}>
                  <h3 style={{color: '#333', fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', display: 'block'}}>
                    {registration.firstName || registration.first_name || 'Unknown'} {' '}
                    {registration.lastName || registration.last_name || 'User'}
                  </h3>
                  <p className="email" style={{color: '#666', fontSize: '1rem', margin: '0 0 0.5rem 0', display: 'block'}}>
                    {registration.email || 'No email provided'}
                  </p>
                  <p className="event-title" style={{color: '#27ae60', fontWeight: '600', margin: '0', display: 'block'}}>
                    Event: {registration.eventTitle || registration.event_title || 'Unknown Event'}
                  </p>
                </div>
                <div className="registration-status" style={{textAlign: 'right'}}>
                  {getStatusBadge(registration.status)}
                  <p className="registration-date" style={{margin: '10px 0 0 0', fontSize: '0.9rem', color: '#666'}}>
                    Registered: {formatDate(registration.registrationDate)}
                  </p>
                </div>
              </div>

              <div className="registration-details" style={{padding: '20px', borderBottom: '1px solid #f0f0f0', background: '#fafafa'}}>
                <div className="detail-row" style={{display: 'flex', marginBottom: '15px', alignItems: 'flex-start', padding: '10px', background: '#ffffff', borderRadius: '4px'}}>
                  <span className="label" style={{fontWeight: '600', color: '#333', minWidth: '150px', marginRight: '1rem', display: 'block'}}>Phone:</span>
                  <span className="value" style={{color: '#666', flex: '1', lineHeight: '1.5', display: 'block'}}>{registration.phone || 'Not provided'}</span>
                </div>
                <div className="detail-row" style={{display: 'flex', marginBottom: '15px', alignItems: 'flex-start', padding: '10px', background: '#ffffff', borderRadius: '4px'}}>
                  <span className="label" style={{fontWeight: '600', color: '#333', minWidth: '150px', marginRight: '1rem', display: 'block'}}>Age:</span>
                  <span className="value" style={{color: '#666', flex: '1', lineHeight: '1.5', display: 'block'}}>{registration.age || 'Not provided'}</span>
                </div>
                <div className="detail-row" style={{display: 'flex', marginBottom: '15px', alignItems: 'flex-start', padding: '10px', background: '#ffffff', borderRadius: '4px'}}>
                  <span className="label" style={{fontWeight: '600', color: '#333', minWidth: '150px', marginRight: '1rem', display: 'block'}}>Experience:</span>
                  <span className="value" style={{color: '#666', flex: '1', lineHeight: '1.5', display: 'block'}}>{registration.experience || 'Not specified'}</span>
                </div>
                <div className="detail-row" style={{display: 'flex', marginBottom: '15px', alignItems: 'flex-start', padding: '10px', background: '#ffffff', borderRadius: '4px'}}>
                  <span className="label" style={{fontWeight: '600', color: '#333', minWidth: '150px', marginRight: '1rem', display: 'block'}}>Emergency Contact:</span>
                  <span className="value" style={{color: '#666', flex: '1', lineHeight: '1.5', display: 'block'}}>
                    {registration.emergencyContact || 'Not provided'} 
                    {registration.emergencyPhone && ` (${registration.emergencyPhone})`}
                  </span>
                </div>
                {registration.dietaryRestrictions && (
                  <div className="detail-row" style={{display: 'flex', marginBottom: '15px', alignItems: 'flex-start', padding: '10px', background: '#ffffff', borderRadius: '4px'}}>
                    <span className="label" style={{fontWeight: '600', color: '#333', minWidth: '150px', marginRight: '1rem', display: 'block'}}>Dietary Restrictions:</span>
                    <span className="value" style={{color: '#666', flex: '1', lineHeight: '1.5', display: 'block'}}>{registration.dietaryRestrictions}</span>
                  </div>
                )}
                {registration.motivation && (
                  <div className="detail-row" style={{display: 'flex', marginBottom: '15px', alignItems: 'flex-start', padding: '10px', background: '#ffffff', borderRadius: '4px'}}>
                    <span className="label" style={{fontWeight: '600', color: '#333', minWidth: '150px', marginRight: '1rem', display: 'block'}}>Motivation:</span>
                    <span className="value" style={{color: '#666', flex: '1', lineHeight: '1.5', display: 'block'}}>{registration.motivation}</span>
                  </div>
                )}
                
                {/* Service Hours Section - Only for Attended registrations */}
                {registration.status === VOLUNTEER_STATUS.ATTENDED && (
                <div className="service-hours-section">
                  <div className="detail-row service-hours-row">
                    <span className="label">Service Hours:</span>
                    <div className="service-hours-controls">
                      {editingServiceHours[registration.id] ? (
                        <div className="service-hours-edit">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={serviceHoursInputs[registration.id] || ''}
                            onChange={(e) => handleServiceHoursInputChange(registration.id, e.target.value)}
                            className="service-hours-input"
                            placeholder="Enter hours"
                            autoFocus
                          />
                          <div className="service-hours-buttons">
                            <button
                              className="save-btn"
                              onClick={() => updateServiceHours(registration.id, serviceHoursInputs[registration.id])}
                            >
                              ✓ Save
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={() => handleServiceHoursCancel(registration.id)}
                            >
                              ✗ Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="service-hours-display">
                          <span className="service-hours-value">
                            {registration.serviceHours || 0} hours
                          </span>
                          <button
                            className="edit-service-hours-btn"
                            onClick={() => handleServiceHoursEdit(registration.id, registration.serviceHours || 0)}
                            title="Edit service hours"
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {registration.serviceHoursUpdatedAt && (
                    <div className="service-hours-updated">
                      Last updated: {formatDate(registration.serviceHoursUpdatedAt)}
                    </div>
                  )}
                </div>
                )}
              </div>

              <div className="registration-actions" style={{padding: '20px', background: '#f8f9fa', display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: '1px solid #e0e0e0'}}>
                {(() => {
                  // Get available actions based on current status and event
                  // For approved registrations, always show attendance options
                  // This allows admins to mark attendance regardless of event timing
                  let availableActions = [];
                  
                  if (registration.status === VOLUNTEER_STATUS.PENDING) {
                    availableActions = [
                      { action: VOLUNTEER_STATUS.APPROVED, label: '✓ Approve', class: 'approve-btn' },
                      { action: VOLUNTEER_STATUS.REJECTED, label: '✗ Reject', class: 'reject-btn' }
                    ];
                  } else if (registration.status === VOLUNTEER_STATUS.APPROVED) {
                    // For approved registrations, show attendance options
                    availableActions = [
                      { action: VOLUNTEER_STATUS.ATTENDED, label: '✓ Mark Attended (Award Hours)', class: 'attended-btn' },
                      { action: VOLUNTEER_STATUS.ABSENT, label: '✗ Mark Absent (No Hours)', class: 'absent-btn' },
                      { action: VOLUNTEER_STATUS.REJECTED, label: '✗ Reject', class: 'reject-btn' }
                    ];
                  } else if (registration.status === VOLUNTEER_STATUS.REJECTED) {
                    availableActions = [
                      { action: VOLUNTEER_STATUS.APPROVED, label: '✓ Approve', class: 'approve-btn' }
                    ];
                  }
                  
                  
                  return availableActions.map((action, index) => (
                        <button
                          key={index}
                          className={`action-btn ${action.class}`}
                          onClick={() => updateRegistrationStatus(registration.id, action.action)}
                          style={{
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: action.class === 'approve-btn' ? '#28a745' : 
                                          action.class === 'reject-btn' ? '#dc3545' : 
                                          action.class === 'attended-btn' ? '#17a2b8' : 
                                          action.class === 'absent-btn' ? '#6c757d' : '#007bff',
                            color: 'white',
                            minWidth: '120px',
                            justifyContent: 'center'
                          }}
                        >
                      {action.label}
                    </button>
                  ));
                })()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRegistrations;