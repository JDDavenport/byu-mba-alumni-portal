import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Check whether Supabase environment variables are configured.
 * When they're missing (local dev without Supabase, or Vercel preview without secrets),
 * all data-fetching code should fall back to the static dummy dataset.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Browser-side Supabase client (singleton).
 * Returns null if env vars are not set — callers must handle the fallback.
 */
let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!browserClient) {
    browserClient = createClient(supabaseUrl!, supabaseAnonKey!);
  }
  return browserClient;
}

/**
 * Server-side Supabase client — creates a fresh instance per request.
 * Use this in API routes, server components, and server actions.
 * Returns null if env vars are not set.
 */
export function getSupabaseServer(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createClient(supabaseUrl!, supabaseAnonKey!);
}

/**
 * Convenience alias used by the existing API route — delegates to server client.
 */
export function getSupabase(): SupabaseClient | null {
  return getSupabaseServer();
}
