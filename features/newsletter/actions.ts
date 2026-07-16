"use server";

import { createClient } from "@/lib/supabase/server";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation/schemas";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ActionResult } from "@/features/beta/actions";

export async function subscribeToNewsletter(input: NewsletterInput): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }
  if (parsed.data.company) {
    return { success: true };
  }

  if (!isSupabaseConfigured) {
    console.warn("Supabase is not configured - newsletter signup was not persisted.");
    return { success: true };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: parsed.data.email,
    source: "website",
  });

  if (error && error.code !== "23505") {
    console.error("newsletter insert failed:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
