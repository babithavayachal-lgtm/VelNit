"use server";

import { revalidatePath } from "next/cache";
import { requireFounder } from "@/lib/auth/founder";
import {
  contentItemEditSchema,
  contentReviewSchema,
  type ContentItemEditInput,
  type ContentReviewInput,
} from "@/lib/validation/schemas";
import {
  createContentReview,
  createPublicationJobStub,
  getContentItem,
  setContentItemStatus,
  updateContentItemBody,
} from "@/services/content-os";
import type { ActionResult } from "@/features/beta/actions";
import type { ContentType } from "@/types/database";

// Maps a content type to the (future) distribution channel a
// publication_jobs stub is created for on approval. Phase B never acts on
// these rows - see supabase/migrations/0002_content_os.sql.
const CHANNEL_BY_CONTENT_TYPE: Record<ContentType, string> = {
  article: "website",
  facebook: "facebook",
  newsletter: "email",
  reel: "video",
};

export async function submitReview(input: ContentReviewInput): Promise<ActionResult> {
  const founder = await requireFounder();

  const parsed = contentReviewSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid review." };
  }

  const item = await getContentItem(parsed.data.contentItemId);
  if (!item) {
    return { success: false, error: "Draft not found." };
  }

  const review = await createContentReview({
    contentItemId: parsed.data.contentItemId,
    reviewerId: founder.id,
    decision: parsed.data.decision,
    score: parsed.data.score ?? null,
    notes: parsed.data.notes || null,
  });

  if (review.error !== null) {
    return { success: false, error: review.error };
  }

  const statusResult = await setContentItemStatus(
    parsed.data.contentItemId,
    parsed.data.decision === "approved" ? "approved" : "needs_revision",
    { reviewScore: parsed.data.score ?? null, reviewNotes: parsed.data.notes || null }
  );

  if (statusResult.error !== null) {
    return { success: false, error: statusResult.error };
  }

  // Do not publish automatically - Phase B never advances this stub past
  // 'approved'. Creating it just records that the draft is ready whenever
  // a real channel integration exists.
  if (parsed.data.decision === "approved") {
    await createPublicationJobStub({
      contentItemId: parsed.data.contentItemId,
      channel: CHANNEL_BY_CONTENT_TYPE[item.content_type],
    });
  }

  revalidatePath("/studio/review");
  revalidatePath(`/studio/briefs/${item.brief_id}`);
  return { success: true };
}

export async function editContentItem(input: ContentItemEditInput): Promise<ActionResult> {
  await requireFounder();

  const parsed = contentItemEditSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid edit." };
  }

  const result = await updateContentItemBody({
    id: parsed.data.contentItemId,
    title: parsed.data.title,
    body: parsed.data.body,
  });

  if (result.error !== null) {
    return { success: false, error: result.error };
  }

  revalidatePath("/studio/review");
  revalidatePath(`/studio/briefs/${result.data.brief_id}`);
  return { success: true };
}
