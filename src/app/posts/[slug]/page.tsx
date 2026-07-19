import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getCollectionsForPost, getCollectionBySlug, getAdjacentPosts } from "@/lib/collections";
import { renderMarkdown } from "@/lib/markdown";

interface Props { params: Promise<{ slug: string }>; }

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.length > 0 ? posts.map((post) => ({ slug: post.slug })) : [{ slug: "_" }];
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const html = renderMarkdown(post.content);

  const collectionSlug = post.collection || getCollectionsForPost(slug)[0]?.slug;
  const series = collectionSlug ? getCollectionBySlug(collectionSlug) : null;
  const adjacent = series ? getAdjacentPosts(series, slug) : { prev: null, next: null };
  const seriesIndex = series ? series.posts.indexOf(slug) + 1 : 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-1 text-text-muted hover:text-accent transition-colors font-mono mb-10">
        ← 返回首页
      </Link>

      {/* Cover image */}
      {post.cover && (
        <div className="mb-10 rounded-xl overflow-hidden border border-border aspect-[2/1]">
          <img src={post.cover} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Series banner */}
      {series && (
        <div className="mb-8 p-4 rounded-lg border border-border bg-bg-secondary">
          <div className="flex items-center justify-between mb-2">
            <Link href={`/collections/${series.slug}`} className="text-sm font-semibold text-accent hover:underline">
              {series.title}
            </Link>
            <span className="text-xs text-text-muted font-mono">{seriesIndex}/{series.posts.length}</span>
          </div>
          <div className="flex gap-2 text-sm font-mono">
            {adjacent.prev ? (
              <Link href={`/posts/${adjacent.prev.slug}`} className="text-text-muted hover:text-accent transition-colors">← 上一篇</Link>
            ) : <span className="text-text-muted opacity-40">← 第一篇</span>}
            <span className="text-border">|</span>
            {adjacent.next ? (
              <Link href={`/posts/${adjacent.next.slug}`} className="text-text-muted hover:text-accent transition-colors">下一篇 →</Link>
            ) : <span className="text-text-muted opacity-40">最后一篇 →</span>}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight tracking-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm font-mono text-text-muted">
          <time dateTime={post.date}>{post.date}</time>
          {post.tags.length > 0 && (
            <span className="flex flex-wrap gap-2">
              {post.tags.map((t: string) => (
                <Link key={t} href={`/tags/${t}`} className="text-accent hover:underline">#{t}</Link>
              ))}
            </span>
          )}
        </div>
        {post.description && (
          <p className="mt-5 text-lg text-text-secondary leading-relaxed">{post.description}</p>
        )}
      </header>

      {/* Body */}
      <article className="prose" dangerouslySetInnerHTML={{ __html: html }} />

      {/* Bottom series nav */}
      {series && (
        <nav className="mt-14 p-4 rounded-lg border border-border bg-bg-secondary">
          <p className="text-xs text-text-muted font-mono mb-3">{series.title} · {seriesIndex}/{series.posts.length}</p>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm font-mono">
            {adjacent.prev ? (
              <Link href={`/posts/${adjacent.prev.slug}`} className="text-text-muted hover:text-accent transition-colors">← {adjacent.prev.title}</Link>
            ) : <span />}
            {adjacent.next ? (
              <Link href={`/posts/${adjacent.next.slug}`} className="text-text-muted hover:text-accent transition-colors text-right">{adjacent.next.title} →</Link>
            ) : <span />}
          </div>
        </nav>
      )}

      <hr className="mt-14 mb-8 border-border" />

      <footer className="flex items-center justify-between text-sm font-mono text-text-muted">
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
