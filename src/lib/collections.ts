import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllPosts } from "./posts";

export interface CollectionMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  cover?: string;
  body?: string;   // markdown body content
  posts: string[]; // post slugs (derived from posts that reference this collection)
  draft?: boolean;
}

export interface Collection extends CollectionMeta {
  body?: string;
  posts: string[];
}

const DIR = path.join(process.cwd(), "content", "collections");

/**
 * Derive the post list for a collection from two sources:
 * 1. The collection's own `posts` field (from CMS list widget — primary, preserves manual order)
 * 2. Posts that declare `series: <this-slug>` in their frontmatter (auto-derived)
 *
 * When an explicit posts list exists, it takes priority and remaining derived posts
 * are appended. When no explicit list, posts are derived purely from the series field.
 */
function resolvePosts(slug: string, explicitPosts: string[]): string[] {
  const allPosts = getAllPosts();
  const derived = allPosts
    .filter((p) => p.series === slug)
    .map((p) => p.slug);

  // If no explicit list, use purely derived order (backward compatible)
  if (!explicitPosts || explicitPosts.length === 0) {
    return derived;
  }

  // Explicit order takes priority; append any derived posts not already in the list
  const seen = new Set(explicitPosts);
  const merged = [...explicitPosts];
  for (const s of derived) {
    if (!seen.has(s)) {
      merged.push(s);
      seen.add(s);
    }
  }
  return merged;
}

/** Extract post slugs from CMS list widget format or plain string array */
function extractPostSlugs(rawPosts: unknown): string[] {
  if (!Array.isArray(rawPosts)) return [];
  return rawPosts.map((p: unknown) => {
    if (typeof p === 'string') return p;
    if (p && typeof p === 'object' && 'post' in (p as Record<string, unknown>)) {
      return (p as Record<string, unknown>).post as string;
    }
    return '';
  }).filter(Boolean);
}

export function getAllCollections(): CollectionMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(DIR, f), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title || "",
        description: data.description || "",
        date: typeof data.date === 'string' ? data.date : data.date ? data.date.toISOString().slice(0, 10) : "",
        cover: data.cover || undefined,
        posts: resolvePosts(slug, extractPostSlugs(data.posts)),
        draft: data.draft === true,
      };
    })
    .filter((c) => !c.draft)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

export function getCollectionBySlug(slug: string): Collection | null {
  const file = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  if (data.draft) return null;
  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    date: typeof data.date === 'string' ? data.date : data.date ? data.date.toISOString().slice(0, 10) : "",
    cover: data.cover || undefined,
    body: content?.trim() || undefined,
    posts: resolvePosts(slug, extractPostSlugs(data.posts)),
  };
}

/** Find which collection(s) a post belongs to */
export function getCollectionsForPost(postSlug: string): CollectionMeta[] {
  return getAllCollections().filter((c) => c.posts.includes(postSlug));
}

/** Get prev/next post in a collection */
export function getAdjacentPosts(collection: Collection, postSlug: string) {
  const idx = collection.posts.indexOf(postSlug);
  if (idx === -1) return { prev: null, next: null };
  const allPosts = getAllPosts();
  const prev = idx > 0 ? allPosts.find((p) => p.slug === collection.posts[idx - 1]) || null : null;
  const next = idx < collection.posts.length - 1 ? allPosts.find((p) => p.slug === collection.posts[idx + 1]) || null : null;
  return { prev, next };
}
