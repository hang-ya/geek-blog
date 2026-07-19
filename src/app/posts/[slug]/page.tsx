import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const html = renderMarkdown(post.content);

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      {/* Back navigation */}
      <nav className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors font-mono group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>cd ..</span>
        </Link>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-text leading-tight tracking-tight">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <time dateTime={post.date} className="font-mono text-sm text-text-muted">
            {post.date}
          </time>
          {post.tags.length > 0 && (
            <span className="text-sm text-text-secondary">·</span>
          )}
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-block text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-card border border-border text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {post.description && (
          <p className="mt-4 text-text-secondary leading-relaxed text-base italic border-l-2 border-accent-soft pl-4">
            {post.description}
          </p>
        )}
      </header>

      {/* Article body */}
      <article className="prose" dangerouslySetInnerHTML={{ __html: html }} />

      {/* Separator */}
      <hr className="my-12 border-border" />

      {/* Footer nav */}
      <footer className="flex items-center justify-between text-sm font-mono">
        <Link href="/" className="text-text-muted hover:text-accent transition-colors">
          ← 返回首页
        </Link>
        <a
          href={`https://github.com/hang-ya/geek-blog/edit/main/content/posts/${slug}.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted hover:text-accent transition-colors"
        >
          编辑 →
        </a>
      </footer>
    </div>
  );
}
