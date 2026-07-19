import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-14">
        <h1 className="text-4xl font-bold text-text tracking-tight">文章</h1>
        <p className="mt-3 text-lg text-text-secondary">
          技术笔记、工具推荐、阅读思考。
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-center py-20 text-text-muted text-lg">还没有文章。</p>
      ) : (
        <div>
          {posts.map((post, i) => (
            <article key={post.slug}>
              {i > 0 && <hr className="border-border-light" />}
              <Link
                href={`/posts/${post.slug}`}
                className="block py-6 group -mx-2 px-2 rounded-lg hover:bg-bg-secondary/50 transition-colors"
              >
                <time dateTime={post.date} className="text-sm text-text-muted font-mono">
                  {post.date}
                </time>
                <h2 className="mt-1 text-xl font-semibold text-text group-hover:text-accent transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="mt-1.5 text-text-secondary leading-relaxed">
                  {post.description}
                </p>
              </Link>
            </article>
          ))}
        </div>
      )}

      {/* Tags section */}
      {tags.length > 0 && (
        <footer className="mt-16 pt-10 border-t border-border">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">标签</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Link
                key={t.name}
                href={`/tags/${t.name}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono bg-bg-secondary text-text-secondary hover:text-accent border border-border hover:border-accent transition-colors"
              >
                {t.name}
                <span className="opacity-50 text-xs">{t.count}</span>
              </Link>
            ))}
          </div>
        </footer>
      )}
    </div>
  );
}
