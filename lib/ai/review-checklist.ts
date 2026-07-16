/**
 * The founder's review checklist (Phase B spec) - the exact ten criteria
 * every generated draft is checked against, both by the model itself
 * (embedded in the system prompt, see lib/ai/prompts/v1.ts) and by the
 * founder on the review screen (app/studio/review).
 */
export type ReviewChecklistItem = {
  key: string;
  label: string;
  description: string;
};

export const REVIEW_CHECKLIST: ReviewChecklistItem[] = [
  {
    key: "voice",
    label: "VelNit voice consistency",
    description: "Calm, warm, hopeful, reflective, respectful, practical - never preachy, dramatic, or fear-based (Writing DNA, Section 1).",
  },
  {
    key: "hopefulness",
    label: "Hopefulness",
    description: "The reader should feel more capable after reading, not more discouraged.",
  },
  {
    key: "talk_accuracy",
    label: "TALK accuracy",
    description: "The named TALK stage/letter and its exercises are represented correctly, not invented or blended incorrectly.",
  },
  {
    key: "vrif_alignment",
    label: "VRIF alignment",
    description: "The content genuinely serves the VRIF pillar(s) named in the brief.",
  },
  {
    key: "practical_usefulness",
    label: "Practical usefulness",
    description: "The practical action is concrete and doable today, not abstract advice.",
  },
  {
    key: "factual_support",
    label: "Factual support",
    description: "Any research reference is accurate, translated into human language, and used to reassure rather than to impress (Writing DNA, Section 7).",
  },
  {
    key: "respect_and_dignity",
    label: "Respect and dignity",
    description: "The piece respects every stage of life and protects the dignity of older adults (Editorial Charter).",
  },
  {
    key: "absence_of_blame",
    label: "Absence of blame or fear",
    description: "No shaming language, no manufactured urgency, no crisis framing.",
  },
  {
    key: "clear_cta",
    label: "Clear human-centred call to action",
    description: "Exactly one clear, specific, non-salesy next step, matching the brief's call to action.",
  },
  {
    key: "ai_supports_connection",
    label: "AI supports connection rather than replacing it",
    description: "The piece points the reader back toward their own relationship, never positions AI as a substitute for it (VRIF, Section 8, Principle 1).",
  },
];
