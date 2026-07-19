import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/posts";

interface Props { params: Promise<{ tag: string }>; }

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.length > 0 ? tags.map((t) => ({ tag: t.name })) : [{ tag: "_" }];
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  const allTags = getAllTags();

  if (posts.length === 0) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-text-muted hover:text-accent transition-colors font-mono">
        ← 返回首页
      </Link>

      <header className="mt-8 mb-12">
        <h1 className="text-3xl font-bold text-text">
          #<span className="text-accent">{tag}</span>
        </h1>
        <p className="mt-2 text-text-secondary">
          {posts.length} 篇文章
        </p>
      </header>

      {/* Post list */}
      <div className="mb-16">
        {posts.map((post, i) => (
          <article key={post.slug}>
            {i > 0 && <hr className="border-border-light" />}
            <Link href={`/posts/${post.slug}`} className="block py-6 group -mx-2 px-2 rounded-lg hover:bg-bg-secondary/50 transition-colors">
              <time dateTime={post.date} className="text-sm text-text-muted font-mono">{post.date}</time>
              <h2 className="mt-1 text-xl font-semibold text-text group-hover:text-accent transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="mt-1.5 text-text-secondary leading-relaxed">{post.description}</p>
            </Link>
          </article>
        ))}
      </div>

      {/* All tags */}
      <footer className="border-t border-border pt-10">
        <h2 className="text-lg font-semibold text-text mb-4">所有标签</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => (
            <Link
              key={t.name}
              href={`/tags/${t.name}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono transition-colors ${
                t.name.toLowerCase() === tag.toLowerCase()
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-secondary hover:text-accent border border-border"
              }`}
            >
              {t.name}
              <span className="opacity-60 text-xs">{t.count}</span>
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
