import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Contact messages table name
export const CONTACT_MESSAGES_TABLE = 'contact_messages'

// Function to submit contact form
export const submitContactForm = async (formData) => {
  try {
    console.log('Submitting contact form:', formData)
    
    const { data, error } = await supabase
      .from(CONTACT_MESSAGES_TABLE)
      .insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message
        }
      ])
      .select()

    if (error) {
      console.error('Error submitting contact form:', error)
      
      // Check for specific RLS policy error
      if (error.message.includes('row-level security policy')) {
        return { 
          success: false, 
          error: 'RLS Policy Error: Please run the SQL script in Supabase to fix permissions. Check FIX_RLS_POLICY_ERROR.md for instructions.' 
        }
      }
      
      throw error
    }

    console.log('Contact form submitted successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Contact form submission failed:', error)
    return { success: false, error: error.message }
  }
}

// Function to get all contact messages (for admin use)
export const getContactMessages = async () => {
  try {
    const { data, error } = await supabase
      .from(CONTACT_MESSAGES_TABLE)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contact messages:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to fetch contact messages:', error)
    return { success: false, error: error.message }
  }
}

