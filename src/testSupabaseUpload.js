// Test Supabase upload functionality
import { supabase, PROFILE_IMAGES_BUCKET } from './supabaseConfig.js'

const testUpload = async () => {
  try {
    console.log('🧪 Testing Supabase upload...')
    
    // Create a simple test file
    const testContent = 'This is a test file for profile image upload'
    const testFile = new Blob([testContent], { type: 'text/plain' })
    testFile.name = 'test-file.txt'
    
    const testPath = 'test/test-file.txt'
    
    console.log('Uploading test file to:', testPath)
    
    const { data, error } = await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .upload(testPath, testFile)
    
    if (error) {
      console.error('❌ Upload test failed:', error)
      return false
    }
    
    console.log('✅ Upload test successful!', data)
    
    // Try to list files to verify
    const { data: files, error: listError } = await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .list('test')
    
    if (listError) {
      console.error('❌ List test failed:', listError)
    } else {
      console.log('✅ List test successful!', files)
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Upload test error:', error)
    return false
  }
}

// Run the test
testUpload()

export default testUpload


