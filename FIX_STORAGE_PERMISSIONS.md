# Fix Supabase Storage Permissions

The error "new row violates row-level security policy" occurs because your Supabase Storage bucket doesn't have the proper permissions configured.

## 🔧 Solution: Run SQL Script in Supabase

### Step 1: Open Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the SQL Script
Copy and paste the following SQL script into the SQL Editor and click **Run**:

```sql
-- Supabase Storage Policies for event-images bucket
-- This script fixes the RLS policy error

-- First, make sure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS on the storage.objects table (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;

-- Create policy for public read access to event-images bucket
CREATE POLICY "Public read access for event-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

-- Create policy for public upload access to event-images bucket
CREATE POLICY "Public upload access for event-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'event-images');

-- Create policy for public update access to event-images bucket
CREATE POLICY "Public update access for event-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'event-images');

-- Create policy for public delete access for event-images bucket
CREATE POLICY "Public delete access for event-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'event-images');
```

### Step 3: Verify the Setup
After running the script, you should see:
- ✅ Bucket `event-images` created and set to public
- ✅ RLS policies created for all operations
- ✅ No error messages

## 🎯 Alternative: Manual Setup in Supabase Dashboard

If the SQL script doesn't work, you can set up the bucket manually:

### 1. Create the Bucket
1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name: `event-images`
4. **Make it public**: ✅ Check this box
5. Click **Create bucket**

### 2. Set Up Policies
1. Go to **Authentication** → **Policies**
2. Find the `storage.objects` table
3. Create these policies:

**Policy 1: Public Read**
- Name: `Public read access for event-images`
- Operation: `SELECT`
- Target roles: `public`
- USING: `bucket_id = 'event-images'`

**Policy 2: Public Upload**
- Name: `Public upload access for event-images`
- Operation: `INSERT`
- Target roles: `public`
- WITH CHECK: `bucket_id = 'event-images'`

**Policy 3: Public Update**
- Name: `Public update access for event-images`
- Operation: `UPDATE`
- Target roles: `public`
- USING: `bucket_id = 'event-images'`

**Policy 4: Public Delete**
- Name: `Public delete access for event-images`
- Operation: `DELETE`
- Target roles: `public`
- USING: `bucket_id = 'event-images'`

## 🧪 Test the Fix

After setting up the permissions:

1. **Refresh your web app**
2. **Try uploading an image** in the admin form
3. **Check the browser console** - you should see:
   - ✅ "Uploading file: event-[timestamp].png"
   - ✅ "Upload successful: [file data]"
   - ✅ "Public URL: [url]"

## 🚨 If Still Not Working

If you're still getting errors:

1. **Check bucket exists**: Go to Storage → Buckets and verify `event-images` is there
2. **Check bucket is public**: The bucket should show as "Public" in the dashboard
3. **Check policies**: Go to Authentication → Policies and verify the policies are created
4. **Try the manual setup** if the SQL script didn't work

## 📞 Need Help?

If you're still having issues, the error message will now be more helpful and tell you exactly what to do!

