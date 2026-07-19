import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <section className="mb-12">
        <h1 className="text-2xl font-bold text-text">文章</h1>
        <p className="mt-2 text-text-secondary leading-relaxed">
          技术笔记、工具推荐、阅读思考。不追热点，只写值得沉淀的东西。
        </p>
      </section>

      <section>
        {posts.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <p>还没有文章。</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/posts/${post.slug}`} className="group block">
                  <h2 className="text-lg font-semibold text-text group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                    {post.description}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-text-muted font-mono">
                    <time dateTime={post.date}>{post.date}</time>
                    {post.tags.length > 0 && (
                      <span>{post.tags.map((t: string) => `#${t}`).join(" ")}</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
