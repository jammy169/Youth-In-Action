# Supabase Setup Guide for Profile Pictures

This guide will help you set up Supabase Storage for profile picture uploads in your Youth in Action web app.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `youth-in-action` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait for the project to be created (usually takes 1-2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## Step 3: Update Configuration

1. Open `src/supabaseConfig.js`
2. Replace the placeholder values:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL' // Replace with your Project URL
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // Replace with your Anon Key
   ```

## Step 4: Create Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Enter bucket details:
   - **Name**: `profile-images`
   - **Public bucket**: ✅ **Check this box** (important!)
   - **File size limit**: `5MB` (or your preferred limit)
   - **Allowed MIME types**: `image/*`
4. Click "Create bucket"

## Step 5: Set Up Storage Policies

1. In the Storage section, click on your `profile-images` bucket
2. Go to the **Policies** tab
3. Click "New Policy"
4. Create the following policies:

### Policy 1: Allow users to upload their own images
- **Policy name**: `Users can upload their own profile images`
- **Policy definition**:
  ```sql
  (bucket_id = 'profile-images'::text) AND (auth.uid()::text = (storage.foldername(name))[1])
  ```
- **Operation**: `INSERT`

### Policy 2: Allow users to update their own images
- **Policy name**: `Users can update their own profile images`
- **Policy definition**:
  ```sql
  (bucket_id = 'profile-images'::text) AND (auth.uid()::text = (storage.foldername(name))[1])
  ```
- **Operation**: `UPDATE`

### Policy 3: Allow users to delete their own images
- **Policy name**: `Users can delete their own profile images`
- **Policy definition**:
  ```sql
  (bucket_id = 'profile-images'::text) AND (auth.uid()::text = (storage.foldername(name))[1])
  ```
- **Operation**: `DELETE`

### Policy 4: Allow public access to view images
- **Policy name**: `Anyone can view profile images`
- **Policy definition**:
  ```sql
  bucket_id = 'profile-images'::text
  ```
- **Operation**: `SELECT`

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to your profile page
3. Click "Edit Profile"
4. Try uploading a profile picture
5. Verify the image appears correctly

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**
   - Double-check your Supabase URL and Anon Key
   - Make sure there are no extra spaces or characters

2. **"Bucket not found" error**
   - Verify the bucket name is exactly `profile-images`
   - Check that the bucket is marked as public

3. **"Policy violation" error**
   - Ensure all storage policies are created correctly
   - Check that the user is authenticated

4. **Images not displaying**
   - Verify the bucket is public
   - Check browser console for CORS errors
   - Ensure the image URL is being generated correctly

### File Size Limits:
- Default Supabase limit: 50MB
- Recommended for profile images: 5MB
- You can adjust this in your bucket settings

### Supported Image Formats:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)
- SVG (.svg)

## Security Notes

- The storage policies ensure users can only access their own images
- Images are stored in user-specific folders: `{userId}/{filename}`
- All images are publicly viewable (necessary for displaying in the app)
- Consider implementing image compression on the client side for better performance

## Cost Considerations

- Supabase offers 1GB of free storage
- Additional storage costs $0.021 per GB per month
- For a typical profile image (100KB), you can store ~10,000 images for free
- Monitor your usage in the Supabase dashboard

## Next Steps

Once everything is working:
1. Consider implementing image compression
2. Add image resizing for different display sizes
3. Implement image optimization and lazy loading
4. Add error handling for failed uploads
5. Consider adding image metadata (upload date, file size, etc.)


