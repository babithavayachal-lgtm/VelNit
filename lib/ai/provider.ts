import "server-only";
import { aiProviderName } from "./env";
import { AnthropicProvider } from "./providers/anthropic";
import type { AIProvider } from "./types";

/**
 * Factory for the configured AI provider. This is the one place that
 * knows about concrete vendor implementations - everything else in the
 * app (the generation orchestrator, server actions) imports the
 * `AIProvider` interface from ./types and calls getAIProvider(), so
 * adding a second vendor (or switching the default) never touches
 * calling code.
 */
export function getAIProvider(): AIProvider {
  switch (aiProviderName) {
    case "anthropic":
      return new AnthropicProvider();
    default:
      throw new Error(`Unknown AI_PROVIDER "${aiProviderName}".`);
  }
}
