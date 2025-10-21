// AdminRegistrations.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
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
          
          const registrationsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            collection: collectionName,
            ...doc.data()
          }));
          
          console.log(`✅ Found ${registrationsList.length} registrations in ${collectionName}`);
          allRegistrations = [...allRegistrations, ...registrationsList];
        } catch (collectionError) {
          console.log(`⚠️ Error fetching from ${collectionName}:`, collectionError);
        }
      }
      
      console.log(`📊 Total registrations found: ${allRegistrations.length}`);
      console.log('📋 Registration data:', allRegistrations);
      
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

      {/* Registrations List */}
      <div className="registrations-list">
        {filteredRegistrations.length === 0 ? (
          <div className="no-registrations">
            <p>No registrations found matching your criteria.</p>
          </div>
        ) : (
          filteredRegistrations.map(registration => (
            <div key={registration.id} className="registration-card">
              <div className="registration-header">
                <div className="participant-info">
                  <h3>
                    {registration.firstName || registration.first_name || 'Unknown'} {' '}
                    {registration.lastName || registration.last_name || 'User'}
                  </h3>
                  <p className="email">{registration.email || 'No email'}</p>
                  <p className="event-title">Event: {registration.eventTitle || registration.event_title || 'Unknown Event'}</p>
                  {/* Debug info - remove this later */}
                  <div style={{fontSize: '10px', color: '#666', marginTop: '5px'}}>
                    Debug: firstName="{registration.firstName}", lastName="{registration.lastName}", 
                    first_name="{registration.first_name}", last_name="{registration.last_name}"
                  </div>
                </div>
                <div className="registration-status">
                  {getStatusBadge(registration.status)}
                  <p className="registration-date">
                    Registered: {formatDate(registration.registrationDate)}
                  </p>
                </div>
              </div>

              <div className="registration-details">
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{registration.phone || 'Not provided'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Age:</span>
                  <span className="value">{registration.age || 'Not provided'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Experience:</span>
                  <span className="value">{registration.experience || 'Not specified'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Emergency Contact:</span>
                  <span className="value">
                    {registration.emergencyContact || 'Not provided'} 
                    {registration.emergencyPhone && ` (${registration.emergencyPhone})`}
                  </span>
                </div>
                {registration.dietaryRestrictions && (
                  <div className="detail-row">
                    <span className="label">Dietary Restrictions:</span>
                    <span className="value">{registration.dietaryRestrictions}</span>
                  </div>
                )}
                {registration.motivation && (
                  <div className="detail-row">
                    <span className="label">Motivation:</span>
                    <span className="value">{registration.motivation}</span>
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

              <div className="registration-actions">
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
                  
                  console.log('Available actions for status', registration.status, ':', availableActions);
                  
                  return availableActions.map((action, index) => (
                    <button
                      key={index}
                      className={`action-btn ${action.class}`}
                      onClick={() => updateRegistrationStatus(registration.id, action.action)}
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