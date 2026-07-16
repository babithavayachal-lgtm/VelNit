import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, readingTime } from "@/lib/utils";
import type { BlogPostWithRelations } from "@/types/database";
import { Reveal } from "@/components/marketing/reveal";

export function BlogCard({ post, delay = 0 }: { post: BlogPostWithRelations; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <Card className="flex h-full flex-col overflow-hidden transition-shadow group-hover:shadow-soft">
          <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-primary/90 to-primary">
            {post.featured_image ? (
              <Image
                src={post.featured_image}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center font-heading text-lg font-medium text-primary-foreground/90">
                {post.title}
              </div>
            )}
          </div>
          <CardContent className="flex flex-1 flex-col pt-6">
            {post.category && (
              <Badge variant="secondary" className="mb-3 w-fit">
                {post.category.name}
              </Badge>
            )}
            <h3 className="font-heading text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              {post.published_at && formatDate(post.published_at)} &middot;{" "}
              {readingTime(post.content)} min read
            </p>
          </CardContent>
        </Card>
      </Link>
    </Reveal>
  );
}
