import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/features/blog/blog-card";
import { ArticleJsonLd } from "@/lib/seo/json-ld";
import { formatDate, readingTime } from "@/lib/utils";
import { getPostBySlug, getPublishedPosts, getRelatedPosts } from "@/services/blog";
import { siteConfig } from "@/lib/constants/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      images: post.featured_image ? [post.featured_image] : undefined,
      publishedTime: post.published_at ?? undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);

  return (
    <article className="py-20 sm:py-28">
      <ArticleJsonLd
        title={post.title}
        description={post.seo_description || post.excerpt || post.title}
        url={`${siteConfig.url}/blog/${post.slug}`}
        image={post.featured_image}
        datePublished={post.published_at ?? post.created_at}
        dateModified={post.updated_at}
        authorName={post.author?.name}
      />

      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Blog
        </Link>

        <div className="mt-6">
          {post.category && (
            <Badge variant="secondary" className="mb-4">
              {post.category.name}
            </Badge>
          )}
          <h1 className="text-balance font-heading text-3xl font-semibold sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {post.author?.name ?? siteConfig.name} &middot;{" "}
            {post.published_at && formatDate(post.published_at)} &middot;{" "}
            {readingTime(post.content)} min read
          </p>
        </div>

        {post.featured_image && (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image
              src={post.featured_image}
              alt=""
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-neutral mt-10 max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                <Badge variant="sage">#{tag.name}</Badge>
              </Link>
            ))}
          </div>
        )}
      </Container>

      {related.length > 0 && (
        <Container className="mt-20 max-w-5xl">
          <h2 className="font-heading text-2xl font-semibold">Related articles</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedPost, index) => (
              <BlogCard key={relatedPost.id} post={relatedPost} delay={index * 0.05} />
            ))}
          </div>
        </Container>
      )}
    </article>
  );
}
