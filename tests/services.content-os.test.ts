import { beforeEach, describe, expect, it, vi } from "vitest";

const queryMock = vi.fn();
const releaseMock = vi.fn();
const connectMock = vi.fn(async () => ({ query: queryMock, release: releaseMock }));

vi.mock("@/lib/db", () => ({
  isDatabaseConfigured: true,
  db: { query: queryMock, connect: connectMock },
}));

async function loadServices() {
  return import("@/services/content-os");
}

beforeEach(() => {
  queryMock.mockReset();
  releaseMock.mockReset();
  connectMock.mockClear();
});

describe("createContentIdea", () => {
  it("returns the inserted idea on success", async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: "idea-1", status: "idea" }] });
    const { createContentIdea } = await loadServices();
    const result = await createContentIdea({ topic: "Loneliness", audience: "Couples aged 45+", createdBy: "founder-1" });
    expect(result.data?.id).toBe("idea-1");
    expect(queryMock).toHaveBeenCalledWith(expect.stringContaining("insert into content_ideas"), ["Loneliness", "Couples aged 45+", null, "founder-1"]);
  });

  it("surfaces a friendly error when the insert fails", async () => {
    queryMock.mockRejectedValueOnce(new Error("insert failed"));
    const { createContentIdea } = await loadServices();
    const result = await createContentIdea({ topic: "A topic", audience: "An audience", createdBy: "founder-1" });
    expect(result.data).toBeNull();
    expect(result.error).toMatch(/could not save/i);
  });
});

describe("createContentBrief", () => {
  it("saves the brief and advances its idea in one transaction", async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: "brief-1", idea_id: "idea-1", status: "brief_ready" }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });
    const { createContentBrief } = await loadServices();
    const result = await createContentBrief({
      ideaId: "idea-1", topic: "Loneliness", audience: "Couples", primaryEmotion: "Grief",
      desiredOutcome: "Connection", talkStage: "Target the Silence", vrifPillars: ["Couple Connection"],
      practicalAction: "Coffee ritual", callToAction: "Try it.", knowledgeReferenceIds: [], createdBy: "founder-1",
    });
    expect(result.error).toBeNull();
    expect(queryMock.mock.calls.map(([sql]) => sql)).toEqual([
      "begin", expect.stringContaining("insert into content_briefs"),
      expect.stringContaining("update content_ideas"), "commit",
    ]);
    expect(releaseMock).toHaveBeenCalledOnce();
  });
});

describe("setContentItemStatus", () => {
  it("asks Postgres to stamp approved_at when approved", async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: "item-1", status: "approved" }] });
    const { setContentItemStatus } = await loadServices();
    const result = await setContentItemStatus("item-1", "approved", { reviewScore: 9, reviewNotes: "Good." });
    expect(result.error).toBeNull();
    expect(queryMock.mock.calls[0][0]).toContain("approved_at=case when $1='approved' then now()");
    expect(queryMock.mock.calls[0][1]).toEqual(["approved", true, 9, true, "Good.", "item-1"]);
  });

  it("preserves optional review fields when they are omitted", async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: "item-1", status: "needs_revision" }] });
    const { setContentItemStatus } = await loadServices();
    await setContentItemStatus("item-1", "needs_revision");
    expect(queryMock.mock.calls[0][1]).toEqual(["needs_revision", false, null, false, null, "item-1"]);
  });
});

describe("createContentReview", () => {
  it("records reviewer, decision, score, and notes as parameters", async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: "review-1", decision: "approved" }] });
    const { createContentReview } = await loadServices();
    await createContentReview({ contentItemId: "item-1", reviewerId: "founder-1", decision: "approved", score: 8, notes: "Good to go." });
    expect(queryMock).toHaveBeenCalledWith(expect.stringContaining("insert into content_reviews"), ["item-1", "founder-1", "approved", 8, "Good to go."]);
  });
});
