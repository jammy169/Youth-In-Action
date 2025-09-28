-- SIMPLE VERSION: Contact messages table without RLS
-- Run this SQL in your Supabase SQL Editor if the RLS version doesn't work

-- Drop the table if it exists
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

-- DO NOT enable RLS for this table - this allows anonymous access
-- This is simpler but less secure (only use for contact forms)





