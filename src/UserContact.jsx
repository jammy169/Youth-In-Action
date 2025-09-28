import React, { useState } from 'react'
import { submitContactForm } from './supabaseClient'
import './UserContact.css'

const UserContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear status when user starts typing
    if (submitStatus) {
      setSubmitStatus(null)
      setErrorMessage('')
    }
  }

  const validateForm = () => {
    const { name, email, message } = formData
    
    if (!name.trim()) {
      setErrorMessage('Name is required')
      return false
    }
    
    if (!email.trim()) {
      setErrorMessage('Email is required')
      return false
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address')
      return false
    }
    
    if (!message.trim()) {
      setErrorMessage('Message is required')
      return false
    }
    
    if (message.trim().length < 10) {
      setErrorMessage('Message must be at least 10 characters long')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage('')

    try {
      const result = await submitContactForm(formData)
      
      if (result.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
        console.log('Contact form submitted successfully!')
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Failed to submit message. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('An unexpected error occurred. Please try again.')
      console.error('Contact form error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="user-contact-container">
      <div className="user-contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="user-contact-content">
        <div className="user-contact-form-container">
          <form onSubmit={handleSubmit} className="user-contact-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us how we can help you..."
                rows="6"
                disabled={isSubmitting}
                required
              />
            </div>

            {submitStatus === 'success' && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                <span>Thank you for contacting us! We'll get back to you soon.</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>

        <div className="user-contact-info">
          <h3>Get in Touch</h3>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>info@youthinaction.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <div>
                <strong>Phone</strong>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <strong>Address</strong>
                <p>123 Community Street<br />Your City, State 12345</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserContact