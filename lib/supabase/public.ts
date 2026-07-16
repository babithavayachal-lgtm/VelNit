import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Stateless, cookie-free Supabase client for public, read-only content
 * (blog posts, categories, tags). Safe to call from statically generated
 * pages and ISR revalidation, unlike the cookie-bound SSR client.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false },
  });
}
