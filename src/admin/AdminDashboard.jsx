import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaPlusSquare, FaUsers, FaClipboardList, FaComments, FaCalendarAlt, FaUserCheck, FaClock, FaCheckCircle, FaEnvelope } from 'react-icons/fa';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { getContactMessages } from '../supabaseClient';
import { getAuth, deleteUser } from 'firebase/auth'; // <-- NEW: Import getAuth and deleteUser
import EventStatusOverride from '../components/EventStatusOverride';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [users, setUsers] = useState([]);
    const [feedbackCount, setFeedbackCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showUserManagement, setShowUserManagement] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const auth = getAuth(); // <-- NEW: Get the auth service

    // Check for success message from navigation state
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the state so message doesn't persist on refresh
            window.history.replaceState({}, document.title);
            // Auto-hide message after 8 seconds
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [location]);

    // Fetch users from Firestore
    const fetchUsers = async () => {
        try {
            const usersCollectionRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollectionRef);
            const usersData = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
            console.log('Users fetched:', usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Delete user account completely
    const deleteUserAccount = async (userId, userEmail) => {
        try {
            // Validate parameters
            if (!userId || !userEmail) {
                alert('❌ Error: Missing user information. Cannot delete user.');
                console.error('❌ Missing parameters:', { userId, userEmail });
                return;
            }

            // Confirm deletion
            const confirmText = 'DELETE';
            const userInput = prompt(`⚠️ WARNING: This will permanently delete the user account and all data!\n\nUser: ${userEmail}\n\nType "${confirmText}" to confirm:`);
            
            if (userInput !== confirmText) {
                alert('User deletion cancelled');
                return;
            }

            console.log('🗑️ Starting user deletion process for:', userEmail);

            let deletedCount = 0;
            let errorCount = 0;
            const errors = [];

            // 1. Delete from users collection (check if exists first)
            try {
                const userDocRef = doc(db, 'users', userId);
                const userDocSnap = await getDoc(userDocRef);
                
                if (userDocSnap.exists()) {
                    await deleteDoc(userDocRef);
                    console.log('✅ Deleted user data from users collection');
                    deletedCount++;
                } else {
                    console.log('ℹ️ User document does not exist in users collection (may have been deleted already)');
                }
            } catch (userError) {
                console.error('❌ Error deleting from users collection:', userError);
                errors.push(`Users collection: ${userError.message}`);
                errorCount++;
            }

            // 2. Delete from userProfiles collection (if exists)
            try {
                const userProfileRef = doc(db, 'userProfiles', userId);
                const userProfileSnap = await getDoc(userProfileRef);
                
                if (userProfileSnap.exists()) {
                    await deleteDoc(userProfileRef);
                    console.log('✅ Deleted user profile from userProfiles collection');
                    deletedCount++;
                } else {
                    console.log('ℹ️ User profile does not exist in userProfiles collection');
                }
            } catch (profileError) {
                console.error('❌ Error deleting from userProfiles collection:', profileError);
                errors.push(`UserProfiles collection: ${profileError.message}`);
                errorCount++;
            }

            // 3. Delete from registrations collection (by email match)
            try {
                const registrationsRef = collection(db, 'registrations');
                const registrationsSnapshot = await getDocs(registrationsRef);
                
                const deletePromises = [];
                registrationsSnapshot.forEach((docSnapshot) => {
                    const data = docSnapshot.data();
                    if (data.email === userEmail || data.userId === userId) {
                        deletePromises.push(deleteDoc(docSnapshot.ref).catch(err => {
                            console.error(`❌ Error deleting registration ${docSnapshot.id}:`, err);
                            errors.push(`Registration ${docSnapshot.id}: ${err.message}`);
                            return null; // Return null so Promise.all doesn't fail completely
                        }));
                    }
                });
                
                const results = await Promise.all(deletePromises);
                const successfulDeletes = results.filter(r => r !== null).length;
                
                if (successfulDeletes > 0) {
                    console.log(`✅ Deleted ${successfulDeletes} user registrations`);
                    deletedCount += successfulDeletes;
                } else {
                    console.log('ℹ️ No registrations found for this user');
                }
            } catch (regError) {
                console.error('❌ Error deleting registrations:', regError);
                errors.push(`Registrations: ${regError.message}`);
                errorCount++;
            }

            // 4. Summary
            if (errorCount > 0) {
                const errorMessage = errors.join('\n');
                alert(`⚠️ Partial deletion completed:\n\n✅ Successfully deleted: ${deletedCount} items\n❌ Errors: ${errorCount}\n\nError details:\n${errorMessage}\n\nNote: Some data may still exist. Firebase Auth user needs to be deleted manually from Firebase Console.`);
            } else if (deletedCount > 0) {
                alert(`✅ User data deleted successfully!\n\nDeleted ${deletedCount} items from Firestore.\n\nNote: Firebase Auth user still exists and needs to be deleted from Firebase Console if not already deleted.`);
            } else {
                alert('ℹ️ No user data found to delete. User may have already been deleted.\n\nNote: Check Firebase Console to verify if Firebase Auth user exists.');
            }

            // Refresh users list
            await fetchUsers();
            
        } catch (error) {
            console.error('❌ Error deleting user account:', error);
            alert('❌ Failed to delete user account: ' + error.message);
        }
    };

    // Use useEffect to fetch data when the component mounts
    useEffect(() => {
        // This diagnostic line will show if you are logged in
        console.log("Current user:", auth.currentUser); // <-- NEW: Log the current user

        const fetchData = async () => {
            try {
                // Fetch events
                const eventsCollectionRef = collection(db, 'events');
                const eventsSnapshot = await getDocs(eventsCollectionRef);
                const eventsList = eventsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setEvents(eventsList);

                // Fetch registrations
                const registrationsCollectionRef = collection(db, 'registrations');
                const registrationsSnapshot = await getDocs(registrationsCollectionRef);
                const registrationsList = registrationsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRegistrations(registrationsList);

                // Fetch feedback count
                try {
                    const feedbackResult = await getContactMessages();
                    if (feedbackResult.success) {
                        setFeedbackCount(feedbackResult.data.length);
                    }
                } catch (error) {
                    console.log('Could not fetch feedback count:', error);
                }

                // Fetch users
                await fetchUsers();
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [auth]); // The effect now depends on the auth service

    // Function to handle event deletion
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                const eventDocRef = doc(db, 'events', id);
                await deleteDoc(eventDocRef);
                
                // Update the state to remove the event from the UI
                setEvents(events.filter(event => event.id !== id));
                alert("Event deleted successfully!");
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert("Failed to delete event.");
            }
        }
    };
    
    // Function to handle event editing
    const handleEdit = (id) => {
        // This will navigate to a new page with the event ID in the URL
        // You will need to create a new component to handle the edit form
        navigate(`/admin/edit-event/${id}`);
    };

    // Function to handle event status updates
    const handleStatusUpdate = async (eventId, newStatus) => {
        try {
            const eventDocRef = doc(db, 'events', eventId);
            await updateDoc(eventDocRef, { status: newStatus });
            
            // Update the state to reflect the change
            setEvents(events.map(event => 
                event.id === eventId 
                    ? { ...event, status: newStatus }
                    : event
            ));
            
            console.log(`Event ${eventId} status updated to: ${newStatus}`);
        } catch (error) {
            console.error("Error updating event status:", error);
            throw error; // Re-throw to let the component handle the error
        }
    };

    const stats = {
        totalEvents: events.length,
        totalRegistrations: registrations.length,
        pendingRegistrations: registrations.filter(r => r.status === 'pending').length,
        approvedRegistrations: registrations.filter(r => r.status === 'approved').length
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="admin-dashboard-root"><p>Loading events...</p></div>;
    }

    return (
        <div className="admin-dashboard-root">
            {/* Success Message Banner */}
            {successMessage && (
                <div className="admin-success-message" style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#27ae60',
                    color: 'white',
                    padding: '20px 30px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    maxWidth: '600px',
                    whiteSpace: 'pre-line',
                    textAlign: 'center',
                    fontSize: '14px',
                    lineHeight: '1.6'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
                        <span style={{ flex: 1 }}>{successMessage}</span>
                        <button 
                            onClick={() => setSuccessMessage(null)}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                fontSize: '18px',
                                lineHeight: 1
                            }}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
            
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1>Admin Dashboard</h1>
                    <div className="admin-profile">
                        <FaUserCircle className="profile-icon" />
                        <span>Welcome, Admin</span>
                    </div>
                </div>
            </header>
            <main className="admin-main">
                <section className="admin-stats">
                    <div className="stat-card">
                        <FaCalendarAlt className="stat-icon" />
                        <h3>Total Events</h3>
                        <p>{stats.totalEvents}</p>
                    </div>
                    <div className="stat-card">
                        <FaUsers className="stat-icon" />
                        <h3>Total Registrations</h3>
                        <p>{stats.totalRegistrations}</p>
                    </div>
                    <div className="stat-card">
                        <FaClock className="stat-icon" />
                        <h3>Pending Reviews</h3>
                        <p>{stats.pendingRegistrations}</p>
                    </div>
                    <div className="stat-card">
                        <FaCheckCircle className="stat-icon" />
                        <h3>Approved</h3>
                        <p>{stats.approvedRegistrations}</p>
                    </div>
                    <div className="stat-card">
                        <FaEnvelope className="stat-icon" />
                        <h3>Feedback Messages</h3>
                        <p>{feedbackCount}</p>
                    </div>
                </section>
                <section className="admin-actions">
                    <button className="add-event-btn" onClick={() => navigate('/admin/add-event')}>
                        <FaPlusSquare />
                        Add New Event
                    </button>
                    <button className="manage-registrations-btn" onClick={() => navigate('/admin/registrations')}>
                        <FaClipboardList />
                        Manage Registrations
                    </button>
                    <button className="feedback-btn" onClick={() => navigate('/admin/feedback')}>
                        <FaComments />
                        View Feedback
                    </button>
                    <button className="manage-users-btn" onClick={() => setShowUserManagement(!showUserManagement)}>
                        <FaUsers />
                        Manage Users
                    </button>
                </section>
                <section className="admin-manage-events">
                    <h2>Manage Events</h2>
                    <div className="manage-header">
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="event-search-bar"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="event-table-container">
                        <table className="event-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEvents.length === 0 ? (
                                    <tr>
                                        <td colSpan="4">No events found.</td>
                                    </tr>
                                ) : (
                                    filteredEvents.map(event => (
                                        <tr key={event.id}>
                                            <td>{event.title}</td>
                                            <td>{event.date}</td>
                                            <td>
                                                <EventStatusOverride 
                                                    event={event}
                                                    onStatusChange={handleStatusUpdate}
                                                />
                                            </td>
                                            <td>
                                                <button className="action-btn edit" onClick={() => handleEdit(event.id)}>Edit</button>
                                                <button className="action-btn delete" onClick={() => handleDelete(event.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* User Management Section */}
                {showUserManagement && (
                    <section className="admin-manage-users">
                        <h2>Manage Users</h2>
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Age</th>
                                        <th>Phone</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.displayName || 'N/A'}</td>
                                            <td>{user.email}</td>
                                            <td>{user.age || 'N/A'}</td>
                                            <td>{user.phone || 'N/A'}</td>
                                            <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                                            <td>
                                                <button 
                                                    className="delete-user-btn"
                                                    onClick={() => deleteUserAccount(user.id, user.email)}
                                                    title="Delete User Account"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;