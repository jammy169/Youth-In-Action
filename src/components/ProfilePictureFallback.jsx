import React, { useState, useRef } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import './ProfilePicture.css'

const ProfilePictureFallback = ({ 
  user, 
  currentImageUrl, 
  onImageUpdate, 
  isEditing = false,
  className = '',
  onImageSelect = null, // New prop to handle image selection
  clearPreview = false // New prop to clear preview from parent
}) => {
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  // Effect to clear preview when parent requests it
  React.useEffect(() => {
    if (clearPreview) {
      setPreviewUrl(null)
      setSelectedFile(null)
      setError(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [clearPreview])

  // Generate placeholder image URL with user's initial
  const getPlaceholderUrl = () => {
    const initial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=27ae60&color=ffffff&size=150`
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    console.log('File selected:', file.name, file.type, file.size)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    // Clear previous error
    setError(null)

    // Store the selected file
    setSelectedFile(file)

    // Create preview for immediate display
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target.result)
      console.log('Preview created for file:', file.name)
    }
    reader.readAsDataURL(file)

    // Notify parent component about the selected file
    if (onImageSelect) {
      onImageSelect(file)
    }
  }

  // Function to clear the selected image (called when canceling edit mode)
  const clearSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = async () => {
    if (!user?.uid) return

    try {
      console.log('Removing profile image...')
      
      // Remove from Firestore
      const userProfileRef = doc(db, 'userProfiles', user.uid)
      await setDoc(userProfileRef, {
        profileImage: null,
        imagePath: null,
        imageUpdatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true })

      // Update parent component
      console.log('🔄 Calling onImageUpdate with null (removed)')
      onImageUpdate(null)

      console.log('✅ Profile image removed successfully!')
    } catch (error) {
      console.error('Error removing image:', error)
      setError('Failed to remove image')
    }
  }

  const handleCancel = () => {
    clearSelection()
  }

  // Function to get the selected file (for parent component)
  const getSelectedFile = () => {
    return selectedFile
  }

  const displayImage = previewUrl || currentImageUrl || getPlaceholderUrl()
  
  // Debug logging
  console.log('ProfilePictureFallback render:', { 
    currentImageUrl, 
    displayImage: displayImage?.substring(0, 50) + '...',
    isEditing 
  })

  return (
    <div className={`profile-picture-container ${className}`}>
      <div className="profile-picture-wrapper">
        <img
          src={displayImage}
          alt="Profile"
          className={`profile-picture ${isEditing ? 'clickable' : ''}`}
          onClick={() => {
            if (isEditing && fileInputRef.current) {
              console.log('Profile picture clicked in edit mode!')
              fileInputRef.current.click()
            }
          }}
        />
        
        {/* Upload prompt - only show on hover when in edit mode and no preview */}
        {isEditing && !previewUrl && (
          <div className="profile-picture-overlay upload-prompt-overlay">
            <div className="upload-prompt">
              <span className="camera-icon">📷</span>
              <span>Click to upload</span>
            </div>
          </div>
        )}

        {/* Preview indicator - show when image is selected but not yet saved */}
        {previewUrl && (
          <div className="profile-picture-overlay preview-overlay">
            <div className="preview-indicator">
              <span className="preview-icon">✨</span>
              <span>New Image</span>
            </div>
          </div>
        )}


        {/* Remove button - only show when in edit mode and there's an image */}
        {isEditing && currentImageUrl && (
          <button 
            className="remove-image-btn"
            onClick={(e) => {
              e.stopPropagation()
              handleRemoveImage()
            }}
            disabled={false}
            title="Remove profile picture"
          >
            ✕
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {previewUrl && (
        <div className="preview-info">
          <small>✨ New image selected - Click Save to apply changes</small>
        </div>
      )}

    </div>
  )
}

export default ProfilePictureFallback

