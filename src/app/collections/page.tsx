import Link from "next/link";
import { getAllCollections } from "@/lib/collections";

export default function CollectionsPage() {
  const collections = getAllCollections();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-14">
        <h1 className="text-4xl font-bold text-text tracking-tight">合集</h1>
        <p className="mt-3 text-lg text-text-secondary">系列文章，按主题整理。</p>
      </header>

      {collections.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📚</p>
          <p className="text-text-muted text-lg">还没有合集，去后台创建一个吧</p>
          <a href="/admin/" className="inline-block mt-4 text-accent hover:underline text-sm font-mono">
            打开后台 →
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group block rounded-xl border border-border overflow-hidden hover:border-accent/30 hover:shadow-sm transition-all bg-card"
            >
              {c.cover ? (
                <div className="aspect-[16/9] bg-bg-secondary overflow-hidden">
                  <img src={c.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-bg-secondary flex items-center justify-center text-4xl text-text-muted">📚</div>
              )}
              <div className="p-5">
                <time dateTime={c.date} className="text-xs text-text-muted font-mono">{c.date}</time>
                <h2 className="mt-1.5 text-lg font-semibold text-text group-hover:text-accent transition-colors leading-snug">
                  {c.title}
                </h2>
                <p className="mt-1.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                  {c.description}
                </p>
                <p className="mt-2 text-xs text-text-muted font-mono">{c.posts.length} 篇文章</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
