import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

const TAG_COLORS: Record<string, string> = {
  "技术": "text-blue",
  "前端": "text-blue",
  "后端": "text-purple",
  "工具": "text-green",
  "阅读": "text-accent",
  "思考": "text-purple",
  "随笔": "text-text-secondary",
  "开源": "text-green",
};

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      {/* Hero */}
      <section className="mb-14">
        <p className="text-accent font-mono text-xs tracking-[0.3em] mb-4">~/geek.blog</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
          随手记，不辜负每一段<span className="text-accent">好奇心</span>。
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed max-w-xl">
          技术笔记、工具推荐、阅读思考。不追热点，不写水文，只记录值得沉淀的东西。
        </p>
      </section>

      {/* Post list */}
      <section>
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-text-muted">还没有文章，去后台写第一篇吧</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/posts/${post.slug}`} className="group block -mx-3 px-3 py-3.5 rounded-xl hover:bg-card/60 transition-all duration-200">
                  <article className="flex flex-col sm:flex-row sm:items-baseline sm:gap-6">
                    {/* Date — left column on desktop */}
                    <time dateTime={post.date} className="font-mono text-xs text-text-muted shrink-0 sm:w-24 sm:text-right sm:pt-0.5 mb-1 sm:mb-0">
                      {post.date}
                    </time>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-semibold text-text group-hover:text-accent transition-colors leading-snug">
                        {post.title}
                      </h2>
                      <p className="mt-0.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {post.description}
                      </p>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {post.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className={`inline-block text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-bg-raised border border-border ${
                                TAG_COLORS[tag] || "text-text-muted"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
