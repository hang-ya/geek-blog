import Link from "next/link";
import { getAllCollections } from "@/lib/collections";

export default function CollectionsPage() {
  const collections = getAllCollections();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-14">
        <h1 className="text-4xl font-bold text-text tracking-tight">合集</h1>
        <p className="mt-3 text-lg text-text-secondary">
          系列文章，按主题整理。
        </p>
      </header>

      {collections.length === 0 ? (
        <p className="text-center py-20 text-text-muted text-lg">还没有合集。</p>
      ) : (
        <div>
          {collections.map((c, i) => (
            <article key={c.slug}>
              {i > 0 && <hr className="border-border-light" />}
              <Link
                href={`/collections/${c.slug}`}
                className="block py-6 group -mx-2 px-2 rounded-lg hover:bg-bg-secondary/50 transition-colors"
              >
                <time dateTime={c.date} className="text-sm text-text-muted font-mono">{c.date}</time>
                <h2 className="mt-1 text-xl font-semibold text-text group-hover:text-accent transition-colors leading-snug">
                  {c.title}
                </h2>
                <p className="mt-1.5 text-text-secondary leading-relaxed">{c.description}</p>
                <p className="mt-2 text-sm text-text-muted font-mono">{c.posts.length} 篇文章</p>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
