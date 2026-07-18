import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
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
      date: data.date || "",
      description: data.description || "",
      tags: data.tags || [],
      draft: data.draft === true,
    } as PostMeta;
  });

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
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
    date: data.date || "",
    description: data.description || "",
    tags: data.tags || [],
    draft: data.draft === true,
    content,
  };
}
