"use client";

import * as React from "react";
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function signInWithGitHub() {
    setSubmitting(true);
    setError(null);
    const result = await authClient.signIn.social({ provider: "github", callbackURL: redirectTo });
    if (result.error) {
      setError(result.error.message ?? "Could not start GitHub sign-in.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Button type="button" variant="cta" size="lg" className="w-full" onClick={signInWithGitHub} disabled={submitting}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Github className="h-4 w-4" aria-hidden />}
        Continue with GitHub
      </Button>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
