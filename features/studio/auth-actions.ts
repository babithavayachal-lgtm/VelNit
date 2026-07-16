"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { loginSchema, type LoginInput } from "@/lib/validation/schemas";
import type { ActionResult } from "@/features/beta/actions";

export async function signIn(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: "Supabase is not configured. Add the env vars in .env.local first.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { success: false, error: "Invalid email or password." };
  }

  const { data: founder } = await supabase
    .from("founders")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!founder) {
    // Valid Supabase Auth credentials, but not on the founders allowlist.
    // Sign them back out so no session lingers for a non-founder account.
    await supabase.auth.signOut();
    return {
      success: false,
      error:
        "This account isn't authorized for the VelNit Studio. Ask a founder to add you.",
    };
  }

  return { success: true };
}

export async function signOutFounder(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/studio/login");
}
