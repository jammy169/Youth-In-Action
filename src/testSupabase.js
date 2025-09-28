// Test Supabase connection
import { supabase, PROFILE_IMAGES_BUCKET } from './supabaseConfig'

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    
    // Test 1: Check if we can access the storage bucket
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError)
      return false
    }
    
    console.log('Available buckets:', buckets)
    
    // Test 2: Check if our profile-images bucket exists
    const profileBucket = buckets.find(bucket => bucket.name === PROFILE_IMAGES_BUCKET)
    
    if (!profileBucket) {
      console.error('Profile images bucket not found!')
      return false
    }
    
    console.log('Profile images bucket found:', profileBucket)
    
    // Test 3: Try to list files in the bucket (should work even if empty)
    const { data: files, error: filesError } = await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .list('', { limit: 1 })
    
    if (filesError) {
      console.error('Error listing files:', filesError)
      return false
    }
    
    console.log('Bucket access successful! Files:', files)
    return true
    
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return false
  }
}

// Run test when this file is imported
testSupabaseConnection()
