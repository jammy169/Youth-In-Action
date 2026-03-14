import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaPlusSquare } from 'react-icons/fa';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // <-- NEW: Import getAuth
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const auth = getAuth(); // <-- NEW: Get the auth service

    // Use useEffect to fetch data when the component mounts
    useEffect(() => {
        // This diagnostic line will show if you are logged in
        console.log("Current user:", auth.currentUser); // <-- NEW: Log the current user

        const fetchEvents = async () => {
            try {
                const eventsCollectionRef = collection(db, 'events');
                const querySnapshot = await getDocs(eventsCollectionRef);
                const eventsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setEvents(eventsList);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
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

    const stats = {
        totalEvents: events.length,
        activeMembers: 75
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
                        <h3>Active Members</h3>
                        <p>{stats.activeMembers}</p>
                    </div>
                    <button className="add-event-btn" onClick={() => navigate('/admin/add-event')}>
                        <FaPlusSquare />
                        Add New Event
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
                                                <span className={`status-badge active`}>Active</span>
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