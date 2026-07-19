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
  posts: string[]; // post slugs in order
  draft?: boolean;
}

export interface Collection extends CollectionMeta {
  posts: string[];
}

const DIR = path.join(process.cwd(), "content", "collections");

export function getAllCollections(): CollectionMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(DIR, f), "utf-8");
      const { data } = matter(raw);
      return {
        slug: f.replace(/\.md$/, ""),
        title: data.title || "",
        description: data.description || "",
        date: data.date || "",
        cover: data.cover || undefined,
        posts: data.posts || [],
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
  const { data } = matter(raw);
  if (data.draft) return null;
  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    date: data.date || "",
    cover: data.cover || undefined,
    posts: data.posts || [],
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
