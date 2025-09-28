import React from 'react'

const DebugProfilePicture = ({ user, userProfile, isEditing }) => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>🐛 Debug Info</h4>
      <div><strong>User:</strong> {user ? '✅' : '❌'}</div>
      <div><strong>User ID:</strong> {user?.uid || 'None'}</div>
      <div><strong>Profile:</strong> {userProfile ? '✅' : '❌'}</div>
      <div><strong>Current Image:</strong> {userProfile?.profileImage ? '✅' : '❌'}</div>
      <div><strong>Image URL:</strong> {userProfile?.profileImage?.substring(0, 50) || 'None'}...</div>
      <div><strong>Is Editing:</strong> {isEditing ? '✅' : '❌'}</div>
    </div>
  )
}

export default DebugProfilePicture


