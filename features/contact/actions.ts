"use server";

import { createClient } from "@/lib/supabase/server";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { contactSchema, type ContactInput } from "@/lib/validation/schemas";
import { isSupabaseConfigured } from "@/lib/supabase/env";
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

  if (!isSupabaseConfigured) {
    console.warn("Supabase is not configured - contact message was not persisted.");
    return { success: true };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject || null,
    message: parsed.data.message,
  });

  if (error) {
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
