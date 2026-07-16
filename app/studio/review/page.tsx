import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getContentBrief, listItemsPendingReview } from "@/services/content-os";

export const metadata: Metadata = { title: "Review" };

const CONTENT_TYPE_LABELS: Record<string, string> = {
  article: "Website article",
  facebook: "Facebook post",
  newsletter: "Newsletter",
  reel: "Reel script",
};

export default async function StudioReviewPage() {
  const items = await listItemsPendingReview();
  const briefs = await Promise.all(items.map((item) => getContentBrief(item.brief_id)));

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Review queue</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Nothing here has been approved yet. Approve, request revision, or edit each draft
        directly.
      </p>

      <div className="mt-6 space-y-4">
        {items.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Nothing waiting on review right now.
            </CardContent>
          </Card>
        )}
        {items.map((item, i) => (
          <Link key={item.id} href={`/studio/review/${item.id}`} className="block">
            <Card className="transition-colors hover:border-primary/40">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {CONTENT_TYPE_LABELS[item.content_type] ?? item.content_type}
                    {briefs[i] ? ` · ${briefs[i]!.topic}` : ""}
                  </p>
                </div>
                <Badge variant="outline">{item.status.replace("_", " ")}</Badge>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
