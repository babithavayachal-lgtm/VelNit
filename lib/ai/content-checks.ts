/**
 * Automated, rule-based content checks (Phase B extension). These run
 * against generated or revised drafts and flag patterns a founder should
 * look at before approving - they do not block anything themselves, and
 * they are deliberately simple pattern matches, not another AI call, so
 * they run instantly and for free on every save.
 *
 * Five categories, matching the VelNit editorial corrections these were
 * built to catch:
 *   1. Invented anecdotes/testimonials not from verified source material.
 *   2. Unsupported research or psychological claims that need a citation.
 *   3. Absolute psychological claims that don't allow for couples
 *      experiencing a transition differently.
 *   4. Off-brand language (Writing DNA Section 5, plus specific banned
 *      phrases).
 *   5. Questions that are too emotionally demanding for a low-stakes
 *      exercise.
 */

export type ContentCheckCategory =
  | "invented_anecdote"
  | "unsupported_research_claim"
  | "absolute_psychological_claim"
  | "off_brand_language"
  | "emotionally_demanding_question";

export type ContentCheckFlag = {
  category: ContentCheckCategory;
  categoryLabel: string;
  guidance: string;
  matchedText: string;
};

type Rule = {
  category: ContentCheckCategory;
  categoryLabel: string;
  guidance: string;
  pattern: RegExp;
};

const RULES: Rule[] = [
  // ------------------------------------------------------------
  // 1. Invented anecdotes / testimonials
  // ------------------------------------------------------------
  {
    category: "invented_anecdote",
    categoryLabel: "Invented anecdote or testimonial",
    guidance:
      "Remove or replace unless this comes from verified source material - do not present an invented story as a real member/customer account.",
    pattern:
      /\b(one couple we know|couples who write to us|one woman told us|one man told us|a client told us|a member (told|shared|wrote) us|we('ve| have) heard from|someone once told us|a (reader|listener|user) (told|wrote|shared)|one (man|woman|husband|wife|father|mother) (told|said|shared) us|a couple (told|shared|said) us)\b/gi,
  },
  // ------------------------------------------------------------
  // 2. Unsupported research / psychological claims
  // ------------------------------------------------------------
  {
    category: "unsupported_research_claim",
    categoryLabel: "Unsupported research claim",
    guidance:
      "Attach a credible, approved source, or rewrite as a careful observation rather than presenting it as established research.",
    pattern:
      /\b(research shows?|studies (show|have shown|find|found)|psychologists (say|agree|believe)|science (says|shows)|experts (say|agree|believe)|data shows?|statistics show)\b/gi,
  },
  // ------------------------------------------------------------
  // 3. Absolute psychological claims
  // ------------------------------------------------------------
  {
    category: "absolute_psychological_claim",
    categoryLabel: "Absolute psychological claim",
    guidance:
      "Replace with language that recognises couples experience this differently - avoid presenting one outcome as universal or certain.",
    pattern:
      /\b(this is what happened|the conversation vanished|every couple|all couples|without exception|will definitely|always happens|never works|always leads to|never leads to)\b/gi,
  },
  // ------------------------------------------------------------
  // 4. Off-brand language
  // ------------------------------------------------------------
  {
    category: "off_brand_language",
    categoryLabel: "Off-brand language",
    guidance:
      "Rewrite in VelNit's calm, warm, respectful voice - avoid casual dismissiveness and academic jargon (Writing DNA, Sections 1 and 5).",
    pattern:
      /\b(stupidly simple|emotional[- ]register (talking|conversation|communication)|victim|broken|helpless)\b/gi,
  },
  // ------------------------------------------------------------
  // 5. Emotionally demanding questions for a low-stakes exercise
  // ------------------------------------------------------------
  {
    category: "emotionally_demanding_question",
    categoryLabel: "Emotionally demanding question",
    guidance:
      "Replace with a gentler, low-pressure prompt (e.g. \"What was one small moment you enjoyed today?\") - this exercise should never feel like an interrogation.",
    pattern:
      /(is there something on your mind i should know about\??|what('s| is) (really |actually )?wrong\??|what('s| is) bothering you\??|what are you (hiding|not telling me)\??|\bconfess\b|\badmit\b)/gi,
  },
];

/**
 * Scans a piece of generated or revised content and returns one flag per
 * distinct match. Matching is intentionally simple (regex, case
 * insensitive) - false positives are expected and fine, since these are
 * prompts for a human founder to look at, not an automatic block.
 */
export function runContentChecks(text: string): ContentCheckFlag[] {
  const flags: ContentCheckFlag[] = [];

  for (const rule of RULES) {
    const matches = text.matchAll(rule.pattern);
    const seen = new Set<string>();
    for (const match of matches) {
      const matchedText = match[0];
      const key = matchedText.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      flags.push({
        category: rule.category,
        categoryLabel: rule.categoryLabel,
        guidance: rule.guidance,
        matchedText,
      });
    }
  }

  return flags;
}
