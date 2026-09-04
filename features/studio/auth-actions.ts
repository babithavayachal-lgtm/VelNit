"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function signOutFounder(): Promise<void> {
  await auth.api.signOut({ headers: await headers() });
  redirect("/studio/login");
}
