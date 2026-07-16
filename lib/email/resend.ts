import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const isEmailConfigured = Boolean(apiKey);

let client: Resend | null = null;
if (apiKey) {
  client = new Resend(apiKey);
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "VelNit Life <hello@velnit.life>";

/**
 * Best-effort transactional email. Never throws - a missing/invalid Resend
 * config should never block a form submission from succeeding, since the
 * Supabase row is the source of truth.
 */
export async function sendTransactionalEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!client) return { sent: false, reason: "Resend not configured" };

  try {
    await client.emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    return { sent: true };
  } catch (error) {
    console.error("Resend email failed:", error);
    return { sent: false, reason: "send-failed" };
  }
}
