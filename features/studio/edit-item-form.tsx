"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { contentItemEditSchema, type ContentItemEditInput } from "@/lib/validation/schemas";
import { editContentItem } from "./review-actions";

export function EditItemForm({
  contentItemId,
  title,
  body,
}: {
  contentItemId: string;
  title: string;
  body: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const { register, handleSubmit, reset } = useForm<ContentItemEditInput>({
    resolver: zodResolver(contentItemEditSchema),
    defaultValues: { contentItemId, title, body, revisionSummary: "" },
  });

  async function onSubmit(data: ContentItemEditInput) {
    setSubmitting(true);
    setError(null);
    setSaved(false);
    const result = await editContentItem(data);
    setSubmitting(false);
    if (result.success) {
      setSaved(true);
      reset({ ...data, revisionSummary: "" });
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("contentItemId")} />
      <div>
        <Label htmlFor="edit-title">Title</Label>
        <Input id="edit-title" className="mt-2" {...register("title")} />
      </div>
      <div>
        <Label htmlFor="edit-body">Body</Label>
        <Textarea id="edit-body" className="mt-2 min-h-64" {...register("body")} />
      </div>
      <div>
        <Label htmlFor="revision-summary">What changed and why (optional)</Label>
        <Textarea
          id="revision-summary"
          className="mt-2"
          placeholder="e.g. Removed an invented anecdote, softened an absolute claim, replaced the demanding question with a gentler prompt."
          {...register("revisionSummary")}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Saved alongside the current version in its version history, so future readers can see
          exactly what changed between versions.
        </p>
      </div>
      <Button type="submit" variant="outline" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Save as new version
      </Button>
      {saved && <p className="text-sm text-primary">Saved - the previous version is preserved in the version history below.</p>}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
