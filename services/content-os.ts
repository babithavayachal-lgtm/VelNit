import "server-only";
import type { PoolClient, QueryResultRow } from "pg";
import { db, isDatabaseConfigured } from "@/lib/db";
import type {
  ContentBrief, ContentIdea, ContentItem, ContentItemRevision, ContentReview,
  ContentStatus, ContentType, KnowledgeReference, PublicationJob, ReviewDecision,
} from "@/types/database";

export type ServiceResult<T> = { data: T; error: null } | { data: null; error: string };
const ok = <T>(data: T): ServiceResult<T> => ({ data, error: null });
const fail = <T>(error: string): ServiceResult<T> => ({ data: null, error });

async function rows<T extends QueryResultRow>(sql: string, values: unknown[] = []): Promise<T[]> {
  return (await db.query<T>(sql, values)).rows;
}

async function safeList<T extends QueryResultRow>(label: string, sql: string, values: unknown[] = []): Promise<T[]> {
  if (!isDatabaseConfigured) return [];
  try { return await rows<T>(sql, values); }
  catch (error) { console.error(`${label} failed:`, error); return []; }
}

async function safeOne<T extends QueryResultRow>(label: string, sql: string, values: unknown[] = []): Promise<T | null> {
  return (await safeList<T>(label, sql, values))[0] ?? null;
}

export async function listContentIdeas(): Promise<ContentIdea[]> {
  return safeList("listContentIdeas", "select * from content_ideas order by created_at desc");
}
export async function getContentIdea(id: string): Promise<ContentIdea | null> {
  return safeOne("getContentIdea", "select * from content_ideas where id = $1", [id]);
}
export async function createContentIdea(input: { topic: string; audience: string; notes?: string | null; createdBy: string }): Promise<ServiceResult<ContentIdea>> {
  if (!isDatabaseConfigured) return fail("Neon is not configured.");
  try {
    const [idea] = await rows<ContentIdea>(
      "insert into content_ideas (topic, audience, notes, created_by, status) values ($1,$2,$3,$4,'idea') returning *",
      [input.topic, input.audience, input.notes || null, input.createdBy],
    );
    return idea ? ok(idea) : fail("Could not save the idea. Please try again.");
  } catch (error) { console.error("createContentIdea failed:", error); return fail("Could not save the idea. Please try again."); }
}

export async function listContentBriefs(): Promise<ContentBrief[]> {
  return safeList("listContentBriefs", "select * from content_briefs order by created_at desc");
}
export async function getContentBrief(id: string): Promise<ContentBrief | null> {
  return safeOne("getContentBrief", "select * from content_briefs where id = $1", [id]);
}
export async function getContentBriefsForIdea(ideaId: string): Promise<ContentBrief[]> {
  return safeList("getContentBriefsForIdea", "select * from content_briefs where idea_id = $1 order by created_at desc", [ideaId]);
}
export async function createContentBrief(input: {
  ideaId: string; topic: string; audience: string; primaryEmotion: string; desiredOutcome: string;
  talkStage: string; vrifPillars: string[]; practicalAction: string; callToAction: string;
  knowledgeReferenceIds: string[]; prohibitedClaims?: string | null; createdBy: string;
}): Promise<ServiceResult<ContentBrief>> {
  if (!isDatabaseConfigured) return fail("Neon is not configured.");
  const client = await db.connect();
  try {
    await client.query("begin");
    const result = await client.query<ContentBrief>(
      `insert into content_briefs
       (idea_id,topic,audience,primary_emotion,desired_outcome,talk_stage,vrif_pillars,practical_action,call_to_action,knowledge_reference_ids,prohibited_claims,created_by,status)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'brief_ready') returning *`,
      [input.ideaId,input.topic,input.audience,input.primaryEmotion,input.desiredOutcome,input.talkStage,input.vrifPillars,input.practicalAction,input.callToAction,input.knowledgeReferenceIds,input.prohibitedClaims || null,input.createdBy],
    );
    await client.query("update content_ideas set status = 'brief_ready' where id = $1", [input.ideaId]);
    await client.query("commit");
    return result.rows[0] ? ok(result.rows[0]) : fail("Could not save the brief. Please try again.");
  } catch (error) {
    await client.query("rollback"); console.error("createContentBrief failed:", error); return fail("Could not save the brief. Please try again.");
  } finally { client.release(); }
}
export async function setContentBriefStatus(id: string, status: ContentStatus): Promise<ServiceResult<true>> {
  if (!isDatabaseConfigured) return fail("Neon is not configured.");
  try { await db.query("update content_briefs set status = $1 where id = $2", [status, id]); return ok(true); }
  catch (error) { console.error("setContentBriefStatus failed:", error); return fail("Could not update the brief status."); }
}

export async function getContentItemsForBrief(briefId: string): Promise<ContentItem[]> {
  return safeList("getContentItemsForBrief", "select * from content_items where brief_id = $1 order by content_type", [briefId]);
}
export async function getContentItem(id: string): Promise<ContentItem | null> {
  return safeOne("getContentItem", "select * from content_items where id = $1", [id]);
}
export async function listItemsPendingReview(): Promise<ContentItem[]> {
  return safeList("listItemsPendingReview", "select * from content_items where status = any($1::content_status[]) order by created_at", [["draft", "needs_revision"]]);
}

async function archiveContentItemVersion(client: PoolClient, current: ContentItem, summary: string, changedBy: string | null): Promise<void> {
  await client.query(
    `insert into content_item_revisions
     (content_item_id,version,title,body,status,talk_stage,vrif_pillars,knowledge_reference_ids,prompt_version,review_score,review_notes,generation_error,revision_summary,changed_by)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [current.id,current.version,current.title,current.body,current.status,current.talk_stage,current.vrif_pillars,current.knowledge_reference_ids,current.prompt_version,current.review_score,current.review_notes,current.generation_error,summary,changedBy],
  );
}
export async function listRevisionsForItem(contentItemId: string): Promise<ContentItemRevision[]> {
  return safeList("listRevisionsForItem", "select * from content_item_revisions where content_item_id = $1 order by version desc", [contentItemId]);
}

export async function saveGeneratedContentItem(input: {
  briefId: string; contentType: ContentType; title: string; body: string; talkStage: string | null;
  vrifPillars: string[]; knowledgeReferenceIds: string[]; promptVersion: string; createdBy: string;
}): Promise<ServiceResult<ContentItem>> {
  if (!isDatabaseConfigured) return fail("Neon is not configured.");
  const client = await db.connect();
  try {
    await client.query("begin");
    const existing = (await client.query<ContentItem>("select * from content_items where brief_id=$1 and content_type=$2 for update", [input.briefId,input.contentType])).rows[0];
    let item: ContentItem | undefined;
    if (existing) {
      await archiveContentItemVersion(client, existing, `Regenerated by AI (prompt ${input.promptVersion}).`, input.createdBy);
      item = (await client.query<ContentItem>(
        `update content_items set title=$1,body=$2,version=$3,status='draft',talk_stage=$4,vrif_pillars=$5,knowledge_reference_ids=$6,prompt_version=$7,generation_error=null,approved_at=null,published_at=null where id=$8 returning *`,
        [input.title,input.body,existing.version+1,input.talkStage,input.vrifPillars,input.knowledgeReferenceIds,input.promptVersion,existing.id],
      )).rows[0];
    } else {
      item = (await client.query<ContentItem>(
        `insert into content_items (brief_id,content_type,title,body,status,talk_stage,vrif_pillars,knowledge_reference_ids,prompt_version,created_by)
         values ($1,$2,$3,$4,'draft',$5,$6,$7,$8,$9) returning *`,
        [input.briefId,input.contentType,input.title,input.body,input.talkStage,input.vrifPillars,input.knowledgeReferenceIds,input.promptVersion,input.createdBy],
      )).rows[0];
    }
    await client.query("commit");
    return item ? ok(item) : fail("Could not save the generated draft.");
  } catch (error) { await client.query("rollback"); console.error("saveGeneratedContentItem failed:", error); return fail("Could not save the generated draft."); }
  finally { client.release(); }
}

export async function recordGenerationFailure(input: { briefId: string; contentType: ContentType; createdBy: string; errorMessage: string; promptVersion: string }): Promise<void> {
  if (!isDatabaseConfigured) return;
  try {
    await db.query(
      `insert into content_items (brief_id,content_type,title,body,status,prompt_version,generation_error,created_by)
       values ($1,$2,$3,'','draft',$4,$5,$6)
       on conflict (brief_id,content_type) do update set generation_error=excluded.generation_error`,
      [input.briefId,input.contentType,`(generation failed - ${input.contentType})`,input.promptVersion,input.errorMessage,input.createdBy],
    );
  } catch (error) { console.error("recordGenerationFailure failed:", error); }
}

export async function updateContentItemBody(input: { id: string; title: string; body: string; revisionSummary?: string; changedBy?: string | null }): Promise<ServiceResult<ContentItem>> {
  if (!isDatabaseConfigured) return fail("Neon is not configured.");
  const client = await db.connect();
  try {
    await client.query("begin");
    const current = (await client.query<ContentItem>("select * from content_items where id=$1 for update", [input.id])).rows[0];
    if (!current) { await client.query("rollback"); return fail("Could not find the draft to update."); }
    await archiveContentItemVersion(client,current,input.revisionSummary || "Manual edit by founder.",input.changedBy ?? null);
    const item = (await client.query<ContentItem>("update content_items set title=$1,body=$2,version=$3,status='draft' where id=$4 returning *", [input.title,input.body,current.version+1,input.id])).rows[0];
    await client.query("commit");
    return item ? ok(item) : fail("Could not save your edit.");
  } catch (error) { await client.query("rollback"); console.error("updateContentItemBody failed:", error); return fail("Could not save your edit."); }
  finally { client.release(); }
}

export async function setContentItemStatus(id: string, status: ContentStatus, extra: Partial<{ reviewScore: number | null; reviewNotes: string | null }> = {}): Promise<ServiceResult<ContentItem>> {
  if (!isDatabaseConfigured) return fail("Neon is not configured.");
  try {
    const [item] = await rows<ContentItem>(
      `update content_items set status=$1, review_score=case when $2 then $3 else review_score end,
       review_notes=case when $4 then $5 else review_notes end, approved_at=case when $1='approved' then now() else approved_at end
       where id=$6 returning *`,
      [status,"reviewScore" in extra,extra.reviewScore ?? null,"reviewNotes" in extra,extra.reviewNotes ?? null,id],
    );
    return item ? ok(item) : fail("Could not update the draft status.");
  } catch (error) { console.error("setContentItemStatus failed:", error); return fail("Could not update the draft status."); }
}

export async function createContentReview(input: { contentItemId: string; reviewerId: string; decision: ReviewDecision; score?: number | null; notes?: string | null }): Promise<ServiceResult<ContentReview>> {
  if (!isDatabaseConfigured) return fail("Neon is not configured.");
  try {
    const [review] = await rows<ContentReview>("insert into content_reviews (content_item_id,reviewer_id,decision,score,notes) values ($1,$2,$3,$4,$5) returning *", [input.contentItemId,input.reviewerId,input.decision,input.score ?? null,input.notes || null]);
    return review ? ok(review) : fail("Could not save the review.");
  } catch (error) { console.error("createContentReview failed:", error); return fail("Could not save the review."); }
}
export async function listReviewsForItem(contentItemId: string): Promise<ContentReview[]> {
  return safeList("listReviewsForItem", "select * from content_reviews where content_item_id=$1 order by created_at desc", [contentItemId]);
}
export async function listKnowledgeReferences(): Promise<KnowledgeReference[]> {
  return safeList("listKnowledgeReferences", "select * from knowledge_references order by source_document");
}
export async function getKnowledgeReferencesByIds(ids: string[]): Promise<KnowledgeReference[]> {
  if (!ids.length) return [];
  return safeList("getKnowledgeReferencesByIds", "select * from knowledge_references where id = any($1::uuid[])", [ids]);
}
export async function createPublicationJobStub(input: { contentItemId: string; channel: string }): Promise<ServiceResult<PublicationJob>> {
  if (!isDatabaseConfigured) return fail("Neon is not configured.");
  try {
    const [job] = await rows<PublicationJob>(
      "insert into publication_jobs (content_item_id,channel,status,notes) values ($1,$2,'approved',$3) returning *",
      [input.contentItemId,input.channel,"Created automatically when the draft was approved. Phase B does not publish - no channel integration exists yet."],
    );
    return job ? ok(job) : fail("Could not create the publication job stub.");
  } catch (error) { console.error("createPublicationJobStub failed:", error); return fail("Could not create the publication job stub."); }
}
export async function listPublicationJobsForItem(contentItemId: string): Promise<PublicationJob[]> {
  return safeList("listPublicationJobsForItem", "select * from publication_jobs where content_item_id=$1 order by created_at desc", [contentItemId]);
}
