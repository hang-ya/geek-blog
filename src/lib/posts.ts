import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  collection?: string;
  cover?: string;
  draft?: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** Get all published posts sorted by date (newest first) */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data } = matter(raw);
    return {
      slug: file.replace(/\.md$/, ""),
      title: data.title || "",
      date: typeof data.date === 'string' ? data.date : data.date ? data.date.toISOString().slice(0, 10) : "",
      description: data.description || "",
      tags: data.tags || [],
      collection: data.collection || undefined,
      cover: data.cover || undefined,
      draft: data.draft === true,
    } as PostMeta;
  });

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

/** Get all unique tags with post counts */
export function getAllTags(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.tags) {
      map.set(t, (map.get(t) || 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** Get posts filtered by tag */
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) =>
    p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/** Get a single post by slug */
export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || "",
    date: typeof data.date === 'string' ? data.date : data.date ? data.date.toISOString().slice(0, 10) : "",
    description: data.description || "",
    tags: data.tags || [],
    collection: data.collection || undefined,
    draft: data.draft === true,
    content,
  };
}
