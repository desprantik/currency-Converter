# Fix Conversion History Save Issue

## Problem
The "Save Current Conversion" feature is not saving to the `conversion_history` table in Supabase. Data might be going to `kv_store_913e994f` instead, or inserts are failing due to schema mismatches.

## Root Causes
1. **Schema Mismatch**: The table schema doesn't match what the code expects
2. **Missing Columns**: `from_amount`, `to_amount`, `description`, and `timestamp` columns are missing
3. **RLS Policies**: Row Level Security might be blocking inserts

## Solution

### Step 1: Fix the Database Schema

Run the SQL in `fix_schema_simple.sql` in your Supabase SQL Editor:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `fix_schema_simple.sql`
4. Run the SQL script

This will:
- Add missing columns (`from_amount`, `to_amount`, `description`, `timestamp`)
- Set up proper defaults for `id` and `created_at`
- Create RLS policies to allow public access
- Create indexes for better performance

### Step 2: Verify Edge Function Environment Variables

Make sure your Supabase Edge Function has these environment variables set:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (for bypassing RLS)

To check/set these:
1. Go to Supabase Dashboard → Edge Functions
2. Select your function
3. Go to Settings → Environment Variables
4. Ensure both variables are set

### Step 3: Redeploy the Edge Function

After updating the code, redeploy your edge function:

```bash
# If using Supabase CLI
supabase functions deploy make-server-913e994f

# Or use the Supabase Dashboard to redeploy
```

### Step 4: Test the Save Feature

1. Open your app
2. Enter an amount and select currencies
3. Click the clock icon → "Save Current Conversion"
4. Add a description and save
5. Check the `conversion_history` table in Supabase to verify the entry was created

## Expected Table Schema

After running the SQL, your `conversion_history` table should have:

- `id` (UUID, primary key, default: gen_random_uuid())
- `from_currency` (TEXT, not null)
- `to_currency` (TEXT, not null)
- `from_amount` (TEXT, not null)
- `to_amount` (TEXT, not null)
- `rate` (NUMERIC, not null)
- `description` (TEXT, nullable)
- `timestamp` (BIGINT, nullable)
- `created_at` (TIMESTAMPTZ, default: now())

## Troubleshooting

### If saves still don't work:

1. **Check Edge Function Logs**:
   - Go to Supabase Dashboard → Edge Functions → Logs
   - Look for error messages when you try to save

2. **Check Browser Console**:
   - Open browser DevTools → Console
   - Look for error messages when clicking "Save"

3. **Verify RLS Policies**:
   - Go to Supabase Dashboard → Table Editor → conversion_history
   - Click "RLS policies" tab
   - Ensure policies exist and are enabled

4. **Test the API directly**:
   ```bash
   curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-913e994f/history \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -d '{
       "from_amount": "100",
       "from_currency": "USD",
       "to_amount": "85.50",
       "to_currency": "EUR",
       "rate": "0.855",
       "description": "Test conversion"
     }'
   ```

## Code Changes Made

1. **Backend (`supabase/functions/server/index.tsx`)**:
   - Improved error logging
   - Better type handling for insert data
   - Proper handling of `created_at` timestamp
   - Service role key support

2. **SQL Files Created**:
   - `fix_conversion_history_schema.sql` - Complete schema fix with migration
   - `fix_schema_simple.sql` - Simple step-by-step fix

