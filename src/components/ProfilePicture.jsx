import React, { useState, useRef } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { uploadProfileImage, deleteProfileImage, getPublicUrl } from '../supabaseConfig'
import './ProfilePicture.css'

const ProfilePicture = ({ 
  user, 
  currentImageUrl, 
  onImageUpdate, 
  isEditing = false,
  className = '' 
}) => {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

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

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target.result)
      console.log('Preview created for file:', file.name)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0]
    if (!file || !user?.uid) {
      console.log('Upload failed: missing file or user', { file: !!file, user: !!user?.uid })
      return
    }

    console.log('Starting upload for user:', user.uid, 'file:', file.name)
    setUploading(true)
    setError(null)

    try {
      // Upload to Supabase
      console.log('Uploading to Supabase...')
      const uploadResult = await uploadProfileImage(file, user.uid)
      console.log('Upload result:', uploadResult)
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error)
      }

      // Save URL to Firestore
      console.log('Saving to Firestore...')
      const userProfileRef = doc(db, 'userProfiles', user.uid)
      await setDoc(userProfileRef, {
        profileImage: uploadResult.publicUrl,
        imagePath: uploadResult.path,
        imageUpdatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true })

      // Update parent component
      console.log('🔄 Calling onImageUpdate with:', uploadResult.publicUrl)
      onImageUpdate(uploadResult.publicUrl)

      // Clear preview and file input
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      console.log('✅ Profile image updated successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      setError(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!user?.uid) return

    try {
      console.log('Removing profile image...')
      
      // Get current image path from Firestore
      const userProfileRef = doc(db, 'userProfiles', user.uid)
      const userDoc = await getDoc(userProfileRef)
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const imagePath = userData.imagePath

        // Delete from Supabase if path exists
        if (imagePath) {
          console.log('Deleting from Supabase:', imagePath)
          const deleteResult = await deleteProfileImage(imagePath)
          if (!deleteResult.success) {
            console.warn('Failed to delete from Supabase:', deleteResult.error)
            // Continue anyway - we'll still remove from Firestore
          }
        }
      }

      // Remove from Firestore
      console.log('Updating Firestore...')
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
    setPreviewUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const displayImage = previewUrl || currentImageUrl || getPlaceholderUrl()
  
  // Debug logging
  console.log('ProfilePicture render:', { 
    currentImageUrl, 
    previewUrl, 
    displayImage: displayImage?.substring(0, 50) + '...',
    isEditing 
  })

  return (
    <div className={`profile-picture-container ${className}`}>
      <div className="profile-picture-wrapper">
        <img
          src={displayImage}
          alt="Profile"
          className="profile-picture clickable"
          onClick={() => {
            console.log('Profile picture clicked!')
            if (!uploading && fileInputRef.current) {
              fileInputRef.current.click()
            }
          }}
        />
        
        {/* Upload prompt - only show on hover when no preview */}
        {!uploading && !previewUrl && (
          <div className="profile-picture-overlay upload-prompt-overlay">
            <div className="upload-prompt">
              <span className="camera-icon">📷</span>
              <span>Click to upload</span>
            </div>
          </div>
        )}

        {/* Upload/Preview actions */}
        {previewUrl && (
          <div className="profile-picture-overlay preview-overlay">
            <div className="preview-actions">
              <button 
                className="upload-btn"
                onClick={handleUpload}
                disabled={uploading}
              >
                Upload
              </button>
              <button 
                className="cancel-btn"
                onClick={handleCancel}
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Uploading indicator */}
        {uploading && (
          <div className="profile-picture-overlay uploading-overlay">
            <div className="uploading-indicator">
              <div className="spinner"></div>
              <span>Uploading...</span>
            </div>
          </div>
        )}

        {/* Remove button - only show when there's an image and not in preview mode */}
        {currentImageUrl && !previewUrl && (
          <button 
            className="remove-image-btn"
            onClick={(e) => {
              e.stopPropagation()
              handleRemoveImage()
            }}
            disabled={uploading}
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
          <small>Preview: Click Upload to save or Cancel to discard</small>
        </div>
      )}
    </div>
  )
}

export default ProfilePicture