# 🚨 URGENT: Supabase Storage Setup Required

Your profile picture feature is failing because the Supabase storage bucket and policies are not properly configured. Follow these steps to fix it:

## 🔍 **Current Issues:**
1. ❌ Profile images bucket not found
2. ❌ Row Level Security (RLS) policy violation
3. ❌ Sign-up process failing due to storage issues

## 🛠️ **Step-by-Step Fix:**

### **Step 1: Go to Supabase Dashboard**
1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `YouthInAction`
3. Go to **Storage** in the left sidebar

### **Step 2: Create the Bucket (if not exists)**
1. Click **"New bucket"**
2. Enter bucket name: `profile-images`
3. ✅ **Check "Public bucket"** (IMPORTANT!)
4. Set file size limit: `5MB`
5. Set allowed MIME types: `image/*`
6. Click **"Create bucket"**

### **Step 3: Set Up Storage Policies**
1. Click on your `profile-images` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"**

#### **Policy 1: Allow Public Read Access**
- **Policy name**: `Allow public read access`
- **Policy definition**:
  ```sql
  bucket_id = 'profile-images'::text
  ```
- **Operation**: `SELECT`

#### **Policy 2: Allow Authenticated Users to Upload**
- **Policy name**: `Allow authenticated users to upload`
- **Policy definition**:
  ```sql
  bucket_id = 'profile-images'::text AND auth.role() = 'authenticated'
  ```
- **Operation**: `INSERT`

#### **Policy 3: Allow Users to Update Their Own Files**
- **Policy name**: `Allow users to update their own files`
- **Policy definition**:
  ```sql
  bucket_id = 'profile-images'::text AND auth.uid()::text = (storage.foldername(name))[1]
  ```
- **Operation**: `UPDATE`

#### **Policy 4: Allow Users to Delete Their Own Files**
- **Policy name**: `Allow users to delete their own files`
- **Policy definition**:
  ```sql
  bucket_id = 'profile-images'::text AND auth.uid()::text = (storage.foldername(name))[1]
  ```
- **Operation**: `DELETE`

### **Step 4: Test the Setup**
1. Refresh your web app
2. Open browser console (F12)
3. Look for these messages:
   - ✅ "Bucket created successfully" or "Bucket already exists"
   - ✅ "Bucket access successful!"
   - ✅ "Upload test successful!"

### **Step 5: Test Profile Picture Upload**
1. Go to your profile page
2. Click on the profile picture
3. Select an image file
4. Click "Upload"
5. Check if the image appears in your Supabase storage

## 🚨 **If Still Not Working:**

### **Check These Common Issues:**

1. **Bucket Not Public**:
   - Go to Storage > Settings
   - Make sure "Public bucket" is checked

2. **RLS Policies Not Applied**:
   - Go to Storage > Policies
   - Make sure all 4 policies are created and enabled

3. **Authentication Issues**:
   - Make sure you're logged in to your app
   - Check if Firebase Auth is working

4. **CORS Issues**:
   - Check browser Network tab for CORS errors
   - Make sure your domain is allowed in Supabase settings

## 📞 **Quick Test:**

After setting up the policies, run this in your browser console:

```javascript
// Test Supabase connection
fetch('https://cpezwgjqnaqvfecifdmn.supabase.co/storage/v1/bucket/profile-images', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZXp3Z2pxbmFxdmZlY2lmZG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjYxNDEsImV4cCI6MjA3MzA0MjE0MX0.wlsiYXd5zgQ5O5DsaiTAUx6hNflIvzmzPfd3tvqejxc'
  }
}).then(r => r.json()).then(console.log)
```

This should return information about your bucket if it's properly configured.

## 🎯 **Expected Result:**

After completing these steps:
- ✅ Profile pictures can be uploaded
- ✅ Images appear in Supabase storage
- ✅ Sign-up process works without errors
- ✅ Images can be removed and updated

**Complete these steps and your profile picture feature will work perfectly!**






