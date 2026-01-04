# Deploy Edge Function Instructions

## Quick Deploy via Browser Editor

1. Go to Supabase Dashboard → Edge Functions
2. Click on `make-server-913e994f`
3. Click "Edit" or open the code editor
4. Copy the entire contents of `supabase/functions/server/index.tsx`
5. Paste it into the editor
6. Click "Deploy" or "Save"

## Deploy via CLI (Recommended for future updates)

### Install Supabase CLI

**macOS:**
```bash
brew install supabase/tap/supabase
```

**Or using npm:**
```bash
npm install -g supabase
```

### Login to Supabase
```bash
supabase login
```

### Link your project
```bash
supabase link --project-ref galffslivntdeuqzsqbq
```

### Deploy the function
```bash
supabase functions deploy make-server-913e994f
```

## Important Notes

- Make sure the function name matches: `make-server-913e994f`
- The `kv_store.tsx` file should already be in the function directory
- Environment variables are already set in Supabase (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, etc.)
- After deployment, wait a few seconds for the function to be ready

## Verify Deployment

After deploying, test the function:
```bash
curl https://galffslivntdeuqzsqbq.supabase.co/functions/v1/make-server-913e994f/health
```

Should return: `{"status":"ok"}`

