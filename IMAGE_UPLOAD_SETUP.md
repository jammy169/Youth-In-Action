# Image Upload Setup for YouthInAction

This document explains how to set up image upload functionality using Supabase Storage.

## Prerequisites

1. **Supabase Project**: You need a Supabase project with the following setup:
   - A bucket named `event-images` in Supabase Storage
   - Proper RLS (Row Level Security) policies for the bucket

2. **Environment Variables**: Create a `.env` file in the project root with:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Features Implemented

### 1. Supabase Client Configuration (`src/utils/supabaseClient.js`)
- Uses environment variables for configuration
- Includes error handling for missing environment variables
- Maintains existing contact form functionality

### 2. Image Upload Helper (`src/utils/supabaseUpload.js`)
- `uploadEventImage(file)`: Uploads images to the `event-images` bucket
- Generates unique filenames using timestamps
- Validates file type (images only) and size (max 5MB)
- Returns public URL of uploaded image
- `deleteEventImage(imageUrl)`: Helper to delete images (for future use)

### 3. Updated Admin Add Event Form (`src/admin/AdminAddEvent.jsx`)
- **File Upload Option**: Users can select and upload image files
- **URL Input Option**: Users can still enter image URLs manually
- **Image Preview**: Shows preview of selected image
- **Optional Image**: Form works with or without images
- **Loading States**: Shows upload progress
- **Error Handling**: Proper error messages for upload failures

### 4. Enhanced Styling (`src/admin/AdminAddEvent.css`)
- Modern file upload interface with drag-and-drop styling
- Image preview functionality
- Responsive design for mobile devices
- Loading states for buttons

## Usage

1. **For Admins**: When adding a new event:
   - Choose between uploading a file or entering a URL
   - File upload: Click the upload area and select an image
   - URL input: Enter a direct image URL
   - Both options are optional - events can be created without images

2. **File Requirements**:
   - Supported formats: All image types (JPEG, PNG, GIF, WebP, etc.)
   - Maximum size: 5MB
   - Files are automatically renamed with timestamps for uniqueness

## Technical Details

- **Storage**: Images are stored in Supabase Storage bucket `event-images`
- **Naming**: Files are renamed to `event-{timestamp}.{extension}`
- **URLs**: Public URLs are generated for immediate use
- **Compatibility**: Works with existing Firebase Firestore event storage
- **Fallback**: If no image is provided, the `image` field will be empty

## Troubleshooting

1. **Upload Fails**: Check that the `event-images` bucket exists in Supabase
2. **Environment Variables**: Ensure `.env` file has correct Supabase credentials
3. **File Size**: Large files (>5MB) will be rejected
4. **File Type**: Only image files are accepted

## Future Enhancements

- Image compression before upload
- Multiple image support
- Image editing capabilities
- Bulk image upload

