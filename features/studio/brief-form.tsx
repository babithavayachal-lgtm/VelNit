"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { contentBriefSchema } from "@/lib/validation/schemas";
import { createBrief } from "./content-actions";
import type { KnowledgeReference } from "@/types/database";

type BriefFormValues = {
  topic: string;
  audience: string;
  primaryEmotion: string;
  desiredOutcome: string;
  talkStage: string;
  vrifPillarsRaw: string;
  practicalAction: string;
  callToAction: string;
  knowledgeReferenceIds: string[];
  prohibitedClaims: string;
};

export function BriefForm({
  ideaId,
  defaultTopic,
  defaultAudience,
  knowledgeRefs,
}: {
  ideaId: string;
  defaultTopic: string;
  defaultAudience: string;
  knowledgeRefs: KnowledgeReference[];
}) {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
  } = useForm<BriefFormValues>({
    defaultValues: {
      topic: defaultTopic,
      audience: defaultAudience,
      knowledgeReferenceIds: [],
    },
  });

  async function onSubmit(data: BriefFormValues) {
    setServerError(null);

    const payload = {
      ideaId,
      topic: data.topic,
      audience: data.audience,
      primaryEmotion: data.primaryEmotion,
      desiredOutcome: data.desiredOutcome,
      talkStage: data.talkStage,
      vrifPillars: data.vrifPillarsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      practicalAction: data.practicalAction,
      callToAction: data.callToAction,
      knowledgeReferenceIds: data.knowledgeReferenceIds ?? [],
      prohibitedClaims: data.prohibitedClaims,
    };

    const parsed = contentBriefSchema.safeParse(payload);
    if (!parsed.success) {
      setServerError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    setSubmitting(true);
    const result = await createBrief(parsed.data);
    setSubmitting(false);

    if (result.success && result.id) {
      router.push(`/studio/briefs/${result.id}`);
    } else if (!result.success) {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <Label htmlFor="topic">Topic</Label>
        <Input id="topic" className="mt-2" {...register("topic", { required: true })} />
      </div>
      <div>
        <Label htmlFor="audience">Audience</Label>
        <Input id="audience" className="mt-2" {...register("audience", { required: true })} />
      </div>
      <div>
        <Label htmlFor="primaryEmotion">Primary emotion</Label>
        <Input
          id="primaryEmotion"
          className="mt-2"
          placeholder="e.g. Quiet grief and disconnection"
          {...register("primaryEmotion", { required: true })}
        />
      </div>
      <div>
        <Label htmlFor="desiredOutcome">Desired outcome</Label>
        <Textarea
          id="desiredOutcome"
          className="mt-2"
          {...register("desiredOutcome", { required: true })}
        />
      </div>
      <div>
        <Label htmlFor="talkStage">TALK stage</Label>
        <Input
          id="talkStage"
          className="mt-2"
          placeholder="e.g. Target the Silence"
          {...register("talkStage", { required: true })}
        />
      </div>
      <div>
        <Label htmlFor="vrifPillarsRaw">VRIF pillars (comma-separated)</Label>
        <Input
          id="vrifPillarsRaw"
          className="mt-2"
          placeholder="e.g. Presence, Attunement"
          {...register("vrifPillarsRaw", { required: true })}
        />
      </div>
      <div>
        <Label htmlFor="practicalAction">Practical action</Label>
        <Input
          id="practicalAction"
          className="mt-2"
          placeholder="e.g. The five-minute coffee ritual"
          {...register("practicalAction", { required: true })}
        />
      </div>
      <div>
        <Label htmlFor="callToAction">Call to action</Label>
        <Input id="callToAction" className="mt-2" {...register("callToAction", { required: true })} />
      </div>
      <div>
        <Label htmlFor="prohibitedClaims">Prohibited claims or language (optional)</Label>
        <Textarea id="prohibitedClaims" className="mt-2" {...register("prohibitedClaims")} />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-foreground">Knowledge references</legend>
        <div className="mt-2 max-h-48 space-y-2 overflow-y-auto rounded-xl border border-border p-3">
          {knowledgeRefs.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No knowledge references seeded yet.
            </p>
          )}
          {knowledgeRefs.map((ref) => (
            <label key={ref.id} className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                value={ref.id}
                className="mt-1"
                {...register("knowledgeReferenceIds")}
              />
              <span>
                <span className="font-medium">{ref.concept}</span>{" "}
                <span className="text-muted-foreground">
                  ({ref.source_document}
                  {ref.section ? ` / ${ref.section}` : ""})
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Button type="submit" variant="cta" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Save brief
      </Button>
      {serverError && (
        <p role="alert" className="text-sm text-destructive">
          {serverError}
        </p>
      )}
    </form>
  );
}
