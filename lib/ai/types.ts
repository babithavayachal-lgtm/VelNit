import type { ContentType } from "@/types/database";

export interface DraftGenerationRequest {
  contentType: ContentType;
  systemPrompt: string;
  userPrompt: string;
}

export interface DraftGenerationResult {
  title: string;
  body: string;
}

/**
 * Service abstraction over whatever LLM actually produces a draft. Server
 * actions and the generation orchestrator (lib/ai/generate.ts) only ever
 * talk to this interface, never to a specific vendor SDK - swapping
 * providers (or adding a second one) means adding a new file in
 * lib/ai/providers/ and one line in lib/ai/provider.ts, nothing else.
 */
export interface AIProvider {
  readonly name: string;
  generateDraft(request: DraftGenerationRequest): Promise<DraftGenerationResult>;
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}
