"use client";

import { useState } from "react";
import type { PostMeta } from "@/lib/posts";
import Link from "next/link";

export type SortOrder = "desc" | "asc";

interface Props {
  posts: PostMeta[];
  collectionSlug: string;
}

export default function CollectionSortToggle({ posts, collectionSlug }: Props) {
  const [order, setOrder] = useState<SortOrder>("desc");

  const sorted = order === "asc" ? [...posts].reverse() : posts;

  if (posts.length === 0) {
    return <p className="text-center py-10 text-text-muted">这个合集还没有文章。</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-text-muted font-mono">{posts.length} 篇文章</span>
        <button
          onClick={() => setOrder((o) => (o === "desc" ? "asc" : "desc"))}
          className="text-sm font-mono text-text-muted hover:text-accent transition-colors"
          title={order === "desc" ? "切换为最早在前" : "切换为最新在前"}
        >
          {order === "desc" ? "↓ 最新在前" : "↑ 最早在前"}
        </button>
      </div>
      <div>
        {sorted.map((post, i) => (
          <article key={post.slug}>
            {i > 0 && <hr className="border-border-light" />}
            <Link
              href={`/posts/${post.slug}`}
              className="block py-6 group -mx-2 px-2 rounded-lg hover:bg-bg-secondary/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <span className="shrink-0 text-sm text-text-muted font-mono mt-0.5">
                  {order === "desc" ? posts.length - i : i + 1}
                </span>
                <div className="min-w-0 flex-1 flex gap-4">
                  {post.cover && (
                    <div className="shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-bg-secondary border border-border">
                      <img src={post.cover} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <time dateTime={post.date} className="text-xs text-text-muted font-mono">
                      {post.date}
                    </time>
                    <h2 className="mt-1 text-lg font-semibold text-text group-hover:text-accent transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="mt-0.5 text-sm text-text-secondary leading-relaxed">
                      {post.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
