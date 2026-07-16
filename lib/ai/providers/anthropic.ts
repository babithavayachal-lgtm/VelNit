import "server-only";
import { anthropicApiKey, anthropicModel } from "../env";
import { AIProviderError, type AIProvider, type DraftGenerationRequest, type DraftGenerationResult } from "../types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const MAX_TOKENS = 4096;

/**
 * Extracts the first balanced top-level JSON object from a string. The
 * model is instructed to respond with JSON only, but defensively strips
 * any accidental prose or markdown code fences around it.
 */
function extractJsonObject(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new AIProviderError("Model response did not contain a JSON object.");
  }
  return candidate.slice(start, end + 1);
}

export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic";

  async generateDraft(request: DraftGenerationRequest): Promise<DraftGenerationResult> {
    if (!anthropicApiKey || !anthropicModel) {
      throw new AIProviderError(
        "ANTHROPIC_API_KEY and ANTHROPIC_MODEL must both be set to generate content."
      );
    }

    let response: Response;
    try {
      response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": anthropicApiKey,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: JSON.stringify({
          model: anthropicModel,
          max_tokens: MAX_TOKENS,
          system: request.systemPrompt,
          messages: [{ role: "user", content: request.userPrompt }],
        }),
      });
    } catch (err) {
      throw new AIProviderError("Could not reach the Anthropic API.", err);
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new AIProviderError(
        `Anthropic API returned ${response.status}: ${body.slice(0, 500)}`
      );
    }

    const payload = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };

    const text = payload.content?.find((block) => block.type === "text")?.text;
    if (!text) {
      throw new AIProviderError("Anthropic response contained no text content.");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(extractJsonObject(text));
    } catch (err) {
      throw new AIProviderError("Could not parse the model's JSON response.", err);
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as Record<string, unknown>).title !== "string" ||
      typeof (parsed as Record<string, unknown>).body !== "string"
    ) {
      throw new AIProviderError("Model response was missing a title or body string.");
    }

    const result = parsed as { title: string; body: string };
    return { title: result.title.trim(), body: result.body.trim() };
  }
}
