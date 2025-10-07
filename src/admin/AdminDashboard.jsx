import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaPlusSquare, FaUsers, FaClipboardList, FaComments, FaCalendarAlt, FaUserCheck, FaClock, FaCheckCircle, FaEnvelope } from 'react-icons/fa';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { getContactMessages } from '../supabaseClient';
import { getAuth, deleteUser } from 'firebase/auth'; // <-- NEW: Import getAuth and deleteUser
import EventStatusOverride from '../components/EventStatusOverride';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [users, setUsers] = useState([]);
    const [feedbackCount, setFeedbackCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showUserManagement, setShowUserManagement] = useState(false);

    const auth = getAuth(); // <-- NEW: Get the auth service

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
            // Confirm deletion
            const confirmText = 'DELETE';
            const userInput = prompt(`⚠️ WARNING: This will permanently delete the user account and all data!\n\nUser: ${userEmail}\n\nType "${confirmText}" to confirm:`);
            
            if (userInput !== confirmText) {
                alert('User deletion cancelled');
                return;
            }

            console.log('🗑️ Starting user deletion process for:', userEmail);

            // 1. Delete user data from Firestore
            try {
                // Delete from users collection
                const userDocRef = doc(db, 'users', userId);
                await deleteDoc(userDocRef);
                console.log('✅ Deleted user data from users collection');

                // Delete from registrations collection
                const registrationsRef = collection(db, 'registrations');
                const registrationsSnapshot = await getDocs(registrationsRef);
                
                const deletePromises = [];
                registrationsSnapshot.forEach((docSnapshot) => {
                    const data = docSnapshot.data();
                    if (data.email === userEmail) {
                        deletePromises.push(deleteDoc(docSnapshot.ref));
                    }
                });
                
                await Promise.all(deletePromises);
                console.log('✅ Deleted user registrations');
            } catch (firestoreError) {
                console.warn('⚠️ Error deleting Firestore data:', firestoreError);
            }

            // 2. Note: We cannot delete Firebase Auth users from client-side
            // This would need to be done from Firebase Admin SDK on server-side
            console.log('⚠️ Note: Firebase Auth user deletion requires server-side implementation');
            console.log('✅ Firestore data deleted successfully');

            alert('✅ User data deleted successfully!\n\nNote: Firebase Auth user still exists and needs to be deleted from Firebase Console or Admin SDK.');

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