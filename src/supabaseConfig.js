import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// You'll need to replace these with your actual Supabase project credentials
const supabaseUrl = 'https://cpezwgjqnaqvfecifdmn.supabase.co' // e.g., 'https://your-project.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZXp3Z2pxbmFxdmZlY2lmZG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjYxNDEsImV4cCI6MjA3MzA0MjE0MX0.wlsiYXd5zgQ5O5DsaiTAUx6hNflIvzmzPfd3tvqejxc' // Your anon/public key

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage bucket name for profile images
export const PROFILE_IMAGES_BUCKET = 'profile-images'

// Helper function to get public URL for an image
export const getPublicUrl = (path) => {
  const { data } = supabase.storage.from(PROFILE_IMAGES_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// Helper function to upload profile image
export const uploadProfileImage = async (file, userId) => {
  try {
    console.log('🚀 Starting Supabase upload...')
    console.log('File:', file.name, file.size, file.type)
    console.log('User ID:', userId)
    console.log('Bucket:', PROFILE_IMAGES_BUCKET)
    
    // Create unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `profile-${userId}-${Date.now()}.${fileExtension}`
    const filePath = `${userId}/${fileName}`
    
    console.log('File path:', filePath)

    // Upload file to Supabase Storage
    console.log('Uploading to Supabase...')
    const { data, error } = await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    console.log('Upload response:', { data, error })

    if (error) {
      console.error('❌ Supabase upload error:', error)
      throw error
    }

    // Get public URL
    const publicUrl = getPublicUrl(data.path)
    console.log('✅ Upload successful!')
    console.log('Path:', data.path)
    console.log('Public URL:', publicUrl)
    
    return {
      success: true,
      path: data.path,
      publicUrl: publicUrl
    }
  } catch (error) {
    console.error('❌ Error uploading to Supabase:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Helper function to delete profile image
export const deleteProfileImage = async (path) => {
  try {
    const { error } = await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .remove([path])

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting from Supabase:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
