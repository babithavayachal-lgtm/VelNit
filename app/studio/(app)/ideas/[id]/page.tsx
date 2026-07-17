import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  getContentBriefsForIdea,
  getContentIdea,
  listKnowledgeReferences,
} from "@/services/content-os";
import { BriefForm } from "@/features/studio/brief-form";

export const metadata: Metadata = { title: "Idea" };

export default async function StudioIdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idea = await getContentIdea(id);
  if (!idea) notFound();

  const [briefs, knowledgeRefs] = await Promise.all([
    getContentBriefsForIdea(id),
    listKnowledgeReferences(),
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          <Link href="/studio" className="hover:text-foreground">
            Ideas
          </Link>{" "}
          / Idea
        </p>
        <h1 className="mt-1 font-heading text-2xl font-semibold">{idea.topic}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{idea.audience}</p>
        <Badge variant="outline" className="mt-3">
          {idea.status.replace("_", " ")}
        </Badge>
        {idea.notes && <p className="mt-4 max-w-2xl text-sm">{idea.notes}</p>}

        <h2 className="mt-8 font-heading text-lg font-semibold">Briefs from this idea</h2>
        <div className="mt-4 space-y-3">
          {briefs.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-sm text-muted-foreground">
                No brief yet - turn this idea into a brief using the form.
              </CardContent>
            </Card>
          )}
          {briefs.map((brief) => (
            <Link key={brief.id} href={`/studio/briefs/${brief.id}`} className="block">
              <Card className="transition-colors hover:border-primary/40">
                <CardHeader className="flex-row items-center justify-between space-y-0 py-4">
                  <CardTitle className="text-base">{brief.talk_stage}</CardTitle>
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

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base">Turn into a brief</CardTitle>
        </CardHeader>
        <CardContent>
          <BriefForm
            ideaId={idea.id}
            defaultTopic={idea.topic}
            defaultAudience={idea.audience}
            knowledgeRefs={knowledgeRefs}
          />
        </CardContent>
      </Card>
    </div>
  );
}
