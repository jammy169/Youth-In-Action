import React, { useState } from 'react'
import ProfilePicture from './ProfilePicture'

// Example component showing how to use ProfilePicture
const ProfilePictureExample = () => {
  const [user] = useState({
    uid: 'example-user-id',
    email: 'user@example.com',
    displayName: 'John Doe'
  })
  
  const [profileImage, setProfileImage] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleImageUpdate = (newImageUrl) => {
    setProfileImage(newImageUrl)
    console.log('Profile image updated:', newImageUrl)
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Profile Picture Example</h2>
      
      <ProfilePicture
        user={user}
        currentImageUrl={profileImage}
        onImageUpdate={handleImageUpdate}
        isEditing={isEditing}
      />
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          style={{
            padding: '10px 20px',
            backgroundColor: isEditing ? '#e74c3c' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isEditing ? 'Stop Editing' : 'Edit Profile Picture'}
        </button>
      </div>
      
      {profileImage && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <strong>Current Image URL:</strong>
          <br />
          <small style={{ wordBreak: 'break-all' }}>{profileImage}</small>
        </div>
      )}
    </div>
  )
}

export default ProfilePictureExample


