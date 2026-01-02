import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://galflslivntdeuqzsqbq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhbGZmc2xpdm50ZGV1cXpzcWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjY1NjEsImV4cCI6MjA4Mjk0MjU2MX0.E98bZooFNRb6CRAvgpeTOsLLi8AkMs-fGQ2yRHDpkMU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
