"use server";

import { db, isDatabaseConfigured } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { contactSchema, type ContactInput } from "@/lib/validation/schemas";
import { siteConfig } from "@/lib/constants/site";
import type { ActionResult } from "@/features/beta/actions";

export async function submitContactMessage(input: ContactInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }
  if (parsed.data.company) {
    return { success: true };
  }

  if (!isDatabaseConfigured) {
    console.warn("Neon is not configured - contact message was not persisted.");
    return { success: true };
  }

  try {
    await db.query(
      `insert into contact_messages (name, email, subject, message)
       values ($1, $2, $3, $4)`,
      [parsed.data.name, parsed.data.email, parsed.data.subject || null, parsed.data.message],
    );
  } catch (error) {
    console.error("contact message insert failed:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  await sendTransactionalEmail({
    to: siteConfig.contactEmail,
    subject: `New contact form message${parsed.data.subject ? `: ${parsed.data.subject}` : ""}`,
    html: `<p><strong>${parsed.data.name}</strong> (${parsed.data.email}) wrote:</p><p>${parsed.data.message}</p>`,
  });

  return { success: true };
}
