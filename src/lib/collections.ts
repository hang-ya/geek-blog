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
 * Resolve the ordered post list for a collection.
 *
 * Membership is determined by the post's own `series` field.
 * Order is determined by the collection's `posts` field (a list of slugs
 * or `{post: slug}` objects from the CMS list widget).
 *
 * - Posts listed explicitly come first, in list order.
 * - Remaining posts with `series: <this-slug>` are appended, sorted by
 *   date (newest first).
 */
function resolvePosts(slug: string, explicitPosts: unknown[]): string[] {
  const allPosts = getAllPosts();

  // Normalize explicit posts: they may be plain strings or {post: slug} objects
  const orderSlugs: string[] = (explicitPosts || [])
    .map((item: unknown) =>
      typeof item === "string" ? item : (item as Record<string, string>)?.post || ""
    )
    .filter(Boolean);

  // All posts that declare this collection via their `series` field
  const derived = allPosts
    .filter((p) => p.series === slug)
    .map((p) => p.slug);

  if (orderSlugs.length > 0) {
    const orderSet = new Set(orderSlugs);
    // Start with explicitly ordered posts that actually belong
    const ordered = orderSlugs.filter((s) => derived.includes(s));
    // Append remaining derived posts not in the order list, by date desc
    const remaining = derived
      .filter((s) => !orderSet.has(s))
      .sort((a, b) => {
        const postA = allPosts.find((p) => p.slug === a);
        const postB = allPosts.find((p) => p.slug === b);
        return (postB?.date || "").localeCompare(postA?.date || "");
      });
    return [...ordered, ...remaining];
  }

  // No explicit order → sort by date (newest first)
  return derived.sort((a, b) => {
    const postA = allPosts.find((p) => p.slug === a);
    const postB = allPosts.find((p) => p.slug === b);
    return (postB?.date || "").localeCompare(postA?.date || "");
  });
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
        posts: resolvePosts(slug, data.posts || []),
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
    posts: resolvePosts(slug, data.posts || []),
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
