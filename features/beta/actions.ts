"use server";

import { createClient } from "@/lib/supabase/server";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { betaSignupSchema, type BetaSignupInput } from "@/lib/validation/schemas";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type ActionResult = { success: true } | { success: false; error: string };

export async function submitBetaSignup(input: BetaSignupInput): Promise<ActionResult> {
  const parsed = betaSignupSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }
  if (parsed.data.company) {
    // Honeypot tripped - pretend success so bots don't learn anything.
    return { success: true };
  }

  if (!isSupabaseConfigured) {
    console.warn("Supabase is not configured - beta signup was not persisted.");
    return { success: true };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("beta_signups").insert({
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    role: parsed.data.role,
    reason: parsed.data.reason || null,
    source: "website",
  });

  if (error) {
    if (error.code === "23505") {
      return { success: true }; // already registered - treat as success
    }
    console.error("beta signup insert failed:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  await sendTransactionalEmail({
    to: parsed.data.email,
    subject: "You're on the VelNit Life beta list",
    html: `<p>Hi ${parsed.data.fullName},</p><p>Thank you for joining the VelNit Life beta. We'll be in touch soon with next steps.</p><p>With warmth,<br/>The VelNit Life team</p>`,
  });

  return { success: true };
}
