/**
 * AI provider configuration. Mirrors the graceful-degradation pattern used
 * by lib/supabase/env.ts and lib/email/resend.ts: the app builds and runs
 * fine with none of this set, and generation calls fail loudly (logged +
 * surfaced to the founder) rather than the app crashing at startup.
 */
export const aiProviderName = process.env.AI_PROVIDER ?? "anthropic";

export const anthropicApiKey = process.env.ANTHROPIC_API_KEY ?? "";

// Deliberately no hardcoded fallback model string - model availability and
// naming changes over time and depends on the founder's own Anthropic
// account access, so this must be set explicitly rather than guessed.
export const anthropicModel = process.env.ANTHROPIC_MODEL ?? "";

export const isAIProviderConfigured = Boolean(anthropicApiKey && anthropicModel);
