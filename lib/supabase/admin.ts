import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { supabaseSecretKey, supabaseUrl } from "./env";

/**
 * Privileged server-only client using the secret/service-role key.
 * NEVER import this from a Client Component - the `server-only` package
 * will throw a build error if you try.
 */
export function createAdminClient() {
  if (!supabaseSecretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) is not set. Admin client is unavailable."
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseSecretKey, {
    auth: { persistSession: false },
  });
}
