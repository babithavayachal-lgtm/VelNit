import { describe, expect, it } from "vitest";
import {
  contentBriefSchema,
  contentIdeaSchema,
  contentItemEditSchema,
  contentReviewSchema,
  loginSchema,
} from "@/lib/validation/schemas";

describe("contentIdeaSchema (content creation)", () => {
  it("accepts a valid idea", () => {
    const result = contentIdeaSchema.safeParse({
      topic: "Loneliness after the children leave home",
      audience: "Couples aged 45+ whose children have moved away",
      notes: "Pilot topic",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a topic that is too short", () => {
    const result = contentIdeaSchema.safeParse({ topic: "Hi", audience: "Couples" });
    expect(result.success).toBe(false);
  });

  it("allows notes to be omitted", () => {
    const result = contentIdeaSchema.safeParse({
      topic: "A workable topic",
      audience: "A workable audience",
    });
    expect(result.success).toBe(true);
  });
});

describe("contentBriefSchema (content creation)", () => {
  const validBrief = {
    ideaId: "11111111-1111-4111-8111-111111111111",
    topic: "Loneliness after the children leave home",
    audience: "Couples aged 45+ whose children have moved away",
    primaryEmotion: "Quiet grief and disconnection",
    desiredOutcome: "Help couples understand the silence is a transition.",
    talkStage: "Target the Silence",
    vrifPillars: ["Couple Connection", "Self Connection", "Community Connection"],
    practicalAction: "The five-minute coffee ritual",
    callToAction: "Try the ritual together this week.",
    knowledgeReferenceIds: [],
  };

  it("accepts a fully valid brief", () => {
    expect(contentBriefSchema.safeParse(validBrief).success).toBe(true);
  });

  it("rejects a brief with no VRIF pillars", () => {
    const result = contentBriefSchema.safeParse({ ...validBrief, vrifPillars: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a brief with an invalid ideaId", () => {
    const result = contentBriefSchema.safeParse({ ...validBrief, ideaId: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("defaults knowledgeReferenceIds when omitted", () => {
    const { knowledgeReferenceIds, ...withoutIds } = validBrief;
    void knowledgeReferenceIds;
    const result = contentBriefSchema.safeParse(withoutIds);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.knowledgeReferenceIds).toEqual([]);
    }
  });
});

describe("contentReviewSchema (review status changes)", () => {
  it("accepts an approval decision", () => {
    const result = contentReviewSchema.safeParse({
      contentItemId: "11111111-1111-4111-8111-111111111111",
      decision: "approved",
      score: 9,
      notes: "Reads as VelNit voice throughout.",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a needs_revision decision without a score", () => {
    const result = contentReviewSchema.safeParse({
      contentItemId: "11111111-1111-4111-8111-111111111111",
      decision: "needs_revision",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid decision value", () => {
    const result = contentReviewSchema.safeParse({
      contentItemId: "11111111-1111-4111-8111-111111111111",
      decision: "rejected",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a score outside the 1-10 range", () => {
    const result = contentReviewSchema.safeParse({
      contentItemId: "11111111-1111-4111-8111-111111111111",
      decision: "approved",
      score: 25,
    });
    expect(result.success).toBe(false);
  });
});

describe("contentItemEditSchema (manual edit)", () => {
  it("rejects an empty body", () => {
    const result = contentItemEditSchema.safeParse({
      contentItemId: "11111111-1111-4111-8111-111111111111",
      title: "A valid title",
      body: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema (authorization entry point)", () => {
  it("rejects a short password", () => {
    const result = loginSchema.safeParse({ email: "founder@velnit.life", password: "short" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "longenoughpassword" });
    expect(result.success).toBe(false);
  });

  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "founder@velnit.life",
      password: "longenoughpassword",
    });
    expect(result.success).toBe(true);
  });
});
