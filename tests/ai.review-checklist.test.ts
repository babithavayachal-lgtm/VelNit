import { describe, expect, it } from "vitest";
import { REVIEW_CHECKLIST } from "@/lib/ai/review-checklist";

describe("REVIEW_CHECKLIST", () => {
  it("has exactly the ten criteria required by the Phase B spec", () => {
    expect(REVIEW_CHECKLIST).toHaveLength(10);
    const labels = REVIEW_CHECKLIST.map((c) => c.label);
    expect(labels).toEqual([
      "VelNit voice consistency",
      "Hopefulness",
      "TALK accuracy",
      "VRIF alignment",
      "Practical usefulness",
      "Factual support",
      "Respect and dignity",
      "Absence of blame or fear",
      "Clear human-centred call to action",
      "AI supports connection rather than replacing it",
    ]);
  });

  it("has a non-empty description for every criterion", () => {
    for (const item of REVIEW_CHECKLIST) {
      expect(item.description.length).toBeGreaterThan(10);
    }
  });
});
