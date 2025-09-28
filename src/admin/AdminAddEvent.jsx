
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadEventImage } from '../utils/supabaseUpload';
import { addEvent, EVENT_CATEGORIES } from '../utils/eventsService';
import { requireAdminAuth, getCurrentUser } from '../utils/adminAuth';
import { addEventWithAdminPrivileges } from '../utils/firebaseAdmin';
import './AdminAddEvent.css';

const AdminAddEvent = () => {
  const [form, setForm] = useState({
    title: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    description: '',
    image: '',
    organizer: '',
    category: 'COMMUNITY CLEANUPS'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  // Check admin authentication - DISABLED FOR DEVELOPMENT
  useEffect(() => {
    console.log('Admin authentication bypassed for development');
    // const checkAuth = () => {
    //   const user = getCurrentUser();
    //   const isAdmin = requireAdminAuth();
      
    //   if (!isAdmin) {
    //     console.log('Not authenticated as admin, redirecting to admin sign-in');
    //     navigate('/admin-signin');
    //     return;
    //   }
      
    //   console.log('Admin authenticated:', user?.email);
    // };

    // checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleImageUrlChange = (e) => {
    setForm({ ...form, image: e.target.value });
    // Clear file selection when using URL
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      // Check required fields (excluding image which is optional)
      const requiredFields = ['title', 'startDateTime', 'endDateTime', 'location', 'description', 'organizer'];
      const missingFields = requiredFields.filter(field => !form[field]);
      
      if (missingFields.length > 0) {
        alert(`Please fill out all required fields: ${missingFields.join(', ')}`);
        return;
      }

      let imageUrl = form.image; // Default to URL if provided

      // Upload image if file is selected
      if (selectedFile) {
        try {
          imageUrl = await uploadEventImage(selectedFile);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          alert(`Image upload failed: ${uploadError.message}`);
          return;
        }
      }

      // Prepare event data
      const eventData = {
        ...form,
        image: imageUrl || '', // Use uploaded URL or provided URL or empty string
        date: form.startDateTime, // Keep compatibility with existing date field
        status: 'active' // Default status
      };

      await addEventWithAdminPrivileges(eventData);

      alert('Event added successfully!');

      // Reset form
      setForm({
        title: '',
        startDateTime: '',
        endDateTime: '',
        location: '',
        description: '',
        image: '',
        organizer: '',
        category: 'COMMUNITY CLEANUPS'
      });
      setSelectedFile(null);
      setImagePreview(null);

      navigate('/admin');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert(`Failed to add event: ${error.message}`);
    } finally {
      setUploading(false);
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
        <div className="datetime-inputs">
          <label className="datetime-label">Start Date & Time</label>
          <input
            className="admin-form-input"
            name="startDateTime"
            type="datetime-local"
            value={form.startDateTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="datetime-inputs">
          <label className="datetime-label">End Date & Time</label>
          <input
            className="admin-form-input"
            name="endDateTime"
            type="datetime-local"
            value={form.endDateTime}
            onChange={handleChange}
            required
          />
        </div>
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
        <div className="image-upload-section">
          <label className="image-upload-label">Event Image (Optional)</label>
          
          {/* File Upload Option */}
          <div className="file-upload-option">
            <label className="file-upload-label">
              Upload Image File:
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
            </label>
            {selectedFile && (
              <div className="file-info">
                <p>Selected: {selectedFile.name}</p>
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="image-preview"
                  />
                )}
              </div>
            )}
          </div>

          {/* OR Divider */}
          <div className="or-divider">
            <span>OR</span>
          </div>

          {/* URL Input Option */}
          <div className="url-input-option">
            <input
              className="admin-form-input"
              name="image"
              placeholder="Enter Image URL"
              value={form.image}
              onChange={handleImageUrlChange}
            />
          </div>
        </div>
        <select
          className="admin-form-input"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          {EVENT_CATEGORIES.filter(cat => cat !== 'ALL').map(category => (
            <option key={category} value={category}>
              {category.replace('_', ' ')}
            </option>
          ))}
        </select>
        <textarea
          className="admin-form-input"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Adding Event...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
};

export default AdminAddEvent;
