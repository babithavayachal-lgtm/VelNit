"use server";

import { revalidatePath } from "next/cache";
import { requireFounder } from "@/lib/auth/founder";
import {
  contentBriefSchema,
  contentIdeaSchema,
  type ContentBriefInput,
  type ContentIdeaInput,
} from "@/lib/validation/schemas";
import {
  createContentBrief,
  createContentIdea,
  getContentBrief,
} from "@/services/content-os";
import { generateAllFormatsForBrief, type GenerationOutcome } from "@/lib/ai/generate";
import type { ActionResult } from "@/features/beta/actions";

export async function createIdea(
  input: ContentIdeaInput
): Promise<ActionResult & { id?: string }> {
  const founder = await requireFounder();

  const parsed = contentIdeaSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid idea." };
  }

  const result = await createContentIdea({
    topic: parsed.data.topic,
    audience: parsed.data.audience,
    notes: parsed.data.notes || null,
    createdBy: founder.id,
  });

  if (result.error !== null) {
    return { success: false, error: result.error };
  }

  revalidatePath("/studio");
  return { success: true, id: result.data.id };
}

export async function createBrief(
  input: ContentBriefInput
): Promise<ActionResult & { id?: string }> {
  const founder = await requireFounder();

  const parsed = contentBriefSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid brief." };
  }

  const result = await createContentBrief({
    ideaId: parsed.data.ideaId,
    topic: parsed.data.topic,
    audience: parsed.data.audience,
    primaryEmotion: parsed.data.primaryEmotion,
    desiredOutcome: parsed.data.desiredOutcome,
    talkStage: parsed.data.talkStage,
    vrifPillars: parsed.data.vrifPillars,
    practicalAction: parsed.data.practicalAction,
    callToAction: parsed.data.callToAction,
    knowledgeReferenceIds: parsed.data.knowledgeReferenceIds,
    prohibitedClaims: parsed.data.prohibitedClaims || null,
    createdBy: founder.id,
  });

  if (result.error !== null) {
    return { success: false, error: result.error };
  }

  revalidatePath("/studio");
  revalidatePath("/studio/briefs");
  return { success: true, id: result.data.id };
}

export async function generateDraftsForBrief(
  briefId: string
): Promise<ActionResult & { outcomes?: GenerationOutcome[] }> {
  const founder = await requireFounder();

  const brief = await getContentBrief(briefId);
  if (!brief) {
    return { success: false, error: "Brief not found." };
  }

  const outcomes = await generateAllFormatsForBrief(brief, founder.id);

  revalidatePath(`/studio/briefs/${briefId}`);
  revalidatePath("/studio/review");

  const anyFailed = outcomes.some((o) => o.status === "failed");
  if (anyFailed && outcomes.every((o) => o.status === "failed")) {
    return {
      success: false,
      error: "All four formats failed to generate. Check the AI provider configuration.",
      outcomes,
    };
  }

  return { success: true, outcomes };
}
