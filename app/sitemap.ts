import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants/site";
import { getPublishedPosts } from "@/services/blog";

const staticRoutes = [
  "",
  "/about",
  "/relationship-intelligence",
  "/care",
  "/connect",
  "/companion",
  "/academy",
  "/blog",
  "/contact",
  "/beta",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
