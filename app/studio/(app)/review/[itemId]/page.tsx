import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  getContentBrief,
  getContentItem,
  getKnowledgeReferencesByIds,
  listReviewsForItem,
} from "@/services/content-os";
import { REVIEW_CHECKLIST } from "@/lib/ai/review-checklist";
import { EditItemForm } from "@/features/studio/edit-item-form";
import { ReviewForm } from "@/features/studio/review-form";

export const metadata: Metadata = { title: "Review draft" };

const CONTENT_TYPE_LABELS: Record<string, string> = {
  article: "Website article",
  facebook: "Facebook post",
  newsletter: "Newsletter",
  reel: "Reel script",
};

export default async function StudioReviewItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  const item = await getContentItem(itemId);
  if (!item) notFound();

  const [brief, knowledgeRefs, reviews] = await Promise.all([
    getContentBrief(item.brief_id),
    getKnowledgeReferencesByIds(item.knowledge_reference_ids),
    listReviewsForItem(itemId),
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          <Link href="/studio/review" className="hover:text-foreground">
            Review queue
          </Link>{" "}
          / {CONTENT_TYPE_LABELS[item.content_type] ?? item.content_type}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <h1 className="font-heading text-2xl font-semibold">{item.title}</h1>
          <Badge variant="outline">{item.status.replace("_", " ")}</Badge>
        </div>
        {brief && (
          <p className="mt-1 text-sm text-muted-foreground">
            From brief:{" "}
            <Link href={`/studio/briefs/${brief.id}`} className="underline">
              {brief.topic}
            </Link>
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Version {item.version} · prompt {item.prompt_version ?? "manual"}
        </p>

        {item.generation_error && (
          <Card className="mt-4 border-destructive/40">
            <CardContent className="pt-6 text-sm text-destructive">
              Generation error: {item.generation_error}
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Current draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{item.body}</div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Edit manually</CardTitle>
          </CardHeader>
          <CardContent>
            <EditItemForm contentItemId={item.id} title={item.title} body={item.body} />
          </CardContent>
        </Card>

        {reviews.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Review history</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-3 last:border-0">
                  <p className="font-medium text-foreground">
                    {review.decision === "approved" ? "Approved" : "Sent back for revision"}
                    {review.score ? ` · score ${review.score}/10` : ""}
                  </p>
                  {review.notes && <p className="text-muted-foreground">{review.notes}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review decision</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewForm contentItemId={item.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {REVIEW_CHECKLIST.map((check) => (
                <li key={check.key}>
                  <span className="font-medium text-foreground">{check.label}.</span>{" "}
                  <span className="text-muted-foreground">{check.description}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Knowledge references used</CardTitle>
          </CardHeader>
          <CardContent>
            {knowledgeRefs.length === 0 ? (
              <p className="text-sm text-muted-foreground">None attached.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {knowledgeRefs.map((ref) => (
                  <li key={ref.id}>
                    <span className="font-medium text-foreground">{ref.concept}</span> -{" "}
                    <span className="text-muted-foreground">{ref.summary}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
