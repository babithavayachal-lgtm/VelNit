import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { listContentIdeas } from "@/services/content-os";
import { IdeaForm } from "@/features/studio/idea-form";

export const metadata: Metadata = { title: "Ideas" };

export default async function StudioIdeasPage() {
  const ideas = await listContentIdeas();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Content ideas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every idea moves idea &rarr; brief &rarr; draft &rarr; review. Nothing publishes
          automatically.
        </p>

        <div className="mt-6 space-y-4">
          {ideas.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-sm text-muted-foreground">
                No ideas yet. Add the first one to start the pipeline.
              </CardContent>
            </Card>
          )}
          {ideas.map((idea) => (
            <Link key={idea.id} href={`/studio/ideas/${idea.id}`} className="block">
              <Card className="transition-colors hover:border-primary/40">
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">{idea.topic}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{idea.audience}</p>
                  </div>
                  <Badge variant="outline">{idea.status.replace("_", " ")}</Badge>
                </CardHeader>
                <CardContent className="pt-0 text-xs text-muted-foreground">
                  Created {formatDate(idea.created_at)}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base">New idea</CardTitle>
        </CardHeader>
        <CardContent>
          <IdeaForm />
        </CardContent>
      </Card>
    </div>
  );
}
