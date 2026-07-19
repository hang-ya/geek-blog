import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getCollectionsForPost, getCollectionBySlug, getAdjacentPosts } from "@/lib/collections";
import { renderMarkdown } from "@/lib/markdown";

interface Props { params: Promise<{ slug: string }>; }

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const html = renderMarkdown(post.content);

  // Find series info — check post's collection field, then collections system
  const collectionSlug = post.collection || getCollectionsForPost(slug)[0]?.slug;
  const series = collectionSlug ? getCollectionBySlug(collectionSlug) : null;
  const adjacent = series ? getAdjacentPosts(series, slug) : { prev: null, next: null };
  const seriesIndex = series ? series.posts.indexOf(slug) + 1 : 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="inline-flex items-center gap-1 text-text-muted hover:text-accent transition-colors font-mono mb-12">
        ← cd ..
      </Link>

      {/* Series banner */}
      {series && (
        <div className="mb-10 p-4 rounded-lg border border-border bg-bg-secondary">
          <div className="flex items-center justify-between mb-2">
            <Link href={`/collections/${series.slug}`} className="text-sm font-semibold text-accent hover:underline">
              {series.title}
            </Link>
            <span className="text-xs text-text-muted font-mono">{seriesIndex}/{series.posts.length}</span>
          </div>
          <div className="flex gap-2 text-sm font-mono">
            {adjacent.prev ? (
              <Link href={`/posts/${adjacent.prev.slug}`} className="text-text-muted hover:text-accent transition-colors">
                ← {adjacent.prev.title}
              </Link>
            ) : <span className="text-text-muted opacity-40">← 第一篇</span>}
            <span className="text-border">|</span>
            {adjacent.next ? (
              <Link href={`/posts/${adjacent.next.slug}`} className="text-text-muted hover:text-accent transition-colors">
                {adjacent.next.title} →
              </Link>
            ) : <span className="text-text-muted opacity-40">最后一篇 →</span>}
          </div>
        </div>
      )}

      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight tracking-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 font-mono text-text-muted">
          <time dateTime={post.date}>{post.date}</time>
          {post.tags.length > 0 && (
            <span className="flex flex-wrap gap-2">
              {post.tags.map((t: string) => (
                <Link key={t} href={`/tags/${t}`} className="text-accent hover:underline">
                  #{t}
                </Link>
              ))}
            </span>
          )}
        </div>
        {post.description && (
          <p className="mt-5 text-lg text-text-secondary leading-relaxed">
            {post.description}
          </p>
        )}
      </header>

      <article className="prose" dangerouslySetInnerHTML={{ __html: html }} />

      {/* Series nav at bottom */}
      {series && (
        <nav className="mt-12 p-4 rounded-lg border border-border bg-bg-secondary">
          <p className="text-xs text-text-muted font-mono mb-3">
            {series.title} · {seriesIndex}/{series.posts.length}
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm font-mono">
            {adjacent.prev ? (
              <Link href={`/posts/${adjacent.prev.slug}`} className="text-text-muted hover:text-accent transition-colors">
                ← {adjacent.prev.title}
              </Link>
            ) : <span />}
            {adjacent.next ? (
              <Link href={`/posts/${adjacent.next.slug}`} className="text-text-muted hover:text-accent transition-colors text-right">
                {adjacent.next.title} →
              </Link>
            ) : <span />}
          </div>
        </nav>
      )}

      <hr className="mt-16 mb-8 border-border" />

      <footer className="flex items-center justify-between font-mono text-text-muted">
        <Link href="/" className="hover:text-accent transition-colors">← 返回首页</Link>
        <a
          href={`https://github.com/hang-ya/geek-blog/edit/main/content/posts/${slug}.md`}
          target="_blank" rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >编辑</a>
      </footer>
    </div>
  );
}
