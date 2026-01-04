import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
// Use service role key for server-side operations to bypass RLS if needed
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-913e994f/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all favorites
app.get("/make-server-913e994f/favorites", async (c) => {
  try {
    const { data, error } = await supabase
      .from('favorite_pairs')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching favorites:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ data: data || [] });
  } catch (error) {
    console.error('Error in favorites endpoint:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Add a favorite
app.post("/make-server-913e994f/favorites", async (c) => {
  try {
    const body = await c.req.json();
    const { from_currency, to_currency } = body;

    const { data, error } = await supabase
      .from('favorite_pairs')
      .insert([{ from_currency, to_currency }])
      .select();

    if (error) {
      console.error('Error adding favorite:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ data });
  } catch (error) {
    console.error('Error in add favorite endpoint:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete a favorite
app.delete("/make-server-913e994f/favorites/:id", async (c) => {
  try {
    const id = c.req.param('id');

    const { error } = await supabase
      .from('favorite_pairs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting favorite:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error in delete favorite endpoint:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all history
app.get("/make-server-913e994f/history", async (c) => {
  try {
    const { data, error } = await supabase
      .from('conversion_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching history:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ data: data || [] });
  } catch (error) {
    console.error('Error in history endpoint:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Add a history entry
app.post("/make-server-913e994f/history", async (c) => {
  try {
    const body = await c.req.json();
    console.log('Received request body:', body);
    
    const { from_amount, from_currency, to_amount, to_currency, rate, description, timestamp } = body;

    // Validate required fields
    if (!from_amount || !from_currency || !to_amount || !to_currency || !rate) {
      return c.json({ 
        error: 'Missing required fields', 
        received: { from_amount, from_currency, to_amount, to_currency, rate }
      }, 400);
    }

    // Prepare the insert data, ensuring proper types
    const insertData: any = {
      from_amount: String(from_amount),
      from_currency: String(from_currency),
      to_amount: String(to_amount),
      to_currency: String(to_currency),
      rate: parseFloat(String(rate)),
      description: description || null,
    };

    // If timestamp is provided, use it for both timestamp and created_at
    if (timestamp) {
      insertData.timestamp = Number(timestamp);
      // Convert timestamp (milliseconds) to ISO string for created_at
      insertData.created_at = new Date(Number(timestamp)).toISOString();
    }
    // If no timestamp, let created_at use the database default (now())

    console.log('Inserting history entry:', JSON.stringify(insertData, null, 2));
    console.log('Supabase URL:', supabaseUrl);
    console.log('Using service role key:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

    const { data, error } = await supabase
      .from('conversion_history')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Error adding history:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return c.json({ 
        error: error.message, 
        code: error.code,
        details: error,
        hint: error.hint
      }, 500);
    }

    console.log('Successfully inserted history entry:', data);
    return c.json({ data });
  } catch (error) {
    console.error('Error in add history endpoint:', error);
    return c.json({ error: String(error), stack: error instanceof Error ? error.stack : undefined }, 500);
  }
});

// Delete a history entry
app.delete("/make-server-913e994f/history/:id", async (c) => {
  try {
    const id = c.req.param('id');

    const { error } = await supabase
      .from('conversion_history')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting history:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error in delete history endpoint:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Catch-all 404 handler
app.notFound((c) => {
  console.error('404 - Route not found:', c.req.path, c.req.method);
  return c.json({ 
    error: 'Route not found', 
    path: c.req.path,
    method: c.req.method,
    availableRoutes: [
      'GET /make-server-913e994f/health',
      'GET /make-server-913e994f/favorites',
      'POST /make-server-913e994f/favorites',
      'DELETE /make-server-913e994f/favorites/:id',
      'GET /make-server-913e994f/history',
      'POST /make-server-913e994f/history',
      'DELETE /make-server-913e994f/history/:id'
    ]
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ 
    error: 'Internal server error', 
    message: err.message,
    stack: err.stack 
  }, 500);
});

Deno.serve(app.fetch);
