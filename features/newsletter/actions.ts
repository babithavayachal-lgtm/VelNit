"use server";

import { db, isDatabaseConfigured } from "@/lib/db";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation/schemas";
import type { ActionResult } from "@/features/beta/actions";

export async function subscribeToNewsletter(input: NewsletterInput): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }
  if (parsed.data.company) {
    return { success: true };
  }

  if (!isDatabaseConfigured) {
    console.warn("Neon is not configured - newsletter signup was not persisted.");
    return { success: true };
  }

  try {
    await db.query(
      `insert into newsletter_subscribers (email, source)
       values ($1, 'website')
       on conflict (email) do nothing`,
      [parsed.data.email],
    );
  } catch (error) {
    console.error("newsletter insert failed:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
