import "server-only";
import { getAIProvider } from "./provider";
import { PROMPT_VERSION, buildSystemPromptForVersion, buildUserPrompt } from "./prompts/v1";
import { AIProviderError } from "./types";
import {
  getKnowledgeReferencesByIds,
  recordGenerationFailure,
  saveGeneratedContentItem,
  setContentBriefStatus,
} from "@/services/content-os";
import type { ContentBrief, ContentType } from "@/types/database";

const ALL_CONTENT_TYPES: ContentType[] = ["article", "facebook", "newsletter", "reel"];

export type GenerationOutcome = {
  contentType: ContentType;
  status: "saved" | "failed";
  error?: string;
};

/**
 * Generates all four draft formats for a brief and saves each one
 * independently - one format failing (a bad model response, a rate limit,
 * a network error) never blocks or rolls back the others. Every format
 * that fails gets its error recorded on its content_items row
 * (generation_error) so the founder can see exactly what happened per
 * format on the review screen, rather than a single opaque failure.
 */
export async function generateAllFormatsForBrief(
  brief: ContentBrief,
  founderId: string
): Promise<GenerationOutcome[]> {
  await setContentBriefStatus(brief.id, "generating");

  const knowledgeRefs = await getKnowledgeReferencesByIds(brief.knowledge_reference_ids);
  const provider = getAIProvider();
  const systemPrompt = buildSystemPromptForVersion();

  const outcomes: GenerationOutcome[] = [];

  for (const contentType of ALL_CONTENT_TYPES) {
    const userPrompt = buildUserPrompt(contentType, brief, knowledgeRefs);

    try {
      const draft = await provider.generateDraft({ contentType, systemPrompt, userPrompt });

      const saved = await saveGeneratedContentItem({
        briefId: brief.id,
        contentType,
        title: draft.title,
        body: draft.body,
        talkStage: brief.talk_stage,
        vrifPillars: brief.vrif_pillars,
        knowledgeReferenceIds: brief.knowledge_reference_ids,
        promptVersion: PROMPT_VERSION,
        createdBy: founderId,
      });

      if (saved.error) {
        outcomes.push({ contentType, status: "failed", error: saved.error });
      } else {
        outcomes.push({ contentType, status: "saved" });
      }
    } catch (err) {
      const message =
        err instanceof AIProviderError
          ? err.message
          : "Unexpected error while generating this draft.";
      console.error(`generateAllFormatsForBrief (${contentType}) failed:`, err);

      await recordGenerationFailure({
        briefId: brief.id,
        contentType,
        createdBy: founderId,
        errorMessage: message,
        promptVersion: PROMPT_VERSION,
      });

      outcomes.push({ contentType, status: "failed", error: message });
    }
  }

  const anySaved = outcomes.some((o) => o.status === "saved");
  await setContentBriefStatus(brief.id, anySaved ? "draft" : "needs_revision");

  return outcomes;
}
