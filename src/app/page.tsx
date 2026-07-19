import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();

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
    </div>
  );
}
