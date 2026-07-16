import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockSupabase } from "./helpers/supabase-mock";

vi.mock("@/lib/supabase/env", () => ({
  isSupabaseConfigured: true,
  supabaseUrl: "https://test.supabase.co",
  supabasePublishableKey: "test-publishable-key",
  supabaseSecretKey: "",
}));

const createClientMock = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: () => createClientMock(),
}));

async function loadServices() {
  return import("@/services/content-os");
}

beforeEach(() => {
  createClientMock.mockReset();
});

describe("createContentIdea (content creation)", () => {
  it("returns the inserted idea on success", async () => {
    const mockSupabase = createMockSupabase({
      from: {
        content_ideas: {
          data: {
            id: "idea-1",
            topic: "Loneliness after the children leave home",
            audience: "Couples aged 45+",
            notes: null,
            status: "idea",
            created_at: "2026-01-01T00:00:00.000Z",
            updated_at: "2026-01-01T00:00:00.000Z",
            created_by: "founder-1",
          },
          error: null,
        },
      },
    });
    createClientMock.mockResolvedValue(mockSupabase);

    const { createContentIdea } = await loadServices();
    const result = await createContentIdea({
      topic: "Loneliness after the children leave home",
      audience: "Couples aged 45+",
      createdBy: "founder-1",
    });

    expect(result.error).toBeNull();
    expect(result.data?.id).toBe("idea-1");
    expect(mockSupabase.buildersByTable.content_ideas[0].insert).toHaveBeenCalledWith(
      expect.objectContaining({ topic: "Loneliness after the children leave home", status: "idea" })
    );
  });

  it("surfaces a friendly error when the insert fails", async () => {
    const mockSupabase = createMockSupabase({
      from: {
        content_ideas: { data: null, error: { message: "insert failed" } },
      },
    });
    createClientMock.mockResolvedValue(mockSupabase);

    const { createContentIdea } = await loadServices();
    const result = await createContentIdea({
      topic: "A topic",
      audience: "An audience",
      createdBy: "founder-1",
    });

    expect(result.data).toBeNull();
    expect(result.error).toMatch(/could not save/i);
  });
});

describe("createContentBrief (content creation)", () => {
  it("saves the brief and advances the parent idea to brief_ready", async () => {
    const mockSupabase = createMockSupabase({
      from: {
        content_briefs: {
          data: { id: "brief-1", idea_id: "idea-1", status: "brief_ready" },
          error: null,
        },
        content_ideas: { data: null, error: null },
      },
    });
    createClientMock.mockResolvedValue(mockSupabase);

    const { createContentBrief } = await loadServices();
    const result = await createContentBrief({
      ideaId: "idea-1",
      topic: "Loneliness after the children leave home",
      audience: "Couples aged 45+",
      primaryEmotion: "Quiet grief and disconnection",
      desiredOutcome: "Understand the silence is a transition.",
      talkStage: "Target the Silence",
      vrifPillars: ["Couple Connection"],
      practicalAction: "The five-minute coffee ritual",
      callToAction: "Try it this week.",
      knowledgeReferenceIds: [],
      createdBy: "founder-1",
    });

    expect(result.error).toBeNull();
    expect(mockSupabase.buildersByTable.content_ideas[0].update).toHaveBeenCalledWith(
      expect.objectContaining({ status: "brief_ready" })
    );
  });
});

describe("setContentItemStatus (review status changes)", () => {
  it("stamps approved_at when a draft is approved", async () => {
    const mockSupabase = createMockSupabase({
      from: {
        content_items: {
          data: { id: "item-1", status: "approved", brief_id: "brief-1" },
          error: null,
        },
      },
    });
    createClientMock.mockResolvedValue(mockSupabase);

    const { setContentItemStatus } = await loadServices();
    const result = await setContentItemStatus("item-1", "approved", {
      reviewScore: 9,
      reviewNotes: "Reads as VelNit voice throughout.",
    });

    expect(result.error).toBeNull();
    const patch = mockSupabase.buildersByTable.content_items[0].update.mock.calls[0][0];
    expect(patch.status).toBe("approved");
    expect(patch.review_score).toBe(9);
    expect(typeof patch.approved_at).toBe("string");
  });

  it("does not stamp approved_at when sent back for revision", async () => {
    const mockSupabase = createMockSupabase({
      from: {
        content_items: {
          data: { id: "item-1", status: "needs_revision", brief_id: "brief-1" },
          error: null,
        },
      },
    });
    createClientMock.mockResolvedValue(mockSupabase);

    const { setContentItemStatus } = await loadServices();
    await setContentItemStatus("item-1", "needs_revision", {
      reviewNotes: "Needs a stronger CTA.",
    });

    const patch = mockSupabase.buildersByTable.content_items[0].update.mock.calls[0][0];
    expect(patch.status).toBe("needs_revision");
    expect(patch.approved_at).toBeUndefined();
  });
});

describe("createContentReview (review status changes)", () => {
  it("records the reviewer, decision, score, and notes", async () => {
    const mockSupabase = createMockSupabase({
      from: {
        content_reviews: {
          data: { id: "review-1", content_item_id: "item-1", decision: "approved" },
          error: null,
        },
      },
    });
    createClientMock.mockResolvedValue(mockSupabase);

    const { createContentReview } = await loadServices();
    await createContentReview({
      contentItemId: "item-1",
      reviewerId: "founder-1",
      decision: "approved",
      score: 8,
      notes: "Good to go.",
    });

    expect(mockSupabase.buildersByTable.content_reviews[0].insert).toHaveBeenCalledWith(
      expect.objectContaining({
        content_item_id: "item-1",
        reviewer_id: "founder-1",
        decision: "approved",
        score: 8,
      })
    );
  });
});
