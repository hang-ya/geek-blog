import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCollections, getCollectionBySlug } from "@/lib/collections";
import { getAllPosts } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import CollectionSortToggle from "@/components/CollectionSortToggle";

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
    .filter((p) => p != null);

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
      </header>

      {/* Collection body (markdown) */}
      {collection.body && (
        <div className="prose mb-12" dangerouslySetInnerHTML={{ __html: renderMarkdown(collection.body) }} />
      )}

      <CollectionSortToggle posts={posts} collectionSlug={slug} />
    </div>
  );
}
