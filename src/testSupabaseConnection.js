// Test Supabase connection
import { supabase, PROFILE_IMAGES_BUCKET } from './supabaseConfig.js'

const testConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...')
    console.log('Supabase URL:', supabase.supabaseUrl)
    
    // Test 1: List buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError)
      return false
    }
    
    console.log('✅ Available buckets:', buckets.map(b => b.name))
    
    // Test 2: Check if profile-images bucket exists
    const profileBucket = buckets.find(bucket => bucket.name === PROFILE_IMAGES_BUCKET)
    
    if (!profileBucket) {
      console.error('❌ Profile images bucket not found!')
      console.log('Available buckets:', buckets.map(b => b.name))
      return false
    }
    
    console.log('✅ Profile images bucket found:', profileBucket)
    
    // Test 3: Try to list files in the bucket
    const { data: files, error: filesError } = await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .list('', { limit: 1 })
    
    if (filesError) {
      console.error('❌ Error listing files:', filesError)
      return false
    }
    
    console.log('✅ Bucket access successful! Files:', files)
    console.log('🎉 Supabase connection test passed!')
    return true
    
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error)
    return false
  }
}

// Run the test
testConnection()

export default testConnection


