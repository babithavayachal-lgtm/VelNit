"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "./review-actions";

export function ReviewForm({ contentItemId }: { contentItemId: string }) {
  const router = useRouter();
  const [decision, setDecision] = React.useState<"approved" | "needs_revision">("approved");
  const [score, setScore] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await submitReview({
      contentItemId,
      decision,
      score: score ? Number(score) : undefined,
      notes,
    });

    setSubmitting(false);
    if (result.success) {
      setNotes("");
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="decision">Decision</Label>
        <select
          id="decision"
          value={decision}
          onChange={(e) => setDecision(e.target.value as "approved" | "needs_revision")}
          className="mt-2 flex h-12 w-full rounded-xl border border-input bg-background px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="approved">Approve</option>
          <option value="needs_revision">Request revision</option>
        </select>
      </div>
      <div>
        <Label htmlFor="score">Score (1-10, optional)</Label>
        <Input
          id="score"
          type="number"
          min={1}
          max={10}
          className="mt-2"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="notes">Review notes</Label>
        <Textarea
          id="notes"
          className="mt-2"
          placeholder="What needs to change, or why this is approved."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <Button type="submit" variant={decision === "approved" ? "cta" : "outline"} disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {decision === "approved" ? "Approve draft" : "Send back for revision"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
