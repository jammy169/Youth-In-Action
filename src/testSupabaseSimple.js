// Simple Supabase test
import { supabase } from './supabaseConfig.js'

console.log('Testing Supabase connection...')
console.log('Supabase URL:', supabase.supabaseUrl)

// Test bucket access
supabase.storage.listBuckets().then(({ data, error }) => {
  if (error) {
    console.error('Error listing buckets:', error)
  } else {
    console.log('Available buckets:', data)
    const profileBucket = data.find(bucket => bucket.name === 'profile-images')
    if (profileBucket) {
      console.log('✅ Profile images bucket found:', profileBucket)
    } else {
      console.error('❌ Profile images bucket not found!')
    }
  }
}).catch(err => {
  console.error('Connection test failed:', err)
})


