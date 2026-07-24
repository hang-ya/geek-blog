import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getAllCollections } from "@/lib/collections";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://geek.tzyday.com";
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/collections`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const posts = getAllPosts().map((p) => ({
    url: `${baseUrl}/posts/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const tags = getAllPosts()
    .flatMap((p) => p.tags)
    .filter((t, i, arr) => arr.indexOf(t) === i)
    .map((tag) => ({
      url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

  const collections = getAllCollections().map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: c.date,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...posts, ...tags, ...collections];
}
