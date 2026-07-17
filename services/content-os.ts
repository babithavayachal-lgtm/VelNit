import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type {
  Database,
  ContentBrief,
  ContentIdea,
  ContentItem,
  ContentItemRevision,
  ContentReview,
  ContentStatus,
  ContentType,
  KnowledgeReference,
  PublicationJob,
  ReviewDecision,
} from "@/types/database";

/**
 * Data access for the Content Operating System (Phase B). Every table here
 * is founder-only and RLS-gated (see supabase/migrations/0002_content_os.sql)
 * - these functions always run with the cookie-bound server client so
 * auth.uid() resolves correctly inside Postgres policies. Never call this
 * module from a Client Component.
 *
 * Like services/blog.ts, every read degrades to an empty result rather than
 * throwing when Supabase isn't configured; writes surface a clear error
 * instead, since a founder taking an action deserves to know it didn't save.
 */

export type ServiceResult<T> = { data: T; error: null } | { data: null; error: string };

function ok<T>(data: T): ServiceResult<T> {
  return { data, error: null };
}

function fail<T>(error: string): ServiceResult<T> {
  return { data: null, error };
}

// ------------------------------------------------------------
// Content ideas
// ------------------------------------------------------------

export async function listContentIdeas(): Promise<ContentIdea[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listContentIdeas failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getContentIdea(id: string): Promise<ContentIdea | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_ideas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getContentIdea failed:", error.message);
    return null;
  }
  return data;
}

export async function createContentIdea(input: {
  topic: string;
  audience: string;
  notes?: string | null;
  createdBy: string;
}): Promise<ServiceResult<ContentIdea>> {
  if (!isSupabaseConfigured) return fail("Supabase is not configured.");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_ideas")
    .insert({
      topic: input.topic,
      audience: input.audience,
      notes: input.notes || null,
      created_by: input.createdBy,
      status: "idea",
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("createContentIdea failed:", error?.message);
    return fail("Could not save the idea. Please try again.");
  }
  return ok(data);
}

// ------------------------------------------------------------
// Content briefs
// ------------------------------------------------------------

export async function listContentBriefs(): Promise<ContentBrief[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_briefs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listContentBriefs failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getContentBrief(id: string): Promise<ContentBrief | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_briefs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getContentBrief failed:", error.message);
    return null;
  }
  return data;
}

export async function getContentBriefsForIdea(ideaId: string): Promise<ContentBrief[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_briefs")
    .select("*")
    .eq("idea_id", ideaId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getContentBriefsForIdea failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function createContentBrief(input: {
  ideaId: string;
  topic: string;
  audience: string;
  primaryEmotion: string;
  desiredOutcome: string;
  talkStage: string;
  vrifPillars: string[];
  practicalAction: string;
  callToAction: string;
  knowledgeReferenceIds: string[];
  prohibitedClaims?: string | null;
  createdBy: string;
}): Promise<ServiceResult<ContentBrief>> {
  if (!isSupabaseConfigured) return fail("Supabase is not configured.");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("content_briefs")
    .insert({
      idea_id: input.ideaId,
      topic: input.topic,
      audience: input.audience,
      primary_emotion: input.primaryEmotion,
      desired_outcome: input.desiredOutcome,
      talk_stage: input.talkStage,
      vrif_pillars: input.vrifPillars,
      practical_action: input.practicalAction,
      call_to_action: input.callToAction,
      knowledge_reference_ids: input.knowledgeReferenceIds,
      prohibited_claims: input.prohibitedClaims || null,
      created_by: input.createdBy,
      status: "brief_ready",
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("createContentBrief failed:", error?.message);
    return fail("Could not save the brief. Please try again.");
  }

  // A brief moving to brief_ready implies its parent idea has progressed too.
  await supabase.from("content_ideas").update({ status: "brief_ready" }).eq("id", input.ideaId);

  return ok(data);
}

export async function setContentBriefStatus(
  id: string,
  status: ContentStatus
): Promise<ServiceResult<true>> {
  if (!isSupabaseConfigured) return fail("Supabase is not configured.");
  const supabase = await createClient();
  const { error } = await supabase.from("content_briefs").update({ status }).eq("id", id);

  if (error) {
    console.error("setContentBriefStatus failed:", error.message);
    return fail("Could not update the brief status.");
  }
  return ok(true);
}

// ------------------------------------------------------------
// Content items (the four generated draft formats)
// ------------------------------------------------------------

export async function getContentItemsForBrief(briefId: string): Promise<ContentItem[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .eq("brief_id", briefId)
    .order("content_type", { ascending: true });

  if (error) {
    console.error("getContentItemsForBrief failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getContentItem(id: string): Promise<ContentItem | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getContentItem failed:", error.message);
    return null;
  }
  return data;
}

/**
 * Lists every item currently sitting in the founder's review queue -
 * anything drafted but not yet approved or sent back for revision.
 */
export async function listItemsPendingReview(): Promise<ContentItem[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .in("status", ["draft", "needs_revision"])
    .order("created_at", { ascending: true });

  if (error) {
    console.error("listItemsPendingReview failed:", error.message);
    return [];
  }
  return data ?? [];
}

// ------------------------------------------------------------
// Version history - snapshot a content_items row before it gets
// overwritten, so "Version 1" stays inspectable even after "Version 2"
// replaces it as the current draft.
// ------------------------------------------------------------

async function archiveContentItemVersion(
  current: ContentItem,
  revisionSummary: string,
  changedBy: string | null
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("content_item_revisions").insert({
    content_item_id: current.id,
    version: current.version,
    title: current.title,
    body: current.body,
    status: current.status,
    talk_stage: current.talk_stage,
    vrif_pillars: current.vrif_pillars,
    knowledge_reference_ids: current.knowledge_reference_ids,
    prompt_version: current.prompt_version,
    review_score: current.review_score,
    review_notes: current.review_notes,
    generation_error: current.generation_error,
    revision_summary: revisionSummary,
    changed_by: changedBy,
  });

  if (error) {
    // Archiving is best-effort - if it fails we still want the actual
    // content update to proceed, but we log loudly since silently losing
    // version history defeats the entire point of this table.
    console.error("archiveContentItemVersion failed:", error.message);
  }
}

export async function listRevisionsForItem(
  contentItemId: string
): Promise<ContentItemRevision[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_item_revisions")
    .select("*")
    .eq("content_item_id", contentItemId)
    .order("version", { ascending: false });

  if (error) {
    console.error("listRevisionsForItem failed:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Inserts a freshly generated draft, or - if a draft of this content type
 * already exists for the brief (e.g. a regeneration after "Request
 * revision") - archives the existing row into content_item_revisions and
 * then saves the new content as the next version over the existing row,
 * rather than creating a duplicate. content_items has a unique
 * (brief_id, content_type) index specifically so this upsert is safe.
 */
export async function saveGeneratedContentItem(input: {
  briefId: string;
  contentType: ContentType;
  title: string;
  body: string;
  talkStage: string | null;
  vrifPillars: string[];
  knowledgeReferenceIds: string[];
  promptVersion: string;
  createdBy: string;
}): Promise<ServiceResult<ContentItem>> {
  if (!isSupabaseConfigured) return fail("Supabase is not configured.");
  const supabase = await createClient();

  const existing = await supabase
    .from("content_items")
    .select("*")
    .eq("brief_id", input.briefId)
    .eq("content_type", input.contentType)
    .maybeSingle();

  if (existing.data) {
    await archiveContentItemVersion(
      existing.data,
      `Regenerated by AI (prompt ${input.promptVersion}).`,
      input.createdBy
    );

    const { data, error } = await supabase
      .from("content_items")
      .update({
        title: input.title,
        body: input.body,
        version: existing.data.version + 1,
        status: "draft",
        talk_stage: input.talkStage,
        vrif_pillars: input.vrifPillars,
        knowledge_reference_ids: input.knowledgeReferenceIds,
        prompt_version: input.promptVersion,
        generation_error: null,
        approved_at: null,
        published_at: null,
      })
      .eq("id", existing.data.id)
      .select("*")
      .single();

    if (error || !data) {
      console.error("saveGeneratedContentItem (update) failed:", error?.message);
      return fail("Could not save the regenerated draft.");
    }
    return ok(data);
  }

  const { data, error } = await supabase
    .from("content_items")
    .insert({
      brief_id: input.briefId,
      content_type: input.contentType,
      title: input.title,
      body: input.body,
      status: "draft",
      talk_stage: input.talkStage,
      vrif_pillars: input.vrifPillars,
      knowledge_reference_ids: input.knowledgeReferenceIds,
      prompt_version: input.promptVersion,
      created_by: input.createdBy,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("saveGeneratedContentItem (insert) failed:", error?.message);
    return fail("Could not save the generated draft.");
  }
  return ok(data);
}

/**
 * Records a generation failure directly on the item's row (or a placeholder
 * row if generation never produced one) so founders can see, per format,
 * exactly what went wrong rather than a silent gap in the review screen.
 */
export async function recordGenerationFailure(input: {
  briefId: string;
  contentType: ContentType;
  createdBy: string;
  errorMessage: string;
  promptVersion: string;
}): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await createClient();

  const existing = await supabase
    .from("content_items")
    .select("id")
    .eq("brief_id", input.briefId)
    .eq("content_type", input.contentType)
    .maybeSingle();

  if (existing.data) {
    await supabase
      .from("content_items")
      .update({ generation_error: input.errorMessage })
      .eq("id", existing.data.id);
    return;
  }

  await supabase.from("content_items").insert({
    brief_id: input.briefId,
    content_type: input.contentType,
    title: `(generation failed - ${input.contentType})`,
    body: "",
    status: "draft",
    prompt_version: input.promptVersion,
    generation_error: input.errorMessage,
    created_by: input.createdBy,
  });
}

export async function updateContentItemBody(input: {
  id: string;
  title: string;
  body: string;
  revisionSummary?: string;
  changedBy?: string | null;
}): Promise<ServiceResult<ContentItem>> {
  if (!isSupabaseConfigured) return fail("Supabase is not configured.");
  const supabase = await createClient();

  const current = await supabase
    .from("content_items")
    .select("*")
    .eq("id", input.id)
    .maybeSingle();

  if (!current.data) {
    return fail("Could not find the draft to update.");
  }

  await archiveContentItemVersion(
    current.data,
    input.revisionSummary || "Manual edit by founder.",
    input.changedBy ?? null
  );

  const { data, error } = await supabase
    .from("content_items")
    .update({
      title: input.title,
      body: input.body,
      version: current.data.version + 1,
      status: "draft",
    })
    .eq("id", input.id)
    .select("*")
    .single();

  if (error || !data) {
    console.error("updateContentItemBody failed:", error?.message);
    return fail("Could not save your edit.");
  }
  return ok(data);
}

export async function setContentItemStatus(
  id: string,
  status: ContentStatus,
  extra: Partial<{ reviewScore: number | null; reviewNotes: string | null }> = {}
): Promise<ServiceResult<ContentItem>> {
  if (!isSupabaseConfigured) return fail("Supabase is not configured.");
  const supabase = await createClient();

  const patch: Database["public"]["Tables"]["content_items"]["Update"] = { status };
  if ("reviewScore" in extra) patch.review_score = extra.reviewScore;
  if ("reviewNotes" in extra) patch.review_notes = extra.reviewNotes;
  if (status === "approved") patch.approved_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("content_items")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    console.error("setContentItemStatus failed:", error?.message);
    return fail("Could not update the draft status.");
  }
  return ok(data);
}

// ------------------------------------------------------------
// Content reviews (append-only decision log)
// ------------------------------------------------------------

export async function createContentReview(input: {
  contentItemId: string;
  reviewerId: string;
  decision: ReviewDecision;
  score?: number | null;
  notes?: string | null;
}): Promise<ServiceResult<ContentReview>> {
  if (!isSupabaseConfigured) return fail("Supabase is not configured.");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("content_reviews")
    .insert({
      content_item_id: input.contentItemId,
      reviewer_id: input.reviewerId,
      decision: input.decision,
      score: input.score ?? null,
      notes: input.notes || null,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("createContentReview failed:", error?.message);
    return fail("Could not save the review.");
  }
  return ok(data);
}

export async function listReviewsForItem(contentItemId: string): Promise<ContentReview[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_reviews")
    .select("*")
    .eq("content_item_id", contentItemId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listReviewsForItem failed:", error.message);
    return [];
  }
  return data ?? [];
}

// ------------------------------------------------------------
// Knowledge references (VRIF / TALK / Writing DNA / Knowledge Graph)
// ------------------------------------------------------------

export async function listKnowledgeReferences(): Promise<KnowledgeReference[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge_references")
    .select("*")
    .order("source_document", { ascending: true });

  if (error) {
    console.error("listKnowledgeReferences failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getKnowledgeReferencesByIds(
  ids: string[]
): Promise<KnowledgeReference[]> {
  if (!isSupabaseConfigured || ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge_references")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("getKnowledgeReferencesByIds failed:", error.message);
    return [];
  }
  return data ?? [];
}

// ------------------------------------------------------------
// Publication jobs - stub only in Phase B. Creating a row here never
// triggers any real publishing; nothing in this codebase advances a job
// past 'approved'. See supabase/migrations/0002_content_os.sql.
// ------------------------------------------------------------

export async function createPublicationJobStub(input: {
  contentItemId: string;
  channel: string;
}): Promise<ServiceResult<PublicationJob>> {
  if (!isSupabaseConfigured) return fail("Supabase is not configured.");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("publication_jobs")
    .insert({
      content_item_id: input.contentItemId,
      channel: input.channel,
      status: "approved",
      notes: "Created automatically when the draft was approved. Phase B does not publish - no channel integration exists yet.",
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("createPublicationJobStub failed:", error?.message);
    return fail("Could not create the publication job stub.");
  }
  return ok(data);
}

export async function listPublicationJobsForItem(
  contentItemId: string
): Promise<PublicationJob[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publication_jobs")
    .select("*")
    .eq("content_item_id", contentItemId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listPublicationJobsForItem failed:", error.message);
    return [];
  }
  return data ?? [];
}
