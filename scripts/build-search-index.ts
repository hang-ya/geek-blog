/**
 * Build a search index JSON for client-side search.
 * Run after next build: node scripts/build-search-index.mjs
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const OUT = path.join(process.cwd(), "public", "search-index.json");

interface Entry {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string; // first 300 chars for snippet
}

function build() {
  const entries: Entry[] = [];

  if (!fs.existsSync(POSTS_DIR)) {
    fs.writeFileSync(OUT, "[]");
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    if (data.draft) continue;

    const text = content
      .replace(/#{1,6}\s+/g, "") // headings
      .replace(/```[\s\S]*?```/g, "") // code blocks
      .replace(/[>*_`~\[\]()|]/g, "") // markdown chars
      .replace(/\n+/g, " ")
      .trim();

    entries.push({
      slug: file.replace(/\.md$/, ""),
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      tags: data.tags || [],
      content: text.slice(0, 300),
    });
  }

  entries.sort((a, b) => (b.date > a.date ? 1 : -1));
  fs.writeFileSync(OUT, JSON.stringify(entries));
  console.log(`Search index: ${entries.length} posts`);
}

build();
