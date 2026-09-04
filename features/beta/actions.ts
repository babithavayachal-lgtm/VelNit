"use server";

import { db, isDatabaseConfigured } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { betaSignupSchema, type BetaSignupInput } from "@/lib/validation/schemas";

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

  if (!isDatabaseConfigured) {
    console.warn("Neon is not configured - beta signup was not persisted.");
    return { success: true };
  }

  try {
    await db.query(
      `insert into beta_signups (full_name, email, role, reason, source)
       values ($1, $2, $3, $4, 'website')`,
      [parsed.data.fullName, parsed.data.email, parsed.data.role, parsed.data.reason || null],
    );
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
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
