import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getContentBrief,
  getContentItemsForBrief,
  getKnowledgeReferencesByIds,
} from "@/services/content-os";
import { GenerateButton } from "@/features/studio/generate-button";

export const metadata: Metadata = { title: "Brief" };

const CONTENT_TYPE_LABELS: Record<string, string> = {
  article: "Website article",
  facebook: "Facebook post",
  newsletter: "Newsletter",
  reel: "Reel script",
};

export default async function StudioBriefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brief = await getContentBrief(id);
  if (!brief) notFound();

  const [items, knowledgeRefs] = await Promise.all([
    getContentItemsForBrief(id),
    getKnowledgeReferencesByIds(brief.knowledge_reference_ids),
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          <Link href="/studio/briefs" className="hover:text-foreground">
            Briefs
          </Link>{" "}
          / Brief
        </p>
        <h1 className="mt-1 font-heading text-2xl font-semibold">{brief.topic}</h1>
        <Badge variant="outline" className="mt-3">
          {brief.status.replace("_", " ")}
        </Badge>

        <h2 className="mt-8 font-heading text-lg font-semibold">Generated drafts</h2>
        <div className="mt-4">
          <GenerateButton briefId={brief.id} />
        </div>

        <div className="mt-6 space-y-3">
          {items.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-sm text-muted-foreground">
                No drafts generated yet.
              </CardContent>
            </Card>
          )}
          {items.map((item) => (
            <Link key={item.id} href={`/studio/review/${item.id}`} className="block">
              <Card className="transition-colors hover:border-primary/40">
                <CardHeader className="flex-row items-center justify-between space-y-0 py-4">
                  <div>
                    <CardTitle className="text-base">
                      {CONTENT_TYPE_LABELS[item.content_type] ?? item.content_type}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{item.title}</p>
                  </div>
                  <Badge variant="outline">{item.status.replace("_", " ")}</Badge>
                </CardHeader>
                {item.generation_error && (
                  <CardContent className="pt-0 text-xs text-destructive">
                    Generation error: {item.generation_error}
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base">Brief details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-medium text-foreground">Audience</p>
            <p className="text-muted-foreground">{brief.audience}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Primary emotion</p>
            <p className="text-muted-foreground">{brief.primary_emotion}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Desired outcome</p>
            <p className="text-muted-foreground">{brief.desired_outcome}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">TALK stage</p>
            <p className="text-muted-foreground">{brief.talk_stage}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">VRIF pillars</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {brief.vrif_pillars.map((pillar) => (
                <Badge key={pillar} variant="secondary">
                  {pillar}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium text-foreground">Practical action</p>
            <p className="text-muted-foreground">{brief.practical_action}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Call to action</p>
            <p className="text-muted-foreground">{brief.call_to_action}</p>
          </div>
          {brief.prohibited_claims && (
            <div>
              <p className="font-medium text-foreground">Prohibited claims</p>
              <p className="text-muted-foreground">{brief.prohibited_claims}</p>
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">Knowledge references</p>
            {knowledgeRefs.length === 0 ? (
              <p className="text-muted-foreground">None attached.</p>
            ) : (
              <ul className="mt-1 space-y-2">
                {knowledgeRefs.map((ref) => (
                  <li key={ref.id} className="text-muted-foreground">
                    <span className="font-medium text-foreground">{ref.concept}</span> -{" "}
                    {ref.summary}{" "}
                    <span className="text-xs">
                      ({ref.source_document}
                      {ref.section ? ` / ${ref.section}` : ""})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
