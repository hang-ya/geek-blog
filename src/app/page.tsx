import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-text tracking-tight">文章</h1>
        <p className="mt-3 text-text-secondary">
          技术笔记、工具推荐、阅读思考。
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-center py-16 text-text-muted">还没有文章。</p>
      ) : (
        <div className="space-y-0">
          {posts.map((post, i) => (
            <article
              key={post.slug}
              className={i > 0 ? "border-t border-border-light" : ""}
            >
              <Link
                href={`/posts/${post.slug}`}
                className="block py-5 group"
              >
                <div className="flex items-baseline gap-4">
                  <time
                    dateTime={post.date}
                    className="shrink-0 text-sm text-text-muted font-mono tabular-nums"
                  >
                    {post.date}
                  </time>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-text group-hover:text-accent transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
