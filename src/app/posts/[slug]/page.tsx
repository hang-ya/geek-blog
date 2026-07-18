import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Generate static paths for all posts */
export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const html = renderMarkdown(post.content);

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors font-mono mb-8"
      >
        ← cd ..
      </Link>

      {/* Article header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-body leading-tight">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono">
          <time dateTime={post.date} className="text-text-secondary">
            {post.date}
          </time>
          {post.tags.length > 0 && (
            <span className="text-accent">
              {post.tags.map((tag: string) => `#${tag}`).join(" ")}
            </span>
          )}
        </div>
        {post.description && (
          <p className="mt-3 text-text-secondary leading-relaxed italic">
            {post.description}
          </p>
        )}
      </header>

      {/* Article body */}
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
