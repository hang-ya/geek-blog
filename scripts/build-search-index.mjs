// Build search index — run with: node scripts/build-search-index.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(root, "content", "posts");
const OUT = path.join(root, "public", "search-index.json");

const entries = [];

if (fs.existsSync(POSTS_DIR)) {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    if (data.draft) continue;

    // Strip markdown for snippet
    const text = content
      .replace(/#{1,6}\s+/g, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/[>*_`~\[\]()|]/g, "")
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
}

entries.sort((a, b) => (b.date > a.date ? 1 : -1));
fs.writeFileSync(OUT, JSON.stringify(entries));
console.log(`Search index: ${entries.length} posts`);
