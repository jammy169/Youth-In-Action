import React, { useState, useEffect } from 'react'
import { getContactMessages } from '../supabaseClient'
import './AdminFeedback.css'

const AdminFeedback = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMessages = async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await getContactMessages()
      
      if (result.success) {
        setMessages(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (index) => {
    const colors = ['#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6']
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="admin-feedback-container">
        <div className="loading">Loading feedback...</div>
      </div>
    )
  }

  return (
    <div className="admin-feedback-container">
      <div className="admin-feedback-header">
        <h1>📋 Feedback Messages</h1>
        <div className="header-actions">
          <button onClick={fetchMessages} className="refresh-btn">
            🔄 Refresh
          </button>
          <span className="message-count">{messages.length} messages</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      <div className="feedback-grid">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">📭</div>
            <h3>No feedback yet</h3>
            <p>Messages will appear here when users submit the contact form.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={message.id} className="feedback-card">
              <div className="feedback-header">
                <div className="user-info">
                  <div 
                    className="user-avatar" 
                    style={{ backgroundColor: getStatusColor(index) }}
                  >
                    {message.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <h3>{message.name}</h3>
                    <p className="user-email">📧 {message.email}</p>
                  </div>
                </div>
                <div className="message-date">
                  {formatDate(message.created_at)}
                </div>
              </div>
              
              <div className="message-content">
                <p>{message.message}</p>
              </div>
              
              <div className="message-actions">
                <span className="message-id">ID: {message.id.substring(0, 8)}...</span>
                <button 
                  className="reply-btn"
                  onClick={() => window.open(`mailto:${message.email}?subject=Re: Your feedback`)}
                >
                  📧 Reply
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminFeedback





