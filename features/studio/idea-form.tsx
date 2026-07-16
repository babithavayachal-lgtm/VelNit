"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { contentIdeaSchema, type ContentIdeaInput } from "@/lib/validation/schemas";
import { createIdea } from "./content-actions";

export function IdeaForm() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContentIdeaInput>({ resolver: zodResolver(contentIdeaSchema) });

  async function onSubmit(data: ContentIdeaInput) {
    setSubmitting(true);
    setServerError(null);
    const result = await createIdea(data);
    setSubmitting(false);
    if (result.success && result.id) {
      reset();
      router.push(`/studio/ideas/${result.id}`);
    } else if (!result.success) {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <Label htmlFor="topic">Topic</Label>
        <Input id="topic" className="mt-2" {...register("topic")} />
        {errors.topic && <p className="mt-1 text-xs text-destructive">{errors.topic.message}</p>}
      </div>
      <div>
        <Label htmlFor="audience">Audience</Label>
        <Input id="audience" className="mt-2" {...register("audience")} />
        {errors.audience && (
          <p className="mt-1 text-xs text-destructive">{errors.audience.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" className="mt-2" {...register("notes")} />
      </div>
      <Button type="submit" variant="cta" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Save idea
      </Button>
      {serverError && (
        <p role="alert" className="text-sm text-destructive">
          {serverError}
        </p>
      )}
    </form>
  );
}
