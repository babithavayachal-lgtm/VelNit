import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import type { Founder } from "@/types/database";

/**
 * Returns the signed-in founder's row, or null if there is no session, or
 * the signed-in user exists in Better Auth but is not included in the
 * `FOUNDER_EMAILS` allowlist. A valid account alone is never
 * enough to reach the Content OS workspace - see docs/SUPABASE_SETUP.md
 * for how to provision a founder.
 */
export async function getFounder(): Promise<Founder | null> {
  if (!isDatabaseConfigured) return null;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.email) return null;

  const allowed = (process.env.FOUNDER_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  if (!allowed.includes(session.user.email.toLowerCase())) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    full_name: session.user.name || null,
    created_at: session.user.createdAt.toISOString(),
  };
}

/**
 * Server-side guard for every /studio page and server action. Redirects to
 * the founder login screen (with a reason) rather than throwing, so a
 * signed-out or non-founder visitor always lands somewhere useful.
 */
export async function requireFounder(): Promise<Founder> {
  if (!isDatabaseConfigured) {
    redirect("/studio/login?error=not-configured");
  }

  const founder = await getFounder();

  if (!founder) {
    redirect("/studio/login?error=not-authorized");
  }

  return founder;
}
