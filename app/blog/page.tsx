import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { BlogCard } from "@/features/blog/blog-card";
import { BlogSearch } from "@/features/blog/blog-search";
import { BlogPagination } from "@/features/blog/pagination";
import { Badge } from "@/components/ui/badge";
import { getAllCategories, getAllTags, getPublishedPosts } from "@/services/blog";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, research and practical guidance on Relationship Intelligence, caregiving and the TALK Model from the VelNit Life team.",
  alternates: { canonical: "/blog" },
};

const PAGE_SIZE = 6;

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const [allPosts, categories, tags] = await Promise.all([
    getPublishedPosts(),
    getAllCategories(),
    getAllTags(),
  ]);

  const query = params.q?.toLowerCase().trim();
  const category = params.category;
  const tag = params.tag;
  const page = Math.max(1, Number(params.page) || 1);

  let filtered = allPosts;
  if (query) {
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        (post.excerpt ?? "").toLowerCase().includes(query)
    );
  }
  if (category) {
    filtered = filtered.filter((post) => post.category?.slug === category);
  }
  if (tag) {
    filtered = filtered.filter((post) => post.tags.some((t) => t.slug === tag));
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Stories & Research on Relationship Intelligence"
        description="Practical guidance for couples, families and caregivers navigating life's second chapter."
      />

      <section className="pb-24">
        <Container>
          <div className="mx-auto max-w-xl">
            <BlogSearch defaultValue={params.q} />
          </div>

          {(categories.length > 0 || tags.length > 0) && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <Link href="/blog">
                <Badge variant={!category && !tag ? "default" : "outline"}>All</Badge>
              </Link>
              {categories.map((c) => (
                <Link key={c.id} href={`/blog?category=${c.slug}`}>
                  <Badge variant={category === c.slug ? "default" : "outline"}>{c.name}</Badge>
                </Link>
              ))}
              {tags.map((t) => (
                <Link key={t.id} href={`/blog?tag=${t.slug}`}>
                  <Badge variant={tag === t.slug ? "sage" : "outline"}>#{t.name}</Badge>
                </Link>
              ))}
            </div>
          )}

          {!isSupabaseConfigured && (
            <p className="mt-14 text-center text-muted-foreground">
              Connect Supabase and run the seed script to populate the blog
              with content. See docs/SUPABASE_SETUP.md.
            </p>
          )}

          {isSupabaseConfigured && paginated.length === 0 && (
            <p className="mt-14 text-center text-muted-foreground">
              No articles match your search yet. Try a different term or{" "}
              <Link href="/blog" className="underline">
                view all posts
              </Link>
              .
            </p>
          )}

          {paginated.length > 0 && (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((post, index) => (
                <BlogCard key={post.id} post={post} delay={index * 0.05} />
              ))}
            </div>
          )}

          <BlogPagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/blog"
            searchParams={{ q: params.q, category, tag }}
          />
        </Container>
      </section>
    </>
  );
}
