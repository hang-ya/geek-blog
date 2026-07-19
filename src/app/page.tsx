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
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📝</p>
          <p className="text-text-muted text-lg">还没有文章，去后台写第一篇吧</p>
          <a href="/admin/" className="inline-block mt-4 text-accent hover:underline text-sm font-mono">
            打开后台 →
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group block rounded-xl border border-border overflow-hidden hover:border-accent/30 hover:shadow-sm transition-all bg-card"
            >
              {/* Cover */}
              {post.cover ? (
                <div className="aspect-[16/9] bg-bg-secondary overflow-hidden">
                  <img src={post.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-bg-secondary flex items-center justify-center text-4xl text-text-muted">
                  📄
                </div>
              )}

              <div className="p-5">
                <time dateTime={post.date} className="text-xs text-text-muted font-mono">{post.date}</time>
                <h2 className="mt-1.5 text-lg font-semibold text-text group-hover:text-accent transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="mt-1.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                  {post.description}
                </p>
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((t: string) => (
                      <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-bg-secondary text-text-muted border border-border-light">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Tags */}
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
