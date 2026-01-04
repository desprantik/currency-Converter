-- Fix conversion_history table schema to match the application code
-- Run this SQL in your Supabase SQL Editor

-- First, check if we need to migrate existing data
-- If you have data in the old schema (amount, result), uncomment and run this first:
-- UPDATE conversion_history 
-- SET from_amount = amount::text, to_amount = result::text 
-- WHERE from_amount IS NULL AND to_amount IS NULL;

-- Drop the old columns if they exist (amount, result)
ALTER TABLE conversion_history 
DROP COLUMN IF EXISTS amount,
DROP COLUMN IF EXISTS result;

-- Add missing columns if they don't exist
ALTER TABLE conversion_history 
ADD COLUMN IF NOT EXISTS from_amount TEXT,
ADD COLUMN IF NOT EXISTS to_amount TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS timestamp BIGINT;

-- Ensure id column exists and is UUID with default
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'conversion_history' AND column_name = 'id'
  ) THEN
    ALTER TABLE conversion_history ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
  ELSE
    -- Ensure id has default value if it doesn't
    ALTER TABLE conversion_history ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Ensure created_at has default timestamp
ALTER TABLE conversion_history 
ALTER COLUMN created_at SET DEFAULT now();

-- Make sure id is the primary key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'conversion_history_pkey'
  ) THEN
    ALTER TABLE conversion_history ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Set NOT NULL constraints on required fields
ALTER TABLE conversion_history 
ALTER COLUMN from_currency SET NOT NULL,
ALTER COLUMN to_currency SET NOT NULL,
ALTER COLUMN from_amount SET NOT NULL,
ALTER COLUMN to_amount SET NOT NULL,
ALTER COLUMN rate SET NOT NULL;

-- Create index on created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_conversion_history_created_at 
ON conversion_history(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE conversion_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON conversion_history;
DROP POLICY IF EXISTS "Allow public insert access" ON conversion_history;
DROP POLICY IF EXISTS "Allow public delete access" ON conversion_history;
DROP POLICY IF EXISTS "Allow service role full access" ON conversion_history;

-- Create RLS policies for public access (since we're using service role in edge function)
-- Allow anyone to read their own history (or all if you want public read)
CREATE POLICY "Allow public read access" ON conversion_history
  FOR SELECT
  USING (true);

-- Allow anyone to insert (or restrict based on auth if you have user auth)
CREATE POLICY "Allow public insert access" ON conversion_history
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to delete (or restrict based on auth if you have user auth)
CREATE POLICY "Allow public delete access" ON conversion_history
  FOR DELETE
  USING (true);

-- Verify the final schema
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'conversion_history'
ORDER BY ordinal_position;

