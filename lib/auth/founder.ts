import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Founder } from "@/types/database";

/**
 * Returns the signed-in founder's row, or null if there is no session, or
 * the signed-in user exists in Supabase Auth but has not been added to the
 * `founders` allowlist table. A real Supabase Auth account alone is never
 * enough to reach the Content OS workspace - see docs/SUPABASE_SETUP.md
 * for how to provision a founder.
 */
export async function getFounder(): Promise<Founder | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: founder } = await supabase
    .from("founders")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return founder;
}

/**
 * Server-side guard for every /studio page and server action. Redirects to
 * the founder login screen (with a reason) rather than throwing, so a
 * signed-out or non-founder visitor always lands somewhere useful.
 */
export async function requireFounder(): Promise<Founder> {
  if (!isSupabaseConfigured) {
    redirect("/studio/login?error=not-configured");
  }

  const founder = await getFounder();

  if (!founder) {
    redirect("/studio/login?error=not-authorized");
  }

  return founder;
}
