import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { listContentBriefs } from "@/services/content-os";

export const metadata: Metadata = { title: "Briefs" };

export default async function StudioBriefsPage() {
  const briefs = await listContentBriefs();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Content briefs</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every brief can generate four draft formats at once: article, Facebook post,
        newsletter, and reel script.
      </p>

      <div className="mt-6 space-y-4">
        {briefs.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              No briefs yet. Create an idea first, then turn it into a brief.
            </CardContent>
          </Card>
        )}
        {briefs.map((brief) => (
          <Link key={brief.id} href={`/studio/briefs/${brief.id}`} className="block">
            <Card className="transition-colors hover:border-primary/40">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">{brief.topic}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {brief.audience} &middot; {brief.talk_stage}
                  </p>
                </div>
                <Badge variant="outline">{brief.status.replace("_", " ")}</Badge>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-muted-foreground">
                Created {formatDate(brief.created_at)}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
