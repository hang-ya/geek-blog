import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCollections, getCollectionBySlug } from "@/lib/collections";
import { getAllPosts } from "@/lib/posts";

interface Props { params: Promise<{ slug: string }>; }

export function generateStaticParams() {
  const cols = getAllCollections();
  return cols.length > 0 ? cols.map((c) => ({ slug: c.slug })) : [{ slug: "_" }];
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const allPosts = getAllPosts();
  const posts = collection.posts
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/collections" className="text-text-muted hover:text-accent transition-colors font-mono">
        ← 所有合集
      </Link>

      {/* Cover */}
      {collection.cover && (
        <div className="mt-8 mb-10 rounded-xl overflow-hidden border border-border aspect-[2/1]">
          <img src={collection.cover} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <header className="mb-12">
        <h1 className="text-3xl font-bold text-text tracking-tight">{collection.title}</h1>
        <p className="mt-3 text-lg text-text-secondary">{collection.description}</p>
        <p className="mt-2 text-sm text-text-muted font-mono">{posts.length} 篇文章</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-center py-10 text-text-muted">这个合集还没有文章。</p>
      ) : (
        <div>
          {posts.map((post, i) => (
            <article key={post!.slug}>
              {i > 0 && <hr className="border-border-light" />}
              <Link
                href={`/posts/${post!.slug}`}
                className="block py-6 group -mx-2 px-2 rounded-lg hover:bg-bg-secondary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="shrink-0 text-sm text-text-muted font-mono mt-0.5">{i + 1}</span>
                  <div className="min-w-0 flex-1 flex gap-4">
                    {post!.cover && (
                      <div className="shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-bg-secondary border border-border">
                        <img src={post!.cover} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <time dateTime={post!.date} className="text-xs text-text-muted font-mono">{post!.date}</time>
                      <h2 className="mt-1 text-lg font-semibold text-text group-hover:text-accent transition-colors leading-snug">
                        {post!.title}
                      </h2>
                      <p className="mt-0.5 text-sm text-text-secondary leading-relaxed">{post!.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
