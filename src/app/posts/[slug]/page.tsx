import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
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

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="inline-flex items-center gap-1 text-text-muted hover:text-accent transition-colors font-mono mb-12">
        ← cd ..
      </Link>

      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight tracking-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 font-mono text-text-muted">
          <time dateTime={post.date}>{post.date}</time>
          {post.tags.length > 0 && (
            <span className="text-accent">
              {post.tags.map((t: string) => `#${t}`).join(" ")}
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
