import {
  KNOWLEDGE_GRAPH_MD,
  TALK_MD,
  VRIF_MD,
  WRITING_DNA_MD,
} from "@/lib/ai/brain-content.generated";
import { REVIEW_CHECKLIST } from "@/lib/ai/review-checklist";
import type { ContentBrief, ContentType, KnowledgeReference } from "@/types/database";

/**
 * Bump this whenever the system prompt, format instructions, or brain
 * documents materially change what the model is asked to do. Every
 * generated content_items row stores the prompt_version it was produced
 * with (see services/content-os.ts), so past drafts stay attributable to
 * the exact prompt that made them even after this file moves on to v2.
 */
export const PROMPT_VERSION = "content-os-v1";

function buildSystemPrompt(): string {
  return `You are the VelNit Brain: the writing intelligence behind VelNit Life, an AI-powered Relationship Intelligence platform for couples and families navigating life's second chapter (empty nest, retirement, caregiving).

You do not write like a generic AI assistant. You write exclusively in the VelNit voice, grounded in the four documents below. Read them fully before writing anything - they are not background color, they are the specification.

=== DOCUMENT: VelNit Relationship Intelligence Framework (VRIF) ===
${VRIF_MD}

=== DOCUMENT: The TALK Model ===
${TALK_MD}

=== DOCUMENT: VelNit Writing DNA ===
${WRITING_DNA_MD}

=== DOCUMENT: VelNit Knowledge Graph ===
${KNOWLEDGE_GRAPH_MD}

=== YOUR JOB ===
You will be given a content brief (topic, audience, primary emotion, desired outcome, TALK stage, VRIF pillars, a practical action, a call to action, prohibited claims, and relevant knowledge references) and asked to produce one specific content format from it.

Before you write, silently check your draft against every item on this list - it is exactly what a human founder will use to review your work, so a draft that fails any of these will be sent back for revision:
${REVIEW_CHECKLIST.map((item, i) => `${i + 1}. ${item.label} - ${item.description}`).join("\n")}

=== OUTPUT FORMAT ===
Respond with a single JSON object and nothing else - no markdown code fences, no commentary before or after. The object must have exactly two string fields:
{"title": "...", "body": "..."}

"body" may contain markdown (paragraphs, occasional bold/italic) where natural for the format, but never headings that look like a template ("Introduction", "Conclusion") - VelNit writing reads like one continuous, human piece.`;
}

type FormatSpec = { label: string; instructions: string };

const FORMAT_SPECS: Record<ContentType, FormatSpec> = {
  article: {
    label: "Long-form website article",
    instructions: `Write a long-form website article of roughly 700-1000 words, following the Storytelling Formula exactly: Opening -> Story -> Research -> Reflection -> Practical Exercise -> Question -> CTA (Writing DNA Section 4). It must include all five elements of the Article Blueprint (Section 8): a story, a lesson, one practical exercise, one reflection question, a gentle CTA. Follow the Emotional Journey arc (Section 3) in order: Recognition, Empathy, Insight, Hope, Action, Reflection. The practical exercise should be the brief's practical action, presented as something the reader can try today.`,
  },
  facebook: {
    label: "Facebook post",
    instructions: `Write a Facebook post following Writing DNA Section 9 (Facebook DNA): one Recognition-stage sentence, one short story or observation, and a closing question that invites discussion rather than applause - no more than four or five sentences total before the question. Warm, kitchen-table tone, not a link-bait headline. No hashtags.`,
  },
  newsletter: {
    label: "Email newsletter",
    instructions: `Write an email newsletter entry of roughly 250-400 words. Open with a warm, personal greeting-style line, tell one short story or observation, offer one piece of insight translated into human language (Writing DNA Section 7), include the brief's practical action as a concrete thing to try this week, and close with the brief's call to action plus a warm sign-off in the voice of "The VelNit Life team." The "title" field should read like an email subject line: short, warm, curiosity-driven, never clickbait.`,
  },
  reel: {
    label: "45-60 second reel script",
    instructions: `Write a spoken video script for a 45-60 second reel (roughly 110-150 spoken words at a natural pace). Structure it as a hook in the first 3 seconds (Recognition), a brief relatable moment (Empathy/Insight), the practical action clearly named (Action), and a closing question or CTA (Reflection/CTA). Write it as spoken lines a presenter would actually say out loud, with bracketed [on-screen text] or [visual] cues where helpful, but keep the spoken narration as the primary content of "body".`,
  },
};

function formatKnowledgeReferences(refs: KnowledgeReference[]): string {
  if (refs.length === 0) {
    return "(No specific knowledge references were attached to this brief - draw generally from the four documents above.)";
  }
  return refs
    .map(
      (ref) =>
        `- [${ref.source_document}${ref.section ? ` / ${ref.section}` : ""}] ${ref.concept}: ${ref.summary}`
    )
    .join("\n");
}

export function buildUserPrompt(
  contentType: ContentType,
  brief: ContentBrief,
  knowledgeRefs: KnowledgeReference[]
): string {
  const spec = FORMAT_SPECS[contentType];

  return `=== CONTENT BRIEF ===
Topic: ${brief.topic}
Audience: ${brief.audience}
Primary emotion: ${brief.primary_emotion}
Desired outcome: ${brief.desired_outcome}
TALK stage: ${brief.talk_stage}
VRIF pillars: ${brief.vrif_pillars.join(", ")}
Practical action: ${brief.practical_action}
Call to action: ${brief.call_to_action}
Prohibited claims or language: ${brief.prohibited_claims || "(none specified - still apply the Writing DNA vocabulary rules, Section 5)"}

Relevant knowledge references:
${formatKnowledgeReferences(knowledgeRefs)}

=== FORMAT TO PRODUCE: ${spec.label} ===
${spec.instructions}

Now write it, and respond with the JSON object described in your instructions - nothing else.`;
}

export function buildSystemPromptForVersion(): string {
  return buildSystemPrompt();
}
