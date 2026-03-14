
import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './AdminAddEvent.css';

const AdminAddEvent = () => {
  const [form, setForm] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    image: '',
    organizer: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (Object.values(form).some((value) => value === '')) {
        alert('Please fill out all fields.');
        return;
      }

      await addDoc(collection(db, 'events'), form);

      alert('Event added successfully!');

      setForm({
        title: '',
        date: '',
        location: '',
        description: '',
        image: '',
        organizer: ''
      });

      navigate('/admin');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert(`Failed to add event: ${error.message}`);
    }
  };

  return (
    <div className="admin-form-container">
      <form onSubmit={handleSubmit}>
        <h2>Add New Event</h2>
        <input
          className="admin-form-input"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          className="admin-form-input"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          className="admin-form-input"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <input
          className="admin-form-input"
          name="organizer"
          placeholder="Organizer"
          value={form.organizer}
          onChange={handleChange}
          required
        />
        <input
          className="admin-form-input"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          required
        />
        <textarea
          className="admin-form-input"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AdminAddEvent;
