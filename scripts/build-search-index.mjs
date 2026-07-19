// ESM wrapper — run with: node scripts/build-search-index.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const POSTS_DIR = path.join(root, "content", "posts");
const OUT = path.join(root, "public", "search-index.json");

function build() {
  const entries = [];

  if (!fs.existsSync(POSTS_DIR)) {
    fs.writeFileSync(OUT, "[]");
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");

    // Simple frontmatter parser (avoid gray-matter ESM issues)
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) continue;

    const yaml = match[1];
    const content = match[2];

    // Parse frontmatter fields
    const get = (key) => {
      const m = yaml.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
      return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
    };
    const getList = (key) => {
      const m = yaml.match(new RegExp(`^${key}:\\s*\\n((?:\\s*-\\s*.+\\n?)*)`, "m"));
      if (!m) return [];
      return m[1].split("\n").filter((l) => l.trim().startsWith("-")).map((l) => l.replace(/^\s*-\s*/, "").trim());
    };

    if (get("draft") === "true") continue;

    const text = content
      .replace(/#{1,6}\s+/g, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/[>*_`~\[\]()|]/g, "")
      .replace(/\n+/g, " ")
      .trim();

    entries.push({
      slug: file.replace(/\.md$/, ""),
      title: get("title"),
      description: get("description"),
      date: get("date"),
      tags: getList("tags"),
      content: text.slice(0, 300),
    });
  }

  entries.sort((a, b) => (b.date > a.date ? 1 : -1));
  fs.writeFileSync(OUT, JSON.stringify(entries));
  console.log(`Search index: ${entries.length} posts`);
}

build();
