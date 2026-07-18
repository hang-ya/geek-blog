import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      {/* Hero */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold tracking-[0.15em] text-text-body font-mono">
          GEEK
        </h1>
        <p className="mt-3 text-text-secondary leading-relaxed">
          一个极客的个人博客。写技术笔记、工具推荐和阅读思考。
          不做 SEO，不追热点，只写值得写的东西。
        </p>
      </section>

      {/* Post list */}
      <section>
        {posts.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <p className="text-lg mb-2">📝</p>
            <p>还没有文章。</p>
          </div>
        ) : (
          <ul className="space-y-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <article>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="group block"
                  >
                    <h2 className="text-lg font-semibold text-text-body group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                      {post.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-text-muted font-mono">
                      <time dateTime={post.date}>
                        {post.date}
                      </time>
                      {post.tags.length > 0 && (
                        <span>
                          {post.tags.map((tag: string) => `#${tag}`).join(" ")}
                        </span>
                      )}
                    </div>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
