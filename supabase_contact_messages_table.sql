-- Create contact_messages table in Supabase
-- Run this SQL in your Supabase SQL Editor

-- First, drop the table if it exists to start fresh
DROP TABLE IF EXISTS contact_messages CASCADE;

-- Create the contact_messages table
CREATE TABLE contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for better query performance
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous contact form submissions" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated users to read contact messages" ON contact_messages;

-- Create a policy to allow anyone to insert contact messages (including anonymous users)
CREATE POLICY "Allow anonymous contact form submissions" ON contact_messages
    FOR INSERT 
    WITH CHECK (true);

-- Create a policy to allow anyone to read contact messages (for debugging)
CREATE POLICY "Allow anyone to read contact messages" ON contact_messages
    FOR SELECT 
    USING (true);

-- Optional: Create a policy to allow authenticated users to read all messages
-- (Only enable this if you want to view messages in your admin panel)
CREATE POLICY "Allow authenticated users to read contact messages" ON contact_messages
    FOR SELECT 
    USING (auth.role() = 'authenticated');
