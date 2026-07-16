import type { Metadata } from "next";
import { LoginForm } from "@/features/studio/login-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Studio sign in - VelNit Life",
  robots: { index: false, follow: false },
};

const errorMessages: Record<string, string> = {
  "not-authorized":
    "You're signed out, or your account isn't on the founder allowlist yet.",
  "not-configured": "Supabase is not configured for this environment.",
};

export default async function StudioLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirectTo && params.redirectTo.startsWith("/studio")
    ? params.redirectTo
    : "/studio";
  const banner = params.error ? errorMessages[params.error] : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>VelNit Studio</CardTitle>
          <CardDescription>
            Founder-only workspace. Not part of the public VelNit Life site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {banner && (
            <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {banner}
            </p>
          )}
          <LoginForm redirectTo={redirectTo} />
        </CardContent>
      </Card>
    </div>
  );
}
