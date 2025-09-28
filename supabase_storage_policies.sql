-- Supabase Storage Policies for event-images bucket
-- Run this SQL in your Supabase SQL Editor to fix the RLS policy error

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

-- Create policy for public delete access to event-images bucket
CREATE POLICY "Public delete access for event-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'event-images');

-- Alternative: If you want to allow all operations on the bucket, you can use this single policy instead:
-- CREATE POLICY "Allow all operations on event-images"
-- ON storage.objects
-- FOR ALL
-- USING (bucket_id = 'event-images')
-- WITH CHECK (bucket_id = 'event-images');

