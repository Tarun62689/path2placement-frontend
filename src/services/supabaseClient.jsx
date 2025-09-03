// src/services/supabaseClient.js (or .jsx)
import { createClient } from "@supabase/supabase-js";

// Vite prefixes all env vars with VITE_*
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
