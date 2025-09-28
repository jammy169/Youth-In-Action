-- Simple Storage Fix - No RLS modifications needed
-- This approach works around the permission issue

-- First, create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- That's it! The bucket will be public and accessible

