import { supabase } from './supabaseClient'

/**
 * Upload an event image to Supabase Storage
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadEventImage = async (file) => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB')
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `event-${timestamp}.${fileExtension}`

    console.log('Uploading file:', fileName)

    // Bucket should already exist - no need to create it
    console.log('Using existing event-images bucket')

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      
      // If it's an RLS policy error, provide helpful message
      if (error.message.includes('row-level security policy')) {
        throw new Error('Storage permissions not configured. Please go to Supabase Dashboard > Storage > event-images bucket > Policies and create policies for anon role to allow INSERT and SELECT operations.')
      }
      
      throw new Error(`Upload failed: ${error.message}`)
    }

    console.log('Upload successful:', data)

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('event-images')
      .getPublicUrl(fileName)

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL')
    }

    console.log('Public URL:', urlData.publicUrl)
    return urlData.publicUrl

  } catch (error) {
    console.error('Error uploading event image:', error)
    throw error
  }
}

/**
 * Delete an event image from Supabase Storage
 * @param {string} imageUrl - The public URL of the image to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteEventImage = async (imageUrl) => {
  try {
    // Extract filename from URL
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]

    console.log('Deleting file:', fileName)

    const { error } = await supabase.storage
      .from('event-images')
      .remove([fileName])

    if (error) {
      console.error('Delete error:', error)
      throw new Error(`Delete failed: ${error.message}`)
    }

    console.log('File deleted successfully')
    return true

  } catch (error) {
    console.error('Error deleting event image:', error)
    throw error
  }
}
