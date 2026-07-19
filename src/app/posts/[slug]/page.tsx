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
    <div className="max-w-2xl mx-auto px-5 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors font-mono mb-8"
      >
        ← cd ..
      </Link>

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-text leading-tight">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono">
          <time dateTime={post.date} className="text-text-secondary">{post.date}</time>
          {post.tags.length > 0 && (
            <span className="text-accent">
              {post.tags.map((t: string) => `#${t}`).join(" ")}
            </span>
          )}
        </div>
        {post.description && (
          <p className="mt-3 text-text-secondary italic">{post.description}</p>
        )}
      </header>

      <article className="prose" dangerouslySetInnerHTML={{ __html: html }} />

      <hr className="mt-12 mb-8 border-border" />

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
