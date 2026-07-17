import { describe, expect, it } from "vitest";
import { runContentChecks } from "@/lib/ai/content-checks";

describe("runContentChecks", () => {
  it("flags invented anecdotes/testimonials", () => {
    const flags = runContentChecks("One couple we know found this helped a lot.");
    expect(flags.some((f) => f.category === "invented_anecdote")).toBe(true);
  });

  it("flags unsupported research claims", () => {
    const flags = runContentChecks("Research shows that silence can be a sign of drift.");
    expect(flags.some((f) => f.category === "unsupported_research_claim")).toBe(true);
  });

  it("flags unsupported research claims with words between subject and verb", () => {
    const flags = runContentChecks(
      "Research on long relationships shows us something important about couples."
    );
    expect(flags.some((f) => f.category === "unsupported_research_claim")).toBe(true);
  });

  it("flags absolute psychological claims", () => {
    const flags = runContentChecks("The conversation vanished the day the kids left.");
    expect(flags.some((f) => f.category === "absolute_psychological_claim")).toBe(true);
  });

  it("flags off-brand language", () => {
    const flags = runContentChecks("This ritual is stupidly simple to follow.");
    expect(flags.some((f) => f.category === "off_brand_language")).toBe(true);
  });

  it("flags emotionally demanding questions", () => {
    const flags = runContentChecks("Is there something on your mind I should know about?");
    expect(flags.some((f) => f.category === "emotionally_demanding_question")).toBe(true);
  });

  it("returns no flags for clean, on-brand copy", () => {
    const flags = runContentChecks(
      "Try the five-minute coffee ritual tonight - no phones, one gentle question, and one thing you noticed about each other."
    );
    expect(flags).toHaveLength(0);
  });

  it("does not duplicate flags for repeated matches of the same phrase", () => {
    const flags = runContentChecks("Research shows this. Also, research shows that.");
    const researchFlags = flags.filter((f) => f.category === "unsupported_research_claim");
    expect(researchFlags).toHaveLength(1);
  });
});
