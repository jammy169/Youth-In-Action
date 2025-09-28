import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaPlusSquare, FaUsers, FaClipboardList, FaComments } from 'react-icons/fa';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getContactMessages } from '../supabaseClient';
import { getAuth } from 'firebase/auth'; // <-- NEW: Import getAuth
import EventStatusOverride from '../components/EventStatusOverride';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [feedbackCount, setFeedbackCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const auth = getAuth(); // <-- NEW: Get the auth service

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
                        <h3>Total Events</h3>
                        <p>{stats.totalEvents}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Registrations</h3>
                        <p>{stats.totalRegistrations}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Pending Reviews</h3>
                        <p>{stats.pendingRegistrations}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Approved</h3>
                        <p>{stats.approvedRegistrations}</p>
                    </div>
                    <div className="stat-card">
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
            </main>
        </div>
    );
};

export default AdminDashboard;