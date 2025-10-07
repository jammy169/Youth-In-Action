// EventRegistration.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { getEventRegistrationStatus } from '../utils/eventRegistrationUtils';
import { sendRegistrationConfirmationEmail } from '../utils/gmailEmailService';
import './EventRegistration.css';

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: auth.currentUser?.email || '',
    phone: '',
    age: '',
    emergencyContact: '',
    emergencyPhone: '',
    dietaryRestrictions: '',
    experience: '',
    motivation: '',
    agreeToTerms: false
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const eventData = { id: docSnap.id, ...docSnap.data() };
          setEvent(eventData);
          setRegistrationStatus(getEventRegistrationStatus(eventData));
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if registration is still allowed
    if (!registrationStatus || !registrationStatus.canRegister) {
      alert(registrationStatus?.message || 'Registration is not available for this event.');
      return;
    }
    
    setSubmitting(true);

    try {
      // Add registration to Firebase
      const registrationData = {
        ...formData,
        eventId: eventId,
        eventTitle: event.title,
        userId: auth.currentUser?.uid,
        registrationDate: new Date().toISOString(),
        status: 'pending'
      };

      await addDoc(collection(db, 'registrations'), registrationData);

      // Send email confirmation
      console.log('📧 Sending registration confirmation email...');
      try {
        const emailResult = await sendRegistrationConfirmationEmail(registrationData, event);
        if (emailResult.success) {
          console.log('✅ Registration confirmation email sent successfully');
        } else {
          console.log('⚠️ Email sending failed:', emailResult.message);
        }
      } catch (emailError) {
        console.error('❌ Email sending error:', emailError);
        // Continue with registration even if email fails
      }

      // Show success message and redirect
      alert('Registration successful! Check your email for confirmation details.');
      navigate(`/event/${eventId}`);
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!event) return <div className="error">Event not found</div>;

  return (
    <div className="registration-container">
      {registrationStatus && !registrationStatus.canRegister && (
        <div className="registration-status-banner">
          <div className={`status-message ${registrationStatus.status}`}>
            <span className="status-icon">
              {registrationStatus.status === 'ongoing' ? '⏰' : '✅'}
            </span>
            <span className="status-text">{registrationStatus.message}</span>
          </div>
        </div>
      )}
      <div className="registration-header">
        <button className="back-button" onClick={() => navigate(`/event/${eventId}`)}>
          ← Back to Event
        </button>
        
        <div className="event-summary">
          <h1>Register for {event.title}</h1>
          <div className="event-quick-info">
            <span className="date">📅 {formatDate(event.date)}</span>
            <span className="location">📍 {event.location}</span>
          </div>
        </div>
      </div>

      <div className="registration-content">
        <div className="form-section">
          <form onSubmit={handleSubmit} className={`registration-form ${!registrationStatus?.canRegister ? 'disabled' : ''}`}>
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="readonly-field"
                  title="Email is automatically set from your account"
                />
                <small className="field-note">Email is automatically set from your account</small>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="16"
                  max="100"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="experience">Previous Volunteer Experience</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <option value="">Select experience level</option>
                  <option value="none">No previous experience</option>
                  <option value="some">Some experience (1-2 events)</option>
                  <option value="moderate">Moderate experience (3-10 events)</option>
                  <option value="extensive">Extensive experience (10+ events)</option>
                </select>
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="emergencyContact">Emergency Contact Name *</label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="emergencyPhone">Emergency Contact Phone *</label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="dietaryRestrictions">Dietary Restrictions or Allergies</label>
              <textarea
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleChange}
                placeholder="Please let us know about any dietary restrictions or allergies..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="motivation">Why do you want to participate in this event?</label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                placeholder="Share your motivation for joining this event..."
                rows="4"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                <span className="checkmark"></span>
                I agree to the terms and conditions and understand that participation is voluntary *
              </label>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => navigate(`/event/${eventId}`)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting || !formData.agreeToTerms}
              >
                {submitting ? 'Submitting...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>

        <div className="info-section">
          <div className="event-details-card">
            <img src={event.image} alt={event.title} className="event-thumbnail" />
            <h3>{event.title}</h3>
            <p className="event-description">{event.description}</p>
            
            <div className="event-info">
              <div className="info-item">
                <strong>Date:</strong> {formatDate(event.date)}
              </div>
              <div className="info-item">
                <strong>Location:</strong> {event.location}
              </div>
              <div className="info-item">
                <strong>Organizer:</strong> {event.organizer}
              </div>
            </div>
          </div>

          <div className="what-to-expect">
            <h3>What to Expect</h3>
            <ul>
              <li>🌟 Make a positive impact in your community</li>
              <li>🤝 Meet like-minded volunteers</li>
              <li>📚 Learn new skills and gain experience</li>
              <li>🎯 Contribute to meaningful causes</li>
              <li>📜 Receive a volunteer certificate</li>
            </ul>
          </div>

          <div className="contact-info">
            <h3>Need Help?</h3>
            <p>If you have any questions about this event or registration, please contact us:</p>
            <p>📧 youthinaction@gmail.com</p>
            <p>📞 +81-XXX-XXX-XXXX</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
