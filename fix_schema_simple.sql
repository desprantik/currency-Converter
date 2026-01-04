-- SIMPLE VERSION: Fix conversion_history table schema
-- Run this in Supabase SQL Editor (one section at a time if needed)

-- Step 1: Add missing columns
ALTER TABLE conversion_history 
ADD COLUMN IF NOT EXISTS from_currency TEXT,
ADD COLUMN IF NOT EXISTS to_currency TEXT,
ADD COLUMN IF NOT EXISTS from_amount TEXT,
ADD COLUMN IF NOT EXISTS to_amount TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS timestamp BIGINT;

-- Step 2: Ensure id has default UUID
ALTER TABLE conversion_history 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Step 3: Ensure created_at has default timestamp
ALTER TABLE conversion_history 
ALTER COLUMN created_at SET DEFAULT now();

-- Step 4: Set NOT NULL on required columns (only if table is empty or you've migrated data)
-- ALTER TABLE conversion_history 
-- ALTER COLUMN from_currency SET NOT NULL,
-- ALTER COLUMN to_currency SET NOT NULL,
-- ALTER COLUMN from_amount SET NOT NULL,
-- ALTER COLUMN to_amount SET NOT NULL,
-- ALTER COLUMN rate SET NOT NULL;

-- Step 5: Enable RLS and create policies
ALTER TABLE conversion_history ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON conversion_history;
DROP POLICY IF EXISTS "Allow public insert access" ON conversion_history;
DROP POLICY IF EXISTS "Allow public delete access" ON conversion_history;

-- Create new policies
CREATE POLICY "Allow public read access" ON conversion_history
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON conversion_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete access" ON conversion_history
  FOR DELETE USING (true);

-- Step 6: Create index for performance
CREATE INDEX IF NOT EXISTS idx_conversion_history_created_at 
ON conversion_history(created_at DESC);

