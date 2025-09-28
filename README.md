# YouthInAction - Firebase Storage Fix

## Issue Fixed
The profile image upload was failing due to CORS (Cross-Origin Resource Sharing) policy errors. This was caused by an incorrect Firebase Storage bucket configuration.

## Changes Made

### 1. Fixed Firebase Configuration (`src/firebaseConfig.js`)
- Changed `storageBucket` from `"youthinaction-e1920.firebasestorage.app"` to `"youthinaction-e1920.appspot.com"`

### 2. Improved Image Upload Function (`src/Profile.jsx`)
- Added better error handling with specific error messages
- Added metadata to uploads for better tracking
- Created unique filenames with timestamps

### 3. Added Firebase Storage Rules (`storage.rules`)
- Created security rules to allow authenticated users to upload profile images
- Restricted access to only the user's own profile images

### 4. Added Firebase Configuration (`firebase.json`)
- Set up proper Firebase project configuration

## Next Steps

To complete the fix, you need to deploy the storage rules to Firebase:

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**:
   ```bash
   firebase init
   ```
   - Select "Storage" when prompted
   - Use existing project: `youthinaction-e1920`

4. **Deploy Storage Rules**:
   ```bash
   firebase deploy --only storage
   ```

## Why This Fixes the Issue

The main problem was the incorrect storage bucket URL. Firebase Storage uses `.appspot.com` domains, not `.firebasestorage.app`. The CORS errors occurred because:

1. Your app was trying to connect to a non-existent domain
2. Firebase couldn't validate the origin properly
3. The preflight request failed, blocking the upload

With the correct configuration, Firebase Storage will:
- Accept requests from your localhost development server
- Properly handle CORS headers
- Allow authenticated users to upload images

## Testing

After deploying the storage rules, test the profile image upload:
1. Go to your profile page
2. Click "Edit Profile"
3. Click on your profile image
4. Select an image file
5. The upload should now complete successfully

The "Uploading..." indicator should disappear and you should see your new profile image.
