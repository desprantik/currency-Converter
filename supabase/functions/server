import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

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
    const { from_amount, from_currency, to_amount, to_currency, rate, description, timestamp } = body;

    const { data, error } = await supabase
      .from('conversion_history')
      .insert([{
        from_amount,
        from_currency,
        to_amount,
        to_currency,
        rate,
        description,
        timestamp,
      }])
      .select();

    if (error) {
      console.error('Error adding history:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ data });
  } catch (error) {
    console.error('Error in add history endpoint:', error);
    return c.json({ error: String(error) }, 500);
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

Deno.serve(app.fetch);
