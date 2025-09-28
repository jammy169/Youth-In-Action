// src/admin/AdminEditEvent.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './AdminEditEvent.css'; // <-- Link to the new CSS file

const AdminEditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        startDateTime: '',
        endDateTime: '',
        location: '',
        description: '',
        image: '',
        organizer: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;

            const docRef = doc(db, "events", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const eventData = docSnap.data();
                // Convert date to datetime-local format if needed
                if (eventData.date && !eventData.startDateTime) {
                    eventData.startDateTime = eventData.date + 'T09:00';
                    eventData.endDateTime = eventData.date + 'T17:00';
                }
                setForm(eventData);
            } else {
                console.log("No such document!");
                alert("Event not found.");
                navigate('/admin');
            }
            setLoading(false);
        };
        fetchEvent();
    }, [id, navigate]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const eventDocRef = doc(db, 'events', id);
            await updateDoc(eventDocRef, form);
            
            alert("Event updated successfully!");
            navigate('/admin');
        } catch (error) {
            console.error("Error updating document: ", error);
            alert("Failed to update event.");
        }
    };

    if (loading) {
        return <div>Loading event data...</div>;
    }

    return (
        <div className="admin-form-container">
            <form onSubmit={handleSubmit}>
                <h2>Edit Event</h2>
                <input className="admin-form-input" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                <div className="datetime-inputs">
                    <label className="datetime-label">Start Date & Time</label>
                    <input className="admin-form-input" name="startDateTime" type="datetime-local" value={form.startDateTime} onChange={handleChange} required />
                </div>
                <div className="datetime-inputs">
                    <label className="datetime-label">End Date & Time</label>
                    <input className="admin-form-input" name="endDateTime" type="datetime-local" value={form.endDateTime} onChange={handleChange} required />
                </div>
                <input className="admin-form-input" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
                <input className="admin-form-input" name="organizer" placeholder="Organizer" value={form.organizer} onChange={handleChange} required />
                <input className="admin-form-input" name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
                <textarea className="admin-form-input" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
                <button type="submit">Update Event</button>
            </form>
        </div>
    );
};

export default AdminEditEvent;