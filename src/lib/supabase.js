import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// The holding page still renders safely if the environment is not configured.
// Only the isolated Street Trading Co. table is queried by the client.
export const supabase = url && publishableKey
  ? createClient(url, publishableKey)
  : null;
