"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateDraftsForBrief } from "./content-actions";
import type { GenerationOutcome } from "@/lib/ai/generate";

const LABELS: Record<string, string> = {
  article: "Website article",
  facebook: "Facebook post",
  newsletter: "Newsletter",
  reel: "Reel script",
};

export function GenerateButton({ briefId }: { briefId: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [outcomes, setOutcomes] = React.useState<GenerationOutcome[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);
    setOutcomes(null);

    const result = await generateDraftsForBrief(briefId);
    setPending(false);

    if (result.outcomes) setOutcomes(result.outcomes);
    if (!result.success) setError(result.error);
    router.refresh();
  }

  return (
    <div>
      <Button type="button" variant="cta" onClick={handleClick} disabled={pending}>
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Sparkles className="h-4 w-4" aria-hidden />
        )}
        Generate 4 drafts
      </Button>

      {outcomes && (
        <ul className="mt-3 space-y-1 text-sm">
          {outcomes.map((o) => (
            <li key={o.contentType} className={o.status === "failed" ? "text-destructive" : "text-muted-foreground"}>
              {LABELS[o.contentType] ?? o.contentType}: {o.status === "saved" ? "saved as draft" : `failed - ${o.error}`}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
